
import { useState } from "react";
import { Calendar as CalendarIcon, Calendar as CalendarLucide, FileDown, Download } from "lucide-react";
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

// Sample data for the employee shifts
const employeeShifts = [
  { id: 1, name: "Jan Novák", shifts: [3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25, 27, 29] },
  { id: 2, name: "Marie Svobodová", shifts: [2, 4, 6, 8, 10, 14, 16, 18, 20, 22, 24, 26, 28] },
  { id: 3, name: "Petr Černý", shifts: [1, 3, 5, 7, 9, 13, 15, 17, 19, 21, 25, 27, 29] },
  { id: 4, name: "Jana Dvořáková", shifts: [2, 4, 6, 8, 12, 14, 16, 18, 20, 24, 26, 28, 30] },
];

const Shifts = () => {
  const [activeTab, setActiveTab] = useState("calendar");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [route, setRoute] = useState({ from: "", to: "", time: "" });
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [shiftType, setShiftType] = useState("day");
  
  // Handler for saving route
  const handleSaveRoute = () => {
    alert(`Trasa uložena: ${route.from} → ${route.to} v ${route.time}`);
  };

  // Handler for exporting PDF
  const handleExportPDF = () => {
    alert("Export do PDF byl zahájen. Soubor bude brzy ke stažení.");
    // In a real implementation, this would trigger a PDF generation process
  };
  
  return (
    <div className="flex flex-col">
      {/* Header section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Plánování směn</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Efektivní plánování pracovních směn a spolujízdy pro pendlery.
          </p>
        </div>
      </section>
      
      {/* Main content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="calendar" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="calendar">Kalendář směn</TabsTrigger>
              <TabsTrigger value="planning">Plánování tras</TabsTrigger>
              <TabsTrigger value="reports">Reporty</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar Section */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Můj kalendář</CardTitle>
                    <CardDescription>Přehled plánovaných směn</CardDescription>
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
                        modifiers={{
                          booked: employeeShifts[0].shifts.map(
                            (day) => new Date(selectedDate ? selectedDate.getFullYear() : new Date().getFullYear(), 
                                             selectedDate ? selectedDate.getMonth() : new Date().getMonth(), 
                                             day)
                          ),
                        }}
                        modifiersStyles={{
                          booked: { backgroundColor: "#dcfce7", color: "#166534", fontWeight: "bold" }
                        }}
                      />
                    </div>
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-3">Detaily směny</h3>
                      {selectedDate && (
                        <div className="bg-muted p-4 rounded-md">
                          <p className="font-medium">
                            {format(selectedDate, "EEEE, d. MMMM yyyy", { locale: cs })}
                          </p>
                          {employeeShifts[0].shifts.includes(selectedDate.getDate()) ? (
                            <div className="mt-2">
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Naplánovaná směna</Badge>
                              <p className="mt-2">Směna: {shiftType === "day" ? "Denní (6:00 - 14:00)" : "Noční (22:00 - 6:00)"}</p>
                              <div className="mt-3">
                                <RadioGroup defaultValue={shiftType} onValueChange={setShiftType} className="flex space-x-4">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="day" id="day" />
                                    <Label htmlFor="day">Denní</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="night" id="night" />
                                    <Label htmlFor="night">Noční</Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-2">
                              <Badge variant="outline">Volný den</Badge>
                              <p className="mt-2 text-muted-foreground">Žádná směna naplánovaná na tento den</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Export PDF Dialog */}
                    <div className="mt-6">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full">
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
                            <Button type="submit" onClick={handleExportPDF}>
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
                <Card>
                  <CardHeader>
                    <CardTitle>Měsíční přehled</CardTitle>
                    <CardDescription>
                      {selectedMonth && format(selectedMonth, "MMMM yyyy", { locale: cs })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <Table>
                        <TableCaption>Přehled směn zaměstnanců</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Zaměstnanec</TableHead>
                            <TableHead className="text-right">Počet směn</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {employeeShifts.map((employee) => (
                            <TableRow key={employee.id}>
                              <TableCell>{employee.name}</TableCell>
                              <TableCell className="text-right">{employee.shifts.length}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="planning" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Route Planning Section */}
                <Card>
                  <CardHeader>
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
                      />
                    </div>
                    <div>
                      <Label htmlFor="to">Kam</Label>
                      <Input 
                        id="to" 
                        placeholder="Cílová destinace" 
                        value={route.to}
                        onChange={(e) => setRoute({...route, to: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Čas odjezdu</Label>
                      <Input 
                        id="time" 
                        type="time" 
                        value={route.time}
                        onChange={(e) => setRoute({...route, time: e.target.value})}
                      />
                    </div>
                    <Button className="w-full" onClick={handleSaveRoute}>Uložit trasu</Button>
                  </CardContent>
                </Card>

                {/* Ride Sharing Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Spolujízda</CardTitle>
                    <CardDescription>Najděte nebo nabídněte spolujízdu</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted rounded-md p-3">
                      <p className="font-medium mb-2">Dostupné spolujízdy:</p>
                      <ul className="space-y-2">
                        <li className="p-2 bg-background rounded border">
                          <p className="font-medium">Praha → Mladá Boleslav</p>
                          <p className="text-sm text-muted-foreground">Odjezd: 5:30, Volná místa: 3</p>
                        </li>
                        <li className="p-2 bg-background rounded border">
                          <p className="font-medium">Kladno → Praha</p>
                          <p className="text-sm text-muted-foreground">Odjezd: 6:00, Volná místa: 2</p>
                        </li>
                        <li className="p-2 bg-background rounded border">
                          <p className="font-medium">Beroun → Praha</p>
                          <p className="text-sm text-muted-foreground">Odjezd: 6:15, Volná místa: 1</p>
                        </li>
                      </ul>
                    </div>
                    <Button className="w-full">Hledat spolujízdu</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Přehled směn - {format(new Date(), "MMMM yyyy", { locale: cs })}</CardTitle>
                  <CardDescription>Podrobný výpis směn všech zaměstnanců</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Zaměstnanec</TableHead>
                          <TableHead>Počet směn</TableHead>
                          <TableHead>Denní směny</TableHead>
                          <TableHead>Noční směny</TableHead>
                          <TableHead className="text-right">Celkem hodin</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employeeShifts.map((employee) => (
                          <TableRow key={employee.id}>
                            <TableCell className="font-medium">{employee.name}</TableCell>
                            <TableCell>{employee.shifts.length}</TableCell>
                            <TableCell>{Math.round(employee.shifts.length / 2)}</TableCell>
                            <TableCell>{Math.floor(employee.shifts.length / 2)}</TableCell>
                            <TableCell className="text-right">{employee.shifts.length * 8}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                  <div className="mt-6 flex justify-end">
                    <Button onClick={handleExportPDF}>
                      <Download className="mr-2 h-4 w-4" />
                      Exportovat do PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Additional Information Section */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Tipy pro efektivní plánování</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
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

              <Card>
                <CardHeader>
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
