
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileDown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { toast } from "@/components/ui/use-toast";
import ShiftAnalytics from "@/components/shifts/ShiftAnalytics";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AnalyticsPeriod, Shift, ShiftType } from "@/components/shifts/types";
import { ShiftCalendar } from "@/components/shifts/ShiftCalendar";
import { ShiftDetails } from "@/components/shifts/ShiftDetails";
import { MonthlyReport } from "@/components/shifts/MonthlyReport";
import { ExportPdfDialog } from "@/components/shifts/ExportPdfDialog";
import { EditNoteDialog } from "@/components/shifts/EditNoteDialog";
import { PlanningTab } from "@/components/shifts/PlanningTab";
import { ReportsTab } from "@/components/shifts/ReportsTab";

const Shifts = () => {
  const [activeTab, setActiveTab] = useState("calendar");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [shiftType, setShiftType] = useState<ShiftType>("morning");
  const [userShifts, setUserShifts] = useState<Shift[]>([]);
  const [shiftNotes, setShiftNotes] = useState<string>("");
  const [editNoteDialogOpen, setEditNoteDialogOpen] = useState(false);
  const [analyticsPeriod, setAnalyticsPeriod] = useState<AnalyticsPeriod>("month");
  
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Načtení směn přihlášeného uživatele
  useEffect(() => {
    if (user) {
      loadUserShifts(user.id);
    }
  }, [user]);

  // Načtení směn přihlášeného uživatele
  const loadUserShifts = (userId: string) => {
    const shiftsFromStorage = localStorage.getItem(`shifts_${userId}`);
    if (shiftsFromStorage) {
      try {
        const shifts: Shift[] = JSON.parse(shiftsFromStorage).map((shift: any) => ({
          ...shift,
          date: new Date(shift.date)
        }));
        setUserShifts(shifts);
      } catch (e) {
        console.error("Chyba při načítání směn", e);
      }
    }
  };

  // Handler pro přidání nebo aktualizaci směny
  const handleSaveShift = () => {
    if (!selectedDate || !user) {
      toast.error("Nejprve se přihlašte nebo vyberte datum.");
      return;
    }

    // Kontrola, zda již na tento den existuje směna
    const shiftIndex = userShifts.findIndex(shift => 
      shift.date.getDate() === selectedDate.getDate() && 
      shift.date.getMonth() === selectedDate.getMonth() && 
      shift.date.getFullYear() === selectedDate.getFullYear()
    );

    let updatedShifts: Shift[];
    const newShift: Shift = {
      date: selectedDate,
      type: shiftType,
      userId: user.id,
      notes: shiftNotes
    };

    if (shiftIndex >= 0) {
      // Aktualizace existující směny
      updatedShifts = [...userShifts];
      updatedShifts[shiftIndex] = newShift;
      toast.success("Směna aktualizována");
    } else {
      // Přidání nové směny
      updatedShifts = [...userShifts, newShift];
      toast.success("Směna přidána");
    }

    setUserShifts(updatedShifts);
    localStorage.setItem(`shifts_${user.id}`, JSON.stringify(updatedShifts));
  };

  // Handler pro odstranění směny
  const handleDeleteShift = () => {
    if (!selectedDate || !user) return;

    const updatedShifts = userShifts.filter(shift => 
      !(shift.date.getDate() === selectedDate.getDate() && 
        shift.date.getMonth() === selectedDate.getMonth() && 
        shift.date.getFullYear() === selectedDate.getFullYear())
    );

    if (updatedShifts.length !== userShifts.length) {
      setUserShifts(updatedShifts);
      localStorage.setItem(`shifts_${user.id}`, JSON.stringify(updatedShifts));
      toast.success("Směna odstraněna");
    }
  };

  // Zjištění, zda je na vybraný den naplánovaná směna
  const getShiftForSelectedDate = () => {
    if (!selectedDate || !userShifts.length) return null;
    
    return userShifts.find(shift => 
      shift.date.getDate() === selectedDate.getDate() && 
      shift.date.getMonth() === selectedDate.getMonth() && 
      shift.date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Aktuální směna pro vybraný den
  const currentShift = getShiftForSelectedDate();
  
  // Nastavení typu směny a poznámek podle aktuální směny
  useEffect(() => {
    const shift = getShiftForSelectedDate();
    if (shift) {
      setShiftType(shift.type);
      setShiftNotes(shift.notes || "");
    } else {
      setShiftNotes("");
    }
  }, [selectedDate, userShifts]);
  
  // Otevření dialogu pro editaci poznámky
  const handleOpenNoteDialog = () => {
    setEditNoteDialogOpen(true);
  };

  // Uložení poznámky
  const handleSaveNote = () => {
    if (!selectedDate || !user) return;
    
    const shiftIndex = userShifts.findIndex(shift => 
      shift.date.getDate() === selectedDate.getDate() && 
      shift.date.getMonth() === selectedDate.getMonth() && 
      shift.date.getFullYear() === selectedDate.getFullYear()
    );

    if (shiftIndex >= 0) {
      const updatedShifts = [...userShifts];
      updatedShifts[shiftIndex] = {
        ...updatedShifts[shiftIndex],
        notes: shiftNotes
      };
      
      setUserShifts(updatedShifts);
      localStorage.setItem(`shifts_${user.id}`, JSON.stringify(updatedShifts));
      toast.success("Poznámka ke směně byla uložena");
    }
    
    setEditNoteDialogOpen(false);
  };
  
  return (
    <div className="flex flex-col">
      {/* Header section with DHL colors */}
      <section className="bg-gradient-to-br from-dhl-yellow to-dhl-red py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 text-dhl-black">Plánování směn</h1>
          <p className="text-lg text-dhl-black max-w-3xl mx-auto mb-8">
            Efektivní plánování pracovních směn a spolujízdy pro pendlery.
          </p>
        </div>
      </section>
      
      {/* Main content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="calendar" className="mb-8">
            <TabsList className="mb-4 bg-dhl-yellow text-dhl-black">
              <TabsTrigger value="calendar" className="data-[state=active]:bg-dhl-red data-[state=active]:text-white">Kalendář směn</TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-dhl-red data-[state=active]:text-white">Analytika</TabsTrigger>
              <TabsTrigger value="planning" className="data-[state=active]:bg-dhl-red data-[state=active]:text-white">Plánování tras</TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:bg-dhl-red data-[state=active]:text-white">Reporty</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar Section */}
                <Card className="lg:col-span-2 border-dhl-yellow">
                  <CardHeader className="border-b border-dhl-yellow">
                    <CardTitle>Můj kalendář</CardTitle>
                    <CardDescription>
                      {user 
                        ? `Přehled plánovaných směn pro ${user.user_metadata?.username || user.email?.split('@')[0] || 'Uživatel'}`
                        : "Přihlaste se pro správu vašich směn"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Calendar Component */}
                    <ShiftCalendar 
                      selectedDate={selectedDate}
                      onSelectDate={setSelectedDate}
                      shifts={userShifts}
                    />

                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-3">Detaily směny</h3>
                      {/* Shift Details Component */}
                      <ShiftDetails
                        selectedDate={selectedDate}
                        currentShift={currentShift}
                        shiftType={shiftType}
                        setShiftType={setShiftType}
                        shiftNotes={shiftNotes}
                        setShiftNotes={setShiftNotes}
                        user={user}
                        onSaveShift={handleSaveShift}
                        onDeleteShift={handleDeleteShift}
                        onOpenNoteDialog={handleOpenNoteDialog}
                      />
                    </div>
                    
                    {/* Export PDF Dialog */}
                    <div className="mt-6">
                      <ExportPdfDialog 
                        user={user}
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Monthly Report Component */}
                <Card className="border-dhl-yellow">
                  <CardHeader className="border-b border-dhl-yellow">
                    <CardTitle>Měsíční přehled</CardTitle>
                    <CardDescription>
                      {selectedMonth && format(selectedMonth, "MMMM yyyy", { locale: cs })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MonthlyReport
                      shifts={userShifts}
                      user={user}
                      selectedMonth={selectedMonth}
                      onSelectDate={(date) => {
                        setSelectedDate(date);
                        setActiveTab("calendar");
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              {user ? (
                <ShiftAnalytics 
                  shifts={userShifts} 
                  period={analyticsPeriod} 
                  onPeriodChange={setAnalyticsPeriod}
                />
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Lock className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-muted-foreground mb-2">Přihlaste se pro zobrazení analytiky směn</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => navigate("/login")}
                      variant="default"
                    >
                      Přihlásit se
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            {/* Planning Tab */}
            <TabsContent value="planning" className="space-y-6">
              <PlanningTab user={user} />
            </TabsContent>
            
            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <ReportsTab user={user} shifts={userShifts} />
            </TabsContent>
          </Tabs>

          {/* Edit Note Dialog Component */}
          <EditNoteDialog
            open={editNoteDialogOpen}
            onOpenChange={setEditNoteDialogOpen}
            selectedDate={selectedDate}
            shiftNotes={shiftNotes}
            onNotesChange={setShiftNotes}
            onSaveNote={handleSaveNote}
          />
        </div>
      </section>
    </div>
  );
};

export default Shifts;
