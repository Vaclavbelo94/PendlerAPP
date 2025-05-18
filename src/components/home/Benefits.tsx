
import { Check } from "lucide-react";
import { AnimatedCounter, AnimatedSection, HoverEffectCard } from "@/components/ui/animated-section";
import { motion } from "framer-motion";

const benefits = [
  "Úspora času při plánování cest do práce",
  "Rychlejší zvládnutí pracovní němčiny",
  "Jasné porozumění německým zákonům a předpisům",
  "Optimalizace nákladů na dopravu díky spolujízdě",
  "Automatické připomínky důležitých termínů",
  "Zjednodušení každodenních rutinních úkolů"
];

const Benefits = () => {
  return (
    <section className="py-16 md:py-24 bg-slate-50 relative overflow-hidden">
      {/* Dekorativní prvky */}
      <motion.div 
        className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 rounded-full bg-primary-100 opacity-30 blur-xl -z-10"
        animate={{ 
          y: [0, -15, 0],
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-40 h-40 md:w-64 md:h-64 rounded-full bg-secondary-100 opacity-20 blur-xl -z-10"
        animate={{ 
          y: [0, 15, 0],
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      />

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <AnimatedSection className="lg:w-1/2" type="slide" direction="right">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Proč používat <span className="text-primary">Pendler Helper</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Aplikace vytvořená na míru potřebám českých pendlerů přináší řadu výhod,
              které vám usnadní každodenní práci a život v Německu.
            </p>
            
            <div className="grid gap-3">
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 5 }}
                >
                  <motion.div 
                    className="bg-primary/10 rounded-full p-1"
                    whileHover={{ scale: 1.2, backgroundColor: "rgba(255, 235, 59, 0.3)" }}
                  >
                    <Check className="h-4 w-4 text-primary" />
                  </motion.div>
                  <span>{benefit}</span>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
          
          <AnimatedSection className="lg:w-1/2 mt-8 lg:mt-0" type="scale" delay={0.3}>
            <HoverEffectCard className="bg-white rounded-lg shadow-xl p-6 md:p-8 relative">
              {/* Testimonial Card */}
              <div className="mb-6">
                <motion.svg 
                  className="h-8 w-8 text-primary-200 mb-2" 
                  fill="currentColor" 
                  viewBox="0 0 32 32" 
                  xmlns="http://www.w3.org/2000/svg"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, delay: 1, repeat: Infinity, repeatDelay: 5 }}
                >
                  <path d="M10 8c-3.3 0-6 2.7-6 6v10h6V14h-4c0-2.2 1.8-4 4-4zm12 0c-3.3 0-6 2.7-6 6v10h6V14h-4c0-2.2 1.8-4 4-4z"></path>
                </motion.svg>
                <motion.p 
                  className="italic text-dark-500 mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: true }}
                >
                  "Díky této aplikaci jsem konečně přestal mít problémy s plánováním směn a s porozuměním německým předpisům. 
                  Funkce spolujízdy mi navíc ušetřila spoustu peněz za benzín."
                </motion.p>
                <motion.div 
                  className="flex items-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <motion.div 
                    className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden mr-3"
                    whileHover={{ scale: 1.1 }}
                  >
                    <img 
                      src="https://source.unsplash.com/random/100x100/?portrait" 
                      alt="Spokojený uživatel" 
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div>
                    <p className="font-medium">Jan Novák</p>
                    <p className="text-sm text-muted-foreground">Pendler již 3 roky</p>
                  </div>
                </motion.div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-5">
                <div className="text-center">
                  <AnimatedCounter 
                    from={0}
                    to={15}
                    suffix="+"
                    className="text-2xl md:text-3xl font-bold text-primary"
                  />
                  <p className="text-sm text-muted-foreground">Minut úspory času denně</p>
                </div>
                <div className="text-center">
                  <AnimatedCounter 
                    from={0}
                    to={30}
                    suffix="%"
                    className="text-2xl md:text-3xl font-bold text-primary"
                    delay={0.3}
                  />
                  <p className="text-sm text-muted-foreground">Snížení nákladů</p>
                </div>
                <div className="text-center">
                  <AnimatedCounter 
                    from={0}
                    to={5000}
                    suffix="+"
                    className="text-2xl md:text-3xl font-bold text-primary"
                    delay={0.6}
                    duration={2.5}
                  />
                  <p className="text-sm text-muted-foreground">Spokojených pendlerů</p>
                </div>
              </div>
              
              {/* Decorative elements */}
              <motion.div 
                className="hidden md:block absolute -top-4 -right-4 w-12 h-12 bg-primary-100 rounded-full"
                animate={{ 
                  y: [0, -5, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div 
                className="hidden md:block absolute -bottom-6 -left-6 w-16 h-16 bg-secondary-100 rounded-full"
                animate={{ 
                  y: [0, 5, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
              />
            </HoverEffectCard>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
