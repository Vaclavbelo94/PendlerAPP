
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Car } from "lucide-react";

const ShiftsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Header section */}
        <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
          <div className="container mx-auto px-4 text-center">
            <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Plánování směn a spolujízda</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Organizujte své pracovní směny a najděte spolujízdu s dalšími pendlery na podobné trase do práce.
            </p>
          </div>
        </section>
        
        {/* Main content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="calendar" className="w-full">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 mb-8">
                <TabsTrigger value="calendar">Kalendář směn</TabsTrigger>
                <TabsTrigger value="carpool">Spolujízda</TabsTrigger>
              </TabsList>
              
              {/* Calendar Tab */}
              <TabsContent value="calendar">
                <Card>
                  <CardHeader>
                    <CardTitle>Kalendář směn</CardTitle>
                    <CardDescription>
                      Plánujte a spravujte své pracovní směny přehledně v kalendáři
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Calendar UI */}
                      <div className="border rounded-lg overflow-hidden shadow bg-white">
                        {/* Calendar Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                          <button className="p-1 rounded hover:bg-slate-100">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <h2 className="text-xl font-semibold">Květen 2025</h2>
                          <button className="p-1 rounded hover:bg-slate-100">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Calendar Days */}
                        <div className="grid grid-cols-7 text-center font-medium py-2 bg-slate-50">
                          <div>Po</div>
                          <div>Út</div>
                          <div>St</div>
                          <div>Čt</div>
                          <div>Pá</div>
                          <div className="text-slate-400">So</div>
                          <div className="text-slate-400">Ne</div>
                        </div>
                        
                        {/* Calendar Dates */}
                        <div className="grid grid-cols-7 auto-rows-fr text-sm">
                          {/* Week 1 */}
                          <div className="p-2 border-t border-r h-24">
                            <span className="text-slate-400">28</span>
                          </div>
                          <div className="p-2 border-t border-r h-24">
                            <span className="text-slate-400">29</span>
                          </div>
                          <div className="p-2 border-t border-r h-24">
                            <span className="text-slate-400">30</span>
                          </div>
                          <div className="p-2 border-t border-r h-24">1</div>
                          <div className="p-2 border-t border-r h-24 bg-blue-50">
                            <div className="flex flex-col h-full">
                              <span>2</span>
                              <div className="mt-1 bg-blue-100 text-blue-800 rounded px-2 py-1 text-xs">
                                Ranní 6-14
                              </div>
                            </div>
                          </div>
                          <div className="p-2 border-t border-r h-24 bg-slate-50 text-slate-400">3</div>
                          <div className="p-2 border-t h-24 bg-slate-50 text-slate-400">4</div>
                          
                          {/* Week 2 */}
                          <div className="p-2 border-t border-r h-24 bg-blue-50">
                            <div className="flex flex-col h-full">
                              <span>5</span>
                              <div className="mt-1 bg-blue-100 text-blue-800 rounded px-2 py-1 text-xs">
                                Ranní 6-14
                              </div>
                            </div>
                          </div>
                          <div className="p-2 border-t border-r h-24 bg-blue-50">
                            <div className="flex flex-col h-full">
                              <span>6</span>
                              <div className="mt-1 bg-blue-100 text-blue-800 rounded px-2 py-1 text-xs">
                                Ranní 6-14
                              </div>
                            </div>
                          </div>
                          <div className="p-2 border-t border-r h-24 bg-blue-50">
                            <div className="flex flex-col h-full">
                              <span>7</span>
                              <div className="mt-1 bg-blue-100 text-blue-800 rounded px-2 py-1 text-xs">
                                Ranní 6-14
                              </div>
                            </div>
                          </div>
                          <div className="p-2 border-t border-r h-24 bg-blue-50">
                            <div className="flex flex-col h-full">
                              <span>8</span>
                              <div className="mt-1 bg-blue-100 text-blue-800 rounded px-2 py-1 text-xs">
                                Ranní 6-14
                              </div>
                            </div>
                          </div>
                          <div className="p-2 border-t border-r h-24 bg-blue-50">
                            <div className="flex flex-col h-full">
                              <span>9</span>
                              <div className="mt-1 bg-blue-100 text-blue-800 rounded px-2 py-1 text-xs">
                                Ranní 6-14
                              </div>
                            </div>
                          </div>
                          <div className="p-2 border-t border-r h-24 bg-slate-50 text-slate-400">10</div>
                          <div className="p-2 border-t h-24 bg-slate-50 text-slate-400">11</div>
                          
                          {/* Week 3 */}
                          <div className="p-2 border-t border-r h-24">12</div>
                          <div className="p-2 border-t border-r h-24">13</div>
                          <div className="p-2 border-t border-r h-24">14</div>
                          <div className="p-2 border-t border-r h-24">15</div>
                          <div className="p-2 border-t border-r h-24">16</div>
                          <div className="p-2 border-t border-r h-24 bg-slate-50 text-slate-400">17</div>
                          <div className="p-2 border-t h-24 bg-slate-50 text-slate-400">18</div>
                          
                          {/* Week 4 */}
                          <div className="p-2 border-t border-r h-24 bg-green-50">
                            <div className="flex flex-col h-full">
                              <span>19</span>
                              <div className="mt-1 bg-green-100 text-green-800 rounded px-2 py-1 text-xs">
                                Odpolední 14-22
                              </div>
                            </div>
                          </div>
                          <div className="p-2 border-t border-r h-24 bg-green-50">
                            <div className="flex flex-col h-full">
                              <span>20</span>
                              <div className="mt-1 bg-green-100 text-green-800 rounded px-2 py-1 text-xs">
                                Odpolední 14-22
                              </div>
                            </div>
                          </div>
                          <div className="p-2 border-t border-r h-24 bg-green-50">
                            <div className="flex flex-col h-full">
                              <span>21</span>
                              <div className="mt-1 bg-green-100 text-green-800 rounded px-2 py-1 text-xs">
                                Odpolední 14-22
                              </div>
                            </div>
                          </div>
                          <div className="p-2 border-t border-r h-24 bg-green-50">
                            <div className="flex flex-col h-full">
                              <span>22</span>
                              <div className="mt-1 bg-green-100 text-green-800 rounded px-2 py-1 text-xs">
                                Odpolední 14-22
                              </div>
                            </div>
                          </div>
                          <div className="p-2 border-t border-r h-24 bg-green-50">
                            <div className="flex flex-col h-full">
                              <span>23</span>
                              <div className="mt-1 bg-green-100 text-green-800 rounded px-2 py-1 text-xs">
                                Odpolední 14-22
                              </div>
                            </div>
                          </div>
                          <div className="p-2 border-t border-r h-24 bg-slate-50 text-slate-400">24</div>
                          <div className="p-2 border-t h-24 bg-slate-50 text-slate-400">25</div>
                          
                          {/* Week 5 */}
                          <div className="p-2 border-t border-r h-24">26</div>
                          <div className="p-2 border-t border-r h-24">27</div>
                          <div className="p-2 border-t border-r h-24">28</div>
                          <div className="p-2 border-t border-r h-24">29</div>
                          <div className="p-2 border-t border-r h-24">30</div>
                          <div className="p-2 border-t border-r h-24 bg-slate-50 text-slate-400">31</div>
                          <div className="p-2 border-t h-24 bg-slate-50 text-slate-400">
                            <span className="text-slate-400">1</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button>Přidat směnu</Button>
                        <Button variant="outline">Vytvořit pravidelný rozvrh</Button>
                      </div>
                      
                      <div className="bg-slate-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Shrnutí měsíce</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Odpracované směny</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-3xl font-bold">10</div>
                              <p className="text-sm text-muted-foreground">Z toho: 5 ranních, 5 odpoledních</p>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Celkem hodin</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-3xl font-bold">80</div>
                              <p className="text-sm text-muted-foreground">Průměr: 8 hodin denně</p>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Naplánované směny</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-3xl font-bold">15</div>
                              <p className="text-sm text-muted-foreground">Květen 2025</p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Carpool Tab */}
              <TabsContent value="carpool">
                <Card>
                  <CardHeader>
                    <CardTitle>Spolujízda</CardTitle>
                    <CardDescription>
                      Najděte nebo nabídněte spolujízdu dalším pendlerům na podobné trase
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {/* Search Form */}
                      <div className="bg-slate-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Najít spolujízdu</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Odkud</label>
                            <input type="text" className="w-full p-2 border rounded" placeholder="Např. Praha" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kam</label>
                            <input type="text" className="w-full p-2 border rounded" placeholder="Např. Mnichov" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Datum</label>
                            <input type="date" className="w-full p-2 border rounded" />
                          </div>
                          <div className="flex items-end">
                            <Button className="w-full">Hledat</Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Available Rides */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Dostupné spolujízdy</h3>
                        <div className="space-y-4">
                          <div className="bg-white border rounded-lg p-5 shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <div className="flex items-start space-x-4">
                                <div className="bg-slate-100 h-12 w-12 rounded-full flex items-center justify-center">
                                  <Car className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                  <h4 className="font-semibold">Praha → Drážďany</h4>
                                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Po-Pá, odjezd 5:30, návrat 17:00</span>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-4 md:mt-0 flex flex-col items-end">
                                <div className="text-lg font-semibold">150 Kč / jízda</div>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  <span>3 volná místa</span>
                                </div>
                              </div>
                            </div>
                            <div className="border-t mt-4 pt-4 flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden mr-2">
                                  <img src="https://source.unsplash.com/random/100x100/?portrait" alt="Profil" className="w-full h-full object-cover" />
                                </div>
                                <span className="text-sm font-medium">Jan Novák</span>
                                <div className="ml-2 flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                              </div>
                              <Button>Kontaktovat řidiče</Button>
                            </div>
                          </div>
                          
                          <div className="bg-white border rounded-lg p-5 shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <div className="flex items-start space-x-4">
                                <div className="bg-slate-100 h-12 w-12 rounded-full flex items-center justify-center">
                                  <Car className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                  <h4 className="font-semibold">Plzeň → Regensburg</h4>
                                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Po, St, Pá, odjezd 6:00, návrat 16:30</span>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-4 md:mt-0 flex flex-col items-end">
                                <div className="text-lg font-semibold">200 Kč / jízda</div>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  <span>2 volná místa</span>
                                </div>
                              </div>
                            </div>
                            <div className="border-t mt-4 pt-4 flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden mr-2">
                                  <img src="https://source.unsplash.com/random/100x100/?woman" alt="Profil" className="w-full h-full object-cover" />
                                </div>
                                <span className="text-sm font-medium">Marie Dvořáková</span>
                                <div className="ml-2 flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                              </div>
                              <Button>Kontaktovat řidiče</Button>
                            </div>
                          </div>
                          
                          <div className="bg-white border rounded-lg p-5 shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <div className="flex items-start space-x-4">
                                <div className="bg-slate-100 h-12 w-12 rounded-full flex items-center justify-center">
                                  <Car className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                  <h4 className="font-semibold">České Budějovice → Linz</h4>
                                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Út, Čt, odjezd 5:45, návrat 18:00</span>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-4 md:mt-0 flex flex-col items-end">
                                <div className="text-lg font-semibold">180 Kč / jízda</div>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  <span>1 volné místo</span>
                                </div>
                              </div>
                            </div>
                            <div className="border-t mt-4 pt-4 flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden mr-2">
                                  <img src="https://source.unsplash.com/random/100x100/?man" alt="Profil" className="w-full h-full object-cover" />
                                </div>
                                <span className="text-sm font-medium">Petr Svoboda</span>
                                <div className="ml-2 flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} className={`h-4 w-4 ${star <= 5 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                              </div>
                              <Button>Kontaktovat řidiče</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Offer a Ride */}
                      <div className="bg-primary-50 p-6 rounded-lg border border-primary-100">
                        <h3 className="text-lg font-semibold mb-4">Nabídnout spolujízdu</h3>
                        <p className="mb-4">
                          Máte volné místo v autě a chcete pomoci ostatním pendlerům? Nabídněte spolujízdu a rozdělte si náklady na cestu.
                        </p>
                        <Button>Vytvořit nabídku spolujízdy</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ShiftsPage;
