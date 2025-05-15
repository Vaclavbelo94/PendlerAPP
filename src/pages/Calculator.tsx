import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Calculator as CalculatorIcon, CoinsIcon, CarIcon, Globe, BadgeEuroIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import CrossBorderTaxCalculator from "@/components/calculator/CrossBorderTaxCalculator";

const Calculator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [workingDays, setWorkingDays] = useState<number>(0);
  const [shiftData, setShiftData] = useState<{ id: number, name: string, userId: string, shifts: number[] }>({ 
    id: 0, 
    name: "", 
    userId: "", 
    shifts: [] 
  });
  const [taxClass, setTaxClass] = useState("1");
  const [grossSalary, setGrossSalary] = useState<string>("0");
  const [netSalary, setNetSalary] = useState<number>(0);
  const [expenses, setExpenses] = useState({
    distance: "0",
    fuelPrice: "45.5",
    fuelConsumption: "7",
  });
  const [travelExpenses, setTravelExpenses] = useState<number>(0);
  const [month, setMonth] = useState<Date | undefined>(new Date());

  // Check login status when the component mounts
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    
    if (loggedIn) {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
        setUserName(currentUser.name || "");
        
        // Load sample shift data (in a real app, you would fetch this from an API)
        const employeeShifts = [
          { id: 1, name: "Jan Novák", userId: "user1", shifts: [3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25, 27, 29] },
          { id: 2, name: "Marie Svobodová", userId: "user2", shifts: [2, 4, 6, 8, 10, 14, 16, 18, 20, 22, 24, 26, 28] },
          { id: 3, name: "Petr Černý", userId: "user3", shifts: [1, 3, 5, 7, 9, 13, 15, 17, 19, 21, 25, 27, 29] },
          { id: 4, name: "Jana Dvořáková", userId: "user4", shifts: [2, 4, 6, 8, 12, 14, 16, 18, 20, 24, 26, 28, 30] },
        ];
        
        // Find current user's shift data
        const currentUserId = localStorage.getItem("currentUserId") || "user1";
        const userData = employeeShifts.find(user => user.userId === currentUserId) || employeeShifts[0];
        setShiftData(userData);
        setWorkingDays(userData.shifts.length);
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    }
  }, []);

  // Calculate net salary based on gross salary and tax class
  const calculateNetSalary = () => {
    const gross = parseFloat(grossSalary) || 0;
    let net = 0;
    
    // German tax calculation is simplified here
    switch (taxClass) {
      case "1": // Single, no children
        net = gross * 0.6; // Approximately 40% tax + insurance
        break;
      case "2": // Single parent
        net = gross * 0.65; // Approximately 35% tax + insurance
        break;
      case "3": // Married, spouse has class 5 or no income
        net = gross * 0.7; // Approximately 30% tax + insurance
        break;
      case "4": // Married, both spouses on class 4
        net = gross * 0.65; // Approximately 35% tax + insurance
        break;
      case "5": // Married, spouse has class 3
        net = gross * 0.55; // Approximately 45% tax + insurance
        break;
      case "6": // Multiple jobs
        net = gross * 0.5; // Approximately 50% tax + insurance
        break;
      default:
        net = gross * 0.6;
    }
    
    setNetSalary(net);
  };

  // Calculate travel expenses
  const calculateTravelExpenses = () => {
    const distance = parseFloat(expenses.distance) || 0;
    const fuelPrice = parseFloat(expenses.fuelPrice) || 0;
    const fuelConsumption = parseFloat(expenses.fuelConsumption) || 0;
    const workDays = workingDays || 0;
    
    // Calculate cost per km
    const costPerKm = (fuelConsumption / 100) * fuelPrice;
    
    // Calculate total cost
    const totalCost = distance * costPerKm * workDays * 2; // Two-way trip
    
    setTravelExpenses(totalCost);
  };

  // Update working days when month changes
  useEffect(() => {
    if (month && shiftData.shifts.length > 0) {
      // Filter shifts for the selected month
      const selectedMonthShifts = shiftData.shifts.filter(day => {
        const shiftDate = new Date(
          month.getFullYear(),
          month.getMonth(),
          day
        );
        return shiftDate.getMonth() === month.getMonth();
      });
      
      setWorkingDays(selectedMonthShifts.length);
    }
  }, [month, shiftData]);

  return (
    <div className="flex flex-col">
      {/* Header section with DHL colors */}
      <section className="bg-gradient-to-br from-dhl-yellow to-dhl-red py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 text-dhl-black">Kalkulačky</h1>
          <p className="text-lg text-dhl-black max-w-3xl mx-auto mb-8">
            Spočítejte si čistou mzdu, cestovní náklady a daňové povinnosti pro přeshraniční pracovníky
          </p>
        </div>
      </section>
      
      {/* Main content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="salary" className="mb-8">
            <TabsList className="mb-4 bg-dhl-yellow text-dhl-black">
              <TabsTrigger value="salary" className="data-[state=active]:bg-dhl-red data-[state=active]:text-white">
                <CoinsIcon className="mr-2 h-4 w-4" />
                Kalkulačka mzdy
              </TabsTrigger>
              <TabsTrigger value="travel" className="data-[state=active]:bg-dhl-red data-[state=active]:text-white">
                <CarIcon className="mr-2 h-4 w-4" />
                Cestovní náklady
              </TabsTrigger>
              <TabsTrigger value="cross-border" className="data-[state=active]:bg-dhl-red data-[state=active]:text-white">
                <Globe className="mr-2 h-4 w-4" />
                Přeshraniční pracovníci
              </TabsTrigger>
            </TabsList>
            
            {/* Salary Calculator Tab */}
            <TabsContent value="salary" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-dhl-yellow">
                  <CardHeader className="border-b border-dhl-yellow">
                    <CardTitle className="flex items-center">
                      <CalculatorIcon className="mr-2 h-5 w-5" />
                      Kalkulačka čisté mzdy
                    </CardTitle>
                    <CardDescription>
                      Zadejte údaje o vaší mzdě pro výpočet čisté mzdy
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="gross-salary">Hrubá mzda (EUR)</Label>
                          <Input
                            id="gross-salary"
                            type="number"
                            min="0"
                            step="100"
                            value={grossSalary}
                            onChange={(e) => setGrossSalary(e.target.value)}
                            className="border-dhl-black focus-visible:ring-dhl-yellow"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tax-class">Daňová třída</Label>
                          <Select value={taxClass} onValueChange={setTaxClass}>
                            <SelectTrigger id="tax-class" className="border-dhl-black focus-visible:ring-dhl-yellow">
                              <SelectValue placeholder="Vyberte daňovou třídu" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Třída 1 - Svobodný/á, bezdětný/á</SelectItem>
                              <SelectItem value="2">Třída 2 - Samoživitel/ka</SelectItem>
                              <SelectItem value="3">Třída 3 - Ženatý/vdaná (partner třída 5)</SelectItem>
                              <SelectItem value="4">Třída 4 - Ženatý/vdaná (oba třída 4)</SelectItem>
                              <SelectItem value="5">Třída 5 - Ženatý/vdaná (partner třída 3)</SelectItem>
                              <SelectItem value="6">Třída 6 - Více zaměstnání</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="month">Měsíc</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="month"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal mt-1 border-dhl-black",
                                !month && "text-muted-foreground"
                              )}
                            >
                              <CalculatorIcon className="mr-2 h-4 w-4" />
                              {month ? (
                                format(month, "MMMM yyyy", { locale: cs })
                              ) : (
                                <span>Vyberte měsíc</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={month}
                              onSelect={(date) => date && setMonth(date)}
                              initialFocus
                              className="p-3"
                              locale={cs}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="working-days">Počet pracovních dní</Label>
                        <Input
                          id="working-days"
                          type="number"
                          min="0"
                          max="31"
                          value={workingDays}
                          onChange={(e) => setWorkingDays(parseInt(e.target.value) || 0)}
                          className="border-dhl-black focus-visible:ring-dhl-yellow"
                        />
                      </div>

                      <Button 
                        onClick={calculateNetSalary} 
                        className="w-full bg-dhl-yellow text-dhl-black hover:bg-dhl-yellow/90"
                      >
                        <CalculatorIcon className="mr-2 h-4 w-4" />
                        Spočítat čistou mzdu
                      </Button>
                    </div>

                    {netSalary > 0 && (
                      <div className="mt-6 p-4 bg-muted rounded-md">
                        <h3 className="text-lg font-medium mb-2">Výsledek výpočtu:</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm text-muted-foreground">Hrubá mzda:</div>
                          <div className="text-sm font-medium text-right">{parseFloat(grossSalary).toLocaleString()} EUR</div>
                          
                          <div className="text-sm text-muted-foreground">Daňová třída:</div>
                          <div className="text-sm font-medium text-right">{taxClass}</div>
                          
                          <div className="text-sm text-muted-foreground">Počet pracovních dní:</div>
                          <div className="text-sm font-medium text-right">{workingDays}</div>
                          
                          <Separator className="col-span-2 my-2" />
                          
                          <div className="text-base font-bold">Čistá mzda:</div>
                          <div className="text-base font-bold text-dhl-red text-right">{netSalary.toLocaleString()} EUR</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-dhl-yellow">
                  <CardHeader className="border-b border-dhl-yellow">
                    <CardTitle>Daňové informace</CardTitle>
                    <CardDescription>
                      Základní informace o německých daňových třídách
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-1">Třída 1</h4>
                        <p className="text-sm text-muted-foreground">Pro svobodné, rozvedené, nebo ovdovělé osoby bez dětí.</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Třída 2</h4>
                        <p className="text-sm text-muted-foreground">Pro samoživitele s alespoň jedním dítětem.</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Třída 3</h4>
                        <p className="text-sm text-muted-foreground">Pro sezdané páry, kde jeden z partnerů vydělává výrazně více.</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Třída 4</h4>
                        <p className="text-sm text-muted-foreground">Pro sezdané páry s podobným příjmem.</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Třída 5</h4>
                        <p className="text-sm text-muted-foreground">Pro sezdané páry, druhý manžel má třídu 3.</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Třída 6</h4>
                        <p className="text-sm text-muted-foreground">Pro osoby s více zaměstnáními (druhé a další zaměstnání).</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Travel Expenses Tab */}
            <TabsContent value="travel" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-dhl-yellow">
                  <CardHeader className="border-b border-dhl-yellow">
                    <CardTitle className="flex items-center">
                      <CarIcon className="mr-2 h-5 w-5" />
                      Kalkulačka cestovních nákladů
                    </CardTitle>
                    <CardDescription>
                      Spočítejte si náklady na dojíždění do práce
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="distance">Vzdálenost (km)</Label>
                          <Input
                            id="distance"
                            type="number"
                            min="0"
                            step="1"
                            value={expenses.distance}
                            onChange={(e) => setExpenses({...expenses, distance: e.target.value})}
                            className="border-dhl-black focus-visible:ring-dhl-yellow"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fuel-price">Cena paliva (Kč/l)</Label>
                          <Input
                            id="fuel-price"
                            type="number"
                            min="0"
                            step="0.1"
                            value={expenses.fuelPrice}
                            onChange={(e) => setExpenses({...expenses, fuelPrice: e.target.value})}
                            className="border-dhl-black focus-visible:ring-dhl-yellow"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fuel-consumption">Spotřeba (l/100 km)</Label>
                          <Input
                            id="fuel-consumption"
                            type="number"
                            min="0"
                            step="0.1"
                            value={expenses.fuelConsumption}
                            onChange={(e) => setExpenses({...expenses, fuelConsumption: e.target.value})}
                            className="border-dhl-black focus-visible:ring-dhl-yellow"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="travel-month">Měsíc</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="travel-month"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal mt-1 border-dhl-black",
                                !month && "text-muted-foreground"
                              )}
                            >
                              <CalculatorIcon className="mr-2 h-4 w-4" />
                              {month ? (
                                format(month, "MMMM yyyy", { locale: cs })
                              ) : (
                                <span>Vyberte měsíc</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={month}
                              onSelect={(date) => date && setMonth(date)}
                              initialFocus
                              className="p-3"
                              locale={cs}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="travel-working-days">Počet pracovních dní</Label>
                        <Input
                          id="travel-working-days"
                          type="number"
                          min="0"
                          max="31"
                          value={workingDays}
                          onChange={(e) => setWorkingDays(parseInt(e.target.value) || 0)}
                          className="border-dhl-black focus-visible:ring-dhl-yellow"
                        />
                      </div>

                      <Button 
                        onClick={calculateTravelExpenses} 
                        className="w-full bg-dhl-yellow text-dhl-black hover:bg-dhl-yellow/90"
                      >
                        <CalculatorIcon className="mr-2 h-4 w-4" />
                        Spočítat cestovní náklady
                      </Button>
                    </div>

                    {travelExpenses > 0 && (
                      <div className="mt-6 p-4 bg-muted rounded-md">
                        <h3 className="text-lg font-medium mb-2">Výsledek výpočtu:</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm text-muted-foreground">Vzdálenost (tam a zpět):</div>
                          <div className="text-sm font-medium text-right">{parseFloat(expenses.distance) * 2} km</div>
                          
                          <div className="text-sm text-muted-foreground">Spotřeba paliva:</div>
                          <div className="text-sm font-medium text-right">{expenses.fuelConsumption} l/100 km</div>
                          
                          <div className="text-sm text-muted-foreground">Cena paliva:</div>
                          <div className="text-sm font-medium text-right">{expenses.fuelPrice} Kč/l</div>
                          
                          <div className="text-sm text-muted-foreground">Počet pracovních dní:</div>
                          <div className="text-sm font-medium text-right">{workingDays}</div>
                          
                          <Separator className="col-span-2 my-2" />
                          
                          <div className="text-base font-bold">Celkové náklady:</div>
                          <div className="text-base font-bold text-dhl-red text-right">{travelExpenses.toLocaleString()} Kč</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-dhl-yellow">
                  <CardHeader className="border-b border-dhl-yellow">
                    <CardTitle>Daňové odpočty</CardTitle>
                    <CardDescription>
                      Informace o daňových odpočtech na dojíždění v Německu
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        V Německu si můžete odečíst náklady na dojíždění z daní. Pro rok 2023 je odpočet 0,30 EUR za km pro prvních 20 km a 0,38 EUR za km nad 20 km (jednosměrná cesta).
                      </p>
                      
                      <div className="bg-muted rounded-md p-3">
                        <h4 className="font-medium mb-1">Výpočet odpočtu</h4>
                        <p className="text-sm">
                          Při vzdálenosti {parseFloat(expenses.distance)} km a {workingDays} pracovních dnech máte nárok na odpočet:
                        </p>
                        {parseFloat(expenses.distance) > 0 && workingDays > 0 && (
                          <div className="mt-2 font-medium">
                            {parseFloat(expenses.distance) <= 20 ? (
                              <span>{(parseFloat(expenses.distance) * 0.30 * workingDays).toFixed(2)} EUR</span>
                            ) : (
                              <span>
                                {((20 * 0.30 + (parseFloat(expenses.distance) - 20) * 0.38) * workingDays).toFixed(2)} EUR
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        Tento odpočet lze uplatnit v ročním daňovém přiznání. Pro více informací navštivte sekci <a href="/laws/tax-return" className="text-dhl-red hover:underline">Daňové přiznání</a>.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* New Cross-Border Workers Tab */}
            <TabsContent value="cross-border" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-blue-50 p-4 rounded-md mb-4">
                  <h3 className="text-lg font-medium mb-2">Přeshraniční pracovníci (Pendleři)</h3>
                  <p>
                    Pracujete v jiné zemi, než ve které bydlíte? Tato specializovaná kalkulačka vám pomůže
                    vyhodnotit daňové dopady a sociální odvody podle různých přeshraničních scénářů.
                  </p>
                </div>
                
                <CrossBorderTaxCalculator />
                
                <Card className="border-dhl-yellow">
                  <CardHeader className="border-b border-dhl-yellow">
                    <div className="flex items-center gap-2">
                      <BadgeEuroIcon className="h-5 w-5 text-dhl-red" />
                      <CardTitle>Informace pro přeshraniční pracovníky</CardTitle>
                    </div>
                    <CardDescription>Důležité informace pro osoby pracující v zahraničí</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">Pravidlo 183 dnů</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Pokud pracujete v zahraničí více než 183 dní v roce, obvykle se stáváte daňovým
                          rezidentem této země a musíte zde zdanit své celosvětové příjmy.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Smlouvy o zamezení dvojího zdanění</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Tyto smlouvy určují, ve které zemi budete zdaňovat své příjmy a kde budete platit
                          sociální a zdravotní pojištění. Pravidla se liší podle konkrétních zemí.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Sociální zabezpečení (Nařízení EU 883/2004)</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Podle nařízení EU platíte sociální pojištění pouze v jedné zemi. Pokud pracujete ve více
                          zemích, záleží na tom, kde vykonáváte podstatnou část své činnosti.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Formulář A1</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Tento formulář potvrzuje, ve které zemi jste účastníkem systému sociálního zabezpečení.
                          Je důležitý pro přeshraniční pracovníky a měl by být vystaven před zahájením práce v zahraničí.
                        </p>
                      </div>
                      
                      <div className="bg-yellow-50 p-4 rounded-md">
                        <p className="font-medium">Důležité upozornění:</p>
                        <p className="text-sm">
                          Tato kalkulačka poskytuje pouze orientační výpočty. Pro přesné informace o vaší daňové
                          povinnosti konzultujte daňového poradce nebo příslušný finanční úřad.
                        </p>
                      </div>
                      
                      <div>
                        <Button variant="link" className="p-0 h-auto text-dhl-red">
                          <a href="/laws/tax-return" className="flex items-center">
                            Více informací o daňovém přiznání v Německu
                            <span className="ml-1">→</span>
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Additional Information Section */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Užitečné informace</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-dhl-yellow">
                <CardHeader className="border-b border-dhl-yellow">
                  <CardTitle>Minimální mzda v Německu</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p>Aktuální minimální mzda v Německu je <strong>12,41 EUR/hod</strong> (platné od 1. ledna 2024).</p>
                  <p className="mt-2">
                    <a href="/laws/minimum-wage" className="text-dhl-red hover:underline">Více informací o minimální mzdě</a>
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-dhl-yellow">
                <CardHeader className="border-b border-dhl-yellow">
                  <CardTitle>Zdravotní pojištění</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p>Zdravotní pojištění v Německu činí přibližně 14,6% z hrubé mzdy, přičemž zaměstnavatel hradí polovinu.</p>
                  <p className="mt-2">
                    <a href="/laws/health-insurance" className="text-dhl-red hover:underline">Více informací o zdravotním pojištění</a>
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default Calculator;
