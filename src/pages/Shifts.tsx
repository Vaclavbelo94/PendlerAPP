
import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import PremiumCheck from "@/components/premium/PremiumCheck";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, startOfWeek, endOfWeek, isWithinInterval, isSameDay, parseISO } from "date-fns";
import { cs } from "date-fns/locale";
import { useAuth } from '@/hooks/useAuth';
import ShiftsProgress from '@/components/dashboard/ShiftsProgress';
import { supabase } from '@/integrations/supabase/client';

// Typy směn
const shiftTypes = {
  morning: {
    label: "Ranní",
    color: "bg-blue-500 hover:bg-blue-400 text-white",
    time: "6:00 - 14:00",
  },
  afternoon: {
    label: "Odpolední",
    color: "bg-amber-500 hover:bg-amber-400 text-white",
    time: "14:00 - 22:00",
  },
  night: {
    label: "Noční",
    color: "bg-indigo-500 hover:bg-indigo-400 text-white",
    time: "22:00 - 6:00",
  }
};

// Ukázkové směny pro demo
const demoShifts = [
  { id: 1, date: "2025-05-20", type: "morning", notes: "Důležitá porada v 10:00" },
  { id: 2, date: "2025-05-21", type: "afternoon", notes: "" },
  { id: 3, date: "2025-05-22", type: "afternoon", notes: "" },
  { id: 4, date: "2025-05-24", type: "night", notes: "Nezapomenout klíče od skladu" },
  { id: 5, date: "2025-05-27", type: "morning", notes: "" },
  { id: 6, date: "2025-05-29", type: "morning", notes: "" },
  { id: 7, date: "2025-05-30", type: "afternoon", notes: "Konec měsíce - uzávěrka" },
];

