
import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Calendar as CalendarLucide, FileDown, Download, Lock, LogIn, UserPlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Typy směn
type ShiftType = "morning" | "afternoon" | "night";

// Struktura uživatele
interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  premiumExpiry?: Date;
}

// Struktura směny
interface Shift {
  date: Date;
  type: ShiftType;
  userId: string;
}

// Sample data for the employee shifts
const employeeShifts = [
  { id: 1, name: "Jan Novák", userId: "user1", shifts: [3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25, 27, 29] },
  { id: 2, name: "Marie Svobodová", userId: "user2", shifts: [2, 4, 6, 8, 10, 14, 16, 18, 20, 22, 24, 26, 28] },
  { id: 3, name: "Petr Černý", userId: "user3", shifts: [1, 3, 5, 7, 9, 13, 15, 17, 19, 21, 25, 27, 29] },
  { id: 4, name: "Jana Dvořáková", userId: "user4", shifts: [2, 4, 6, 8, 12, 14, 16, 18, 20, 24, 26, 28, 30] },
];

// Testovací uživatelský profil s premium funkcí
const testUser: User = {
  id: "vaclav",
  name: "Václav",
  email: "vaclav@example.com",
  isPremium: true,
  premiumExpiry: new Date(new Date().setMonth(new Date().getMonth() + 3)) // 3 měsíce od dnes
};

