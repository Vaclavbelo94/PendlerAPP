
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

const mockScreenshots = [
  {
    id: "language",
    title: "Výuka němčiny",
    image: "https://source.unsplash.com/random/800x600/?language,learning",
    description: "Interaktivní kurzy němčiny zaměřené na praktické fráze a slovní zásobu v pracovním prostředí."
  },
  {
    id: "laws",
    title: "Přehled zákonů",
    image: "https://source.unsplash.com/random/800x600/?document,legal",
    description: "Přehledné vysvětlení německých pracovních zákonů, daňových pravidel a dalších předpisů."
  },
  {
    id: "vehicle",
    title: "Správa vozidla",
    image: "https://source.unsplash.com/random/800x600/?car,maintenance",
    description: "Nástroj pro sledování údržby vozidla a připomínky důležitých kontrol."
  },
  {
    id: "shifts",
    title: "Plánování směn",
    image: "https://source.unsplash.com/random/800x600/?calendar,planning",
    description: "Kalendář pro organizaci pracovních směn a vyhledávání spolujízdy."
  },
];

const AppShowcase = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ukázka aplikace</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Podívejte se, jak Pendler Helper funguje v praxi a jak vám může usnadnit život.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="language" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
              {mockScreenshots.map((item) => (
                <TabsTrigger key={item.id} value={item.id} className="text-sm md:text-base">
                  {item.title}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {mockScreenshots.map((item) => (
              <TabsContent key={item.id} value={item.id}>
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                  <div className="aspect-video w-full relative">
                    <img 
                      src={item.image} 
                      alt={`Screenshot of ${item.title}`} 
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay for mobile device frame */}
                    <div className="absolute inset-0 border-[10px] border-dark rounded-lg pointer-events-none"></div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground mb-4">{item.description}</p>
                    <Link to={`/${item.id}`}>
                      <Button>
                        Vyzkoušet {item.title.toLowerCase()}
                      </Button>
                    </Link>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default AppShowcase;