const Shifts = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [shifts, setShifts] = useState<any[]>(demoShifts);
  const [selectedShift, setSelectedShift] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("calendar");
  const [isLoading, setIsLoading] = useState(true);

  // Get current week days
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  useEffect(() => {
    const fetchShifts = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Zde by byl skutečný požadavek na Supabase pro získání směn
        // Pro ukázku použijeme demoShifts
        // Simulujeme načítání dat
        setTimeout(() => {
          setShifts(demoShifts);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Chyba při načítání směn:", error);
        setIsLoading(false);
      }
    };

    fetchShifts();
  }, [user]);

  useEffect(() => {
    if (selectedDate) {
      const shift = shifts.find(s => 
        isSameDay(parseISO(s.date), selectedDate)
      );
      setSelectedShift(shift || null);
    }
  }, [selectedDate, shifts]);

  // Modifiers for the calendar to highlight days with shifts
  const getCalendarModifiers = () => {
    if (!shifts.length) return {};
    
    const morningShifts = shifts
      .filter(shift => shift.type === "morning")
      .map(shift => new Date(shift.date));
    
    const afternoonShifts = shifts
      .filter(shift => shift.type === "afternoon")
      .map(shift => new Date(shift.date));
    
    const nightShifts = shifts
      .filter(shift => shift.type === "night")
      .map(shift => new Date(shift.date));
      
    return {
      morning: morningShifts,
      afternoon: afternoonShifts,
      night: nightShifts,
    };
  };
  
  // Styles for different shift types in the calendar
  const getCalendarModifiersStyles = () => {
    return {
      morning: { backgroundColor: "#3b82f6", color: "#ffffff", fontWeight: "bold" },
      afternoon: { backgroundColor: "#f59e0b", color: "#ffffff", fontWeight: "bold" },
      night: { backgroundColor: "#6366f1", color: "#ffffff", fontWeight: "bold" }
    };
  };

  return (
    <PremiumCheck featureKey="shifts_planning">
      <div className="container py-6">
        <Helmet>
          <title>Plánování směn | Pendler Buddy</title>
        </Helmet>
        <h1 className="text-3xl font-bold mb-6">Plánování směn</h1>
        <div className="mb-6">
          <p className="text-muted-foreground">
            Organizujte své pracovní směny, plánujte dojíždění a optimalizujte svůj čas.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="calendar">Kalendář</TabsTrigger>
              <TabsTrigger value="weekly">Týdenní pohled</TabsTrigger>
              <TabsTrigger value="stats">Statistiky</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Kalendář směn</CardTitle>
                    <CardDescription>Klikněte na datum pro zobrazení nebo úpravu směny</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center p-4">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border"
                        locale={cs}
                        modifiers={getCalendarModifiers()}
                        modifiersStyles={getCalendarModifiersStyles()}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {selectedDate ? (
                        <>Detail směny: {format(selectedDate, "EEEE, d. MMMM yyyy", { locale: cs })}</>
                      ) : (
                        <>Vyberte datum</>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {selectedShift ? (
                        <>Typ směny: {shiftTypes[selectedShift.type].label}</>
                      ) : selectedDate ? (
                        <>Na tento den nemáte směnu</>
                      ) : (
                        <>Klikněte na datum v kalendáři</>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedDate && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          {selectedShift ? (
                            <>
                              <div className="flex justify-between">
                                <div className="text-sm text-muted-foreground">Čas:</div>
                                <div>{shiftTypes[selectedShift.type].time}</div>
                              </div>
                              
                              {selectedShift.notes && (
                                <>
                                  <div className="text-sm text-muted-foreground mt-4">Poznámky:</div>
                                  <div className="p-3 bg-muted/50 rounded-md">
                                    {selectedShift.notes}
                                  </div>
                                </>
                              )}
                              
                              <div className="flex justify-end mt-6 space-x-2">
                                <Button variant="outline">Upravit</Button>
                                <Button variant="destructive">Odstranit</Button>
                              </div>
                            </>
                          ) : (
                            <div className="space-y-4">
                              <p className="text-center py-6">Na tento den nemáte zaplánovanou žádnou směnu</p>
                              <div className="grid grid-cols-3 gap-2">
                                {Object.entries(shiftTypes).map(([key, value]) => (
                                  <Button 
                                    key={key} 
                                    className={value.color}
                                    onClick={() => console.log(`Přidání směny ${key} pro ${format(selectedDate, "yyyy-MM-dd")}`)}
                                  >
                                    {value.label}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Nadcházející směny</CardTitle>
                  <CardDescription>Přehled vašich následujících směn</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {shifts
                      .filter(shift => new Date(shift.date) >= new Date())
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .slice(0, 5)
                      .map(shift => (
                        <div key={shift.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <div>
                            <div className="font-medium">
                              {format(parseISO(shift.date), "EEEE, d. MMMM", { locale: cs })}
                            </div>
                            <div className="text-sm text-muted-foreground">{shiftTypes[shift.type].time}</div>
                          </div>
                          <div>
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              shift.type === 'morning' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 
                              shift.type === 'afternoon' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                              'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
                            }`}>
                              {shiftTypes[shift.type].label}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="weekly">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Týdenní přehled</CardTitle>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setDate(addDays(date, -7))}
                      >
                        Předchozí
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setDate(new Date())}
                      >
                        Dnes
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setDate(addDays(date, 7))}
                      >
                        Další
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    Týden: {format(weekStart, "d. MMMM", { locale: cs })} - {format(weekEnd, "d. MMMM yyyy", { locale: cs })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {weekDays.map(day => {
                      const shift = shifts.find(s => isSameDay(parseISO(s.date), day));
                      return (
                        <div 
                          key={day.toString()}
                          className={`p-3 border rounded-md text-center ${
                            isSameDay(day, new Date()) ? 'border-primary bg-primary/5' : ''
                          } cursor-pointer hover:border-primary`}
                          onClick={() => setSelectedDate(day)}
                        >
                          <div className="text-sm font-medium">
                            {format(day, "EEEE", { locale: cs })}
                          </div>
                          <div className="text-xl font-bold my-1">
                            {format(day, "d", { locale: cs })}
                          </div>
                          {shift ? (
                            <div className={`mt-2 px-1 py-0.5 text-xs font-medium rounded ${
                              shift.type === 'morning' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 
                              shift.type === 'afternoon' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                              'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
                            }`}>
                              {shiftTypes[shift.type].label}
                            </div>
                          ) : (
                            <div className="mt-2 px-1 py-0.5 text-xs font-medium text-muted-foreground">
                              Volno
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <h3 className="font-medium">Shrnutí týdne</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {Object.entries(shiftTypes).map(([key, value]) => {
                        const count = shifts.filter(s => 
                          s.type === key && 
                          isWithinInterval(parseISO(s.date), { start: weekStart, end: weekEnd })
                        ).length;
                        
                        return (
                          <div key={key} className="flex items-center p-3 border rounded-md">
                            <div className={`w-3 h-3 rounded-full ${
                              key === 'morning' ? 'bg-blue-500' : 
                              key === 'afternoon' ? 'bg-amber-500' : 
                              'bg-indigo-500'
                            } mr-3`}></div>
                            <div>
                              <div className="font-medium">{value.label} směny</div>
                              <div className="text-sm text-muted-foreground">{count}× ({count * 8} hodin)</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stats">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Statistika směn</CardTitle>
                    <CardDescription>Přehled odpracovaných hodin</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ShiftsProgress />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Měsíční souhrn</CardTitle>
                    <CardDescription>Statistika za aktuální měsíc</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card className="shadow-none border">
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold">54 hodin</div>
                            <p className="text-sm text-muted-foreground">Odpracováno tento měsíc</p>
                          </CardContent>
                        </Card>
                        
                        <Card className="shadow-none border">
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold">80 hodin</div>
                            <p className="text-sm text-muted-foreground">Plánováno celkem</p>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Rozdělení směn</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                              <span>Ranní</span>
                            </div>
                            <span className="font-medium">24 hodin (3 směny)</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                              <span>Odpolední</span>
                            </div>
                            <span className="font-medium">18 hodin (2.25 směny)</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                              <span>Noční</span>
                            </div>
                            <span className="font-medium">12 hodin (1.5 směny)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Button variant="outline" className="w-full">
                          Zobrazit detailní přehled
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </PremiumCheck>
  );
};

export default Shifts;