const Shifts = () => {
  const [activeTab, setActiveTab] = useState("calendar");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [route, setRoute] = useState({ from: "", to: "", time: "" });
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [shiftType, setShiftType] = useState<ShiftType>("morning");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userShifts, setUserShifts] = useState<Shift[]>([]);
  
  // Načtení stavu přihlášení při načtení stránky
  useEffect(() => {
    const loggedInUser = localStorage.getItem("currentUser");
    if (loggedInUser) {
      try {
        const user = JSON.parse(loggedInUser);
        setCurrentUser(user);
        setIsLoggedIn(true);
        loadUserShifts(user.id);
      } catch (e) {
        console.error("Chyba při načítání uživatele", e);
      }
    }
  }, []);

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

  // Handler for logging in
  const handleLogin = () => {
    if (username === "vaclav" && password === "Vaclav711") {
      const user = testUser;
      setCurrentUser(user);
      setIsLoggedIn(true);
      localStorage.setItem("currentUser", JSON.stringify(user));
      loadUserShifts(user.id);
      setLoginDialogOpen(false);
      toast.success("Přihlášení úspěšné!");
    } else {
      toast.error("Neplatné přihlašovací údaje!");
    }
  };

  // Handler for logging out
  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("currentUser");
    toast.info("Byli jste odhlášeni.");
  };

  // Handler pro přidání nebo aktualizaci směny
  const handleSaveShift = () => {
    if (!selectedDate || !isLoggedIn || !currentUser) {
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
      userId: currentUser.id
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
    localStorage.setItem(`shifts_${currentUser.id}`, JSON.stringify(updatedShifts));
  };

  // Handler pro odstranění směny
  const handleDeleteShift = () => {
    if (!selectedDate || !isLoggedIn || !currentUser) return;

    const updatedShifts = userShifts.filter(shift => 
      !(shift.date.getDate() === selectedDate.getDate() && 
        shift.date.getMonth() === selectedDate.getMonth() && 
        shift.date.getFullYear() === selectedDate.getFullYear())
    );

    if (updatedShifts.length !== userShifts.length) {
      setUserShifts(updatedShifts);
      localStorage.setItem(`shifts_${currentUser.id}`, JSON.stringify(updatedShifts));
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

  // Funkce pro zobrazení data směny ve správném formátu
  const formatShiftDate = (date: Date) => {
    return format(date, "EEEE, d. MMMM yyyy", { locale: cs });
  };
  
  // Zobrazení času směny podle typu
  const getShiftTimeByType = (type: ShiftType) => {
    switch (type) {
      case "morning": return "Ranní (6:00 - 14:00)";
      case "afternoon": return "Odpolední (14:00 - 22:00)";
      case "night": return "Noční (22:00 - 6:00)";
    }
  };

  // Získání barvy pro typ směny
  const getShiftColor = (type: ShiftType) => {
    switch (type) {
      case "morning": return "bg-blue-500";
      case "afternoon": return "bg-green-500";
      case "night": return "bg-purple-500";
    }
  };
  
  // Získání modifikátorů pro kalendář podle směn uživatele
  const getCalendarModifiers = () => {
    if (!userShifts.length) return {};
    
    const morningShifts = userShifts
      .filter(shift => shift.type === "morning")
      .map(shift => new Date(shift.date));
    
    const afternoonShifts = userShifts
      .filter(shift => shift.type === "afternoon")
      .map(shift => new Date(shift.date));
    
    const nightShifts = userShifts
      .filter(shift => shift.type === "night")
      .map(shift => new Date(shift.date));
      
    return {
      morning: morningShifts,
      afternoon: afternoonShifts,
      night: nightShifts,
    };
  };
  
  // Získání stylů pro modifikátory kalendáře
  const getCalendarModifiersStyles = () => {
    return {
      morning: { backgroundColor: "#3b82f6", color: "#ffffff", fontWeight: "bold" },
      afternoon: { backgroundColor: "#22c55e", color: "#ffffff", fontWeight: "bold" },
      night: { backgroundColor: "#8b5cf6", color: "#ffffff", fontWeight: "bold" }
    };
  };

  // Handler for saving route
  const handleSaveRoute = () => {
    if (!isLoggedIn) {
      setLoginDialogOpen(true);
      return;
    }
    toast.success(`Trasa uložena: ${route.from} → ${route.to} v ${route.time}`);
  };

  // Handler for exporting PDF
  const handleExportPDF = () => {
    if (!isLoggedIn) {
      setLoginDialogOpen(true);
      return;
    }
    toast.success("Export do PDF byl zahájen. Soubor bude brzy ke stažení.");
    // In a real implementation, this would trigger a PDF generation process
  };

  // Aktuální směna pro vybraný den
  const currentShift = getShiftForSelectedDate();
  if (currentShift) {
    setShiftType(currentShift.type);
  }
  
  return (
    <div className="flex flex-col">
      {/* Header section with DHL colors */}
      <section className="bg-gradient-to-br from-dhl-yellow to-dhl-red py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 text-dhl-black">Plánování směn</h1>
          <p className="text-lg text-dhl-black max-w-3xl mx-auto mb-8">
            Efektivní plánování pracovních směn a spolujízdy pro pendlery.
          </p>
          
          {/* Login status */}
          <div className="mt-4">
            {!isLoggedIn ? (
              <Button 
                variant="outline" 
                className="bg-white hover:bg-gray-100 flex items-center gap-2"
                onClick={() => setLoginDialogOpen(true)}
              >
                <LogIn className="w-4 h-4" />
                Přihlásit se pro správu směn
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="bg-white px-4 py-2 rounded-md flex items-center gap-2">
                  <span>Přihlášen jako: <strong>{currentUser?.name}</strong></span>
                  {currentUser?.isPremium && (
                    <Badge className="ml-2 bg-amber-500">Premium</Badge>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  className="bg-white hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Odhlásit se
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Login Dialog */}
      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Přihlášení</DialogTitle>
            <DialogDescription>
              Přihlaste se pro správu vašich směn a přístup k dalším funkcím.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Uživatelské jméno</Label>
              <Input 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Zadejte uživatelské jméno" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Heslo</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Zadejte heslo" 
              />
              <p className="text-xs text-muted-foreground mt-1">
                Pro testovací účet: uživatelské jméno <strong>vaclav</strong>, heslo <strong>Vaclav711</strong>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLoginDialogOpen(false)}>
              Zrušit
            </Button>
            <Button onClick={handleLogin}>
              Přihlásit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Main content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="calendar" className="mb-8">
            <TabsList className="mb-4 bg-dhl-yellow text-dhl-black">
              <TabsTrigger value="calendar" className="data-[state=active]:bg-dhl-red data-[state=active]:text-white">Kalendář směn</TabsTrigger>
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
                      {isLoggedIn 
                        ? `Přehled plánovaných směn pro ${currentUser?.name}`
                        : "Přihlaste se pro správu vašich směn"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center p-4 bg-white rounded-lg shadow-sm">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="p-3 pointer-events-auto"
                        locale={cs}
                        showOutsideDays
                        modifiers={getCalendarModifiers()}
                        modifiersStyles={getCalendarModifiersStyles()}
                      />
                    </div>
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-3">Detaily směny</h3>
                      {selectedDate && (
                        <div className="bg-muted p-4 rounded-md">
                          <p className="font-medium">
                            {format(selectedDate, "EEEE, d. MMMM yyyy", { locale: cs })}
                          </p>
                          {currentShift ? (
                            <div className="mt-2">
                              <Badge className={`${getShiftColor(currentShift.type)} text-white hover:opacity-90`}>
                                Naplánovaná směna
                              </Badge>
                              <p className="mt-2">Směna: {getShiftTimeByType(currentShift.type)}</p>
                              
                              {isLoggedIn && (
                                <div className="mt-3">
                                  <Label htmlFor="shift-type">Typ směny</Label>
                                  <Select 
                                    value={shiftType} 
                                    onValueChange={(value: ShiftType) => setShiftType(value)}
                                  >
                                    <SelectTrigger id="shift-type" className="mt-1">
                                      <SelectValue placeholder="Vyberte typ směny" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="morning">Ranní (6:00 - 14:00)</SelectItem>
                                      <SelectItem value="afternoon">Odpolední (14:00 - 22:00)</SelectItem>
                                      <SelectItem value="night">Noční (22:00 - 6:00)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  
                                  <div className="flex gap-2 mt-4">
                                    <Button 
                                      onClick={handleSaveShift} 
                                      variant="default" 
                                      className="flex-1"
                                    >
                                      Aktualizovat směnu
                                    </Button>
                                    <Button 
                                      onClick={handleDeleteShift} 
                                      variant="destructive"
                                    >
                                      Odstranit
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="mt-2">
                              {isLoggedIn ? (
                                <div>
                                  <Badge variant="outline">Volný den</Badge>
                                  <p className="mt-2 text-muted-foreground">Žádná směna naplánovaná na tento den</p>
                                  
                                  <div className="mt-3">
                                    <Label htmlFor="shift-type">Typ směny</Label>
                                    <Select 
                                      value={shiftType} 
                                      onValueChange={(value: ShiftType) => setShiftType(value)}
                                    >
                                      <SelectTrigger id="shift-type" className="mt-1">
                                        <SelectValue placeholder="Vyberte typ směny" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="morning">Ranní (6:00 - 14:00)</SelectItem>
                                        <SelectItem value="afternoon">Odpolední (14:00 - 22:00)</SelectItem>
                                        <SelectItem value="night">Noční (22:00 - 6:00)</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    
                                    <Button 
                                      onClick={handleSaveShift} 
                                      className="mt-4 w-full"
                                    >
                                      Přidat směnu
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <Badge variant="outline">Nepřihlášený uživatel</Badge>
                                  <p className="mt-2 text-muted-foreground">Přihlaste se pro správu směn</p>
                                  <Button 
                                    className="mt-4" 
                                    onClick={() => setLoginDialogOpen(true)}
                                    variant="default"
                                  >
                                    Přihlásit se
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Export PDF Dialog */}
                    <div className="mt-6">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full border-dhl-red text-dhl-red hover:bg-dhl-red/10"
                            disabled={!isLoggedIn}
                          >
                            <FileDown className="mr-2" />
                            Exportovat přehled směn do PDF
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Exportovat směny do PDF</DialogTitle>
                            <DialogDescription>
                              Vyberte měsíc, pro který chcete exportovat přehled směn.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="month">Měsíc</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      id="month"
                                      variant={"outline"}
                                      className={cn(
                                        "w-full justify-start text-left font-normal mt-1",
                                        !selectedMonth && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {selectedMonth ? (
                                        format(selectedMonth, "MMMM yyyy", { locale: cs })
                                      ) : (
                                        <span>Vyberte měsíc</span>
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={selectedMonth}
                                      onSelect={(date) => date && setSelectedMonth(date)}
                                      initialFocus
                                      className="p-3 pointer-events-auto"
                                      locale={cs}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit" onClick={handleExportPDF} className="bg-dhl-red hover:bg-dhl-red/90">
                              <Download className="mr-2 h-4 w-4" />
                              Exportovat
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>

                {/* Monthly Report Preview */}
                <Card className="border-dhl-yellow">
                  <CardHeader className="border-b border-dhl-yellow">
                    <CardTitle>Měsíční přehled</CardTitle>
                    <CardDescription>
                      {selectedMonth && format(selectedMonth, "MMMM yyyy", { locale: cs })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      {isLoggedIn ? (
                        <div>
                          <div className="mb-4">
                            <h3 className="text-md font-medium mb-2">Statistiky směn</h3>
                            <div className="grid grid-cols-3 gap-4">
                              <Card className="bg-blue-50">
                                <CardContent className="py-4 px-3 text-center">
                                  <p className="font-bold text-2xl text-blue-500">
                                    {userShifts.filter(s => s.type === "morning").length}
                                  </p>
                                  <p className="text-sm text-muted-foreground">Ranní</p>
                                </CardContent>
                              </Card>
                              <Card className="bg-green-50">
                                <CardContent className="py-4 px-3 text-center">
                                  <p className="font-bold text-2xl text-green-500">
                                    {userShifts.filter(s => s.type === "afternoon").length}
                                  </p>
                                  <p className="text-sm text-muted-foreground">Odpolední</p>
                                </CardContent>
                              </Card>
                              <Card className="bg-purple-50">
                                <CardContent className="py-4 px-3 text-center">
                                  <p className="font-bold text-2xl text-purple-500">
                                    {userShifts.filter(s => s.type === "night").length}
                                  </p>
                                  <p className="text-sm text-muted-foreground">Noční</p>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                          
                          <Table>
                            <TableCaption>Přehled směn</TableCaption>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Datum</TableHead>
                                <TableHead>Typ směny</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {userShifts.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={2} className="text-center py-4">
                                    Zatím nemáte naplánované žádné směny
                                  </TableCell>
                                </TableRow>
                              ) : (
                                userShifts.map((shift, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{formatShiftDate(shift.date)}</TableCell>
                                    <TableCell>
                                      <Badge className={`${getShiftColor(shift.type)} text-white`}>
                                        {getShiftTimeByType(shift.type)}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-[300px] text-center">
                          <Lock className="h-12 w-12 text-gray-300 mb-4" />
                          <p className="text-muted-foreground mb-2">Přihlaste se pro zobrazení statistik a přehledu směn</p>
                          <Button 
                            className="mt-2" 
                            onClick={() => setLoginDialogOpen(true)}
                            variant="default"
                          >
                            Přihlásit se
                          </Button>
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Planning Tab */}
            <TabsContent value="planning" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Route Planning Section */}
                <Card className="border-dhl-yellow">
                  <CardHeader className="border-b border-dhl-yellow">
                    <CardTitle>Plánování trasy</CardTitle>
                    <CardDescription>Zadejte svou trasu a časy cesty</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="from">Odkud</Label>
                      <Input 
                        id="from" 
                        placeholder="Místo odjezdu" 
                        value={route.from} 
                        onChange={(e) => setRoute({...route, from: e.target.value})} 
                        className="border-dhl-black focus-visible:ring-dhl-yellow"
                      />
                    </div>
                    <div>
                      <Label htmlFor="to">Kam</Label>
                      <Input 
                        id="to" 
                        placeholder="Cílová destinace" 
                        value={route.to}
                        onChange={(e) => setRoute({...route, to: e.target.value})}
                        className="border-dhl-black focus-visible:ring-dhl-yellow"
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Čas odjezdu</Label>
                      <Input 
                        id="time" 
                        type="time" 
                        value={route.time}
                        onChange={(e) => setRoute({...route, time: e.target.value})}
                        className="border-dhl-black focus-visible:ring-dhl-yellow"
                      />
                    </div>
                    <Button 
                      className="w-full bg-dhl-yellow text-dhl-black hover:bg-dhl-yellow/90" 
                      onClick={handleSaveRoute}
                    >
                      Uložit trasu
                    </Button>
                  </CardContent>
                </Card>

                {/* Ride Sharing Section */}
                <Card className="border-dhl-yellow">
                  <CardHeader className="border-b border-dhl-yellow">
                    <CardTitle>Spolujízda</CardTitle>
                    <CardDescription>Najděte nebo nabídněte spolujízdu</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted rounded-md p-3">
                      <p className="font-medium mb-2">Dostupné spolujízdy:</p>
                      <ul className="space-y-2">
                        <li className="p-2 bg-background rounded border border-dhl-yellow">
                          <p className="font-medium">Praha → Mladá Boleslav</p>
                          <p className="text-sm text-muted-foreground">Odjezd: 5:30, Volná místa: 3</p>
                        </li>
                        <li className="p-2 bg-background rounded border border-dhl-yellow">
                          <p className="font-medium">Kladno → Praha</p>
                          <p className="text-sm text-muted-foreground">Odjezd: 6:00, Volná místa: 2</p>
                        </li>
                        <li className="p-2 bg-background rounded border border-dhl-yellow">
                          <p className="font-medium">Beroun → Praha</p>
                          <p className="text-sm text-muted-foreground">Odjezd: 6:15, Volná místa: 1</p>
                        </li>
                      </ul>
                    </div>
                    <Button className="w-full bg-dhl-red text-white hover:bg-dhl-red/90">
                      Hledat spolujízdu
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <Card className="border-dhl-yellow">
                <CardHeader className="border-b border-dhl-yellow">
                  <CardTitle>Přehled směn - {format(new Date(), "MMMM yyyy", { locale: cs })}</CardTitle>
                  <CardDescription>Podrobný výpis směn</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoggedIn ? (
                    <div>
                      <ScrollArea className="h-[500px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Typ směny</TableHead>
                              <TableHead>Počet směn</TableHead>
                              <TableHead className="text-right">Celkem hodin</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Ranní</TableCell>
                              <TableCell>{userShifts.filter(s => s.type === "morning").length}</TableCell>
                              <TableCell className="text-right">{userShifts.filter(s => s.type === "morning").length * 8}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Odpolední</TableCell>
                              <TableCell>{userShifts.filter(s => s.type === "afternoon").length}</TableCell>
                              <TableCell className="text-right">{userShifts.filter(s => s.type === "afternoon").length * 8}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Noční</TableCell>
                              <TableCell>{userShifts.filter(s => s.type === "night").length}</TableCell>
                              <TableCell className="text-right">{userShifts.filter(s => s.type === "night").length * 8}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Celkem</TableCell>
                              <TableCell>{userShifts.length}</TableCell>
                              <TableCell className="text-right">{userShifts.length * 8}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </ScrollArea>
                      <div className="mt-6 flex justify-end">
                        <Button onClick={handleExportPDF} className="bg-dhl-red text-white hover:bg-dhl-red/90">
                          <Download className="mr-2 h-4 w-4" />
                          Exportovat do PDF
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] text-center">
                      <Lock className="h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-muted-foreground mb-2">Přihlaste se pro zobrazení reportů směn</p>
                      <Button 
                        className="mt-2" 
                        onClick={() => setLoginDialogOpen(true)}
                        variant="default"
                      >
                        Přihlásit se
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Additional Information Section */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Tipy pro efektivní plánování</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-dhl-yellow">
                <CardHeader className="border-b border-dhl-yellow">
                  <CardTitle>Optimalizace trasy</CardTitle>
                  <CardDescription>Jak ušetřit čas a peníze na cestě</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Využívejte navigaci s aktuální dopravní situací</li>
                    <li>Zvažte alternativní trasy mimo dopravní špičku</li>
                    <li>Naplánujte si přestávky na odpočinek</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-dhl-yellow">
                <CardHeader className="border-b border-dhl-yellow">
                  <CardTitle>Bezpečnost na cestách</CardTitle>
                  <CardDescription>Důležité rady pro bezpečnou jízdu</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Pravidelně kontrolujte technický stav vozidla</li>
                    <li>Dodržujte bezpečnou vzdálenost</li>
                    <li>Neřiďte unavení</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default Shifts;
