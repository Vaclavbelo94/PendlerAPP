
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/animated-section";

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
        <AnimatedSection className="text-center mb-12" type="fade">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ukázka aplikace</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Podívejte se, jak Pendler Helper funguje v praxi a jak vám může usnadnit život.
          </p>
        </AnimatedSection>
        
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="language" className="w-full">
            <AnimatedSection type="slide" direction="up" delay={0.3}>
              <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
                {mockScreenshots.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + (i * 0.1), duration: 0.5 }}
                  >
                    <TabsTrigger value={item.id} className="text-sm md:text-base w-full">
                      {item.title}
                    </TabsTrigger>
                  </motion.div>
                ))}
              </TabsList>
            </AnimatedSection>
            
            {mockScreenshots.map((item) => (
              <TabsContent key={item.id} value={item.id}>
                <AnimatedSection type="scale">
                  <motion.div 
                    className="bg-white rounded-lg shadow-xl overflow-hidden"
                    whileInView={{ 
                      boxShadow: ["0 4px 12px rgba(0,0,0,0.1)", "0 10px 24px rgba(0,0,0,0.2)", "0 4px 12px rgba(0,0,0,0.1)"]
                    }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <div className="aspect-video w-full relative">
                      <motion.img 
                        src={item.image} 
                        alt={`Screenshot of ${item.title}`} 
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      />
                      {/* Overlay for mobile device frame */}
                      <div className="absolute inset-0 border-[10px] border-dark rounded-lg pointer-events-none"></div>
                      
                      {/* Mobile device controls */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-5 bg-dark rounded-b-xl"></div>
                    </div>
                    
                    <motion.div 
                      className="p-6"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground mb-4">{item.description}</p>
                      <Link to={`/${item.id}`}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button>
                            Vyzkoušet {item.title.toLowerCase()}
                          </Button>
                        </motion.div>
                      </Link>
                    </motion.div>
                  </motion.div>
                </AnimatedSection>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default AppShowcase;
