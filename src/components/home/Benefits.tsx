
import { Check } from "lucide-react";

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
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Proč používat <span className="text-primary">Pendler Helper</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Aplikace vytvořená na míru potřebám českých pendlerů přináší řadu výhod,
              které vám usnadní každodenní práci a život v Německu.
            </p>
            
            <div className="grid gap-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-full p-1">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:w-1/2 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 relative">
              {/* Testimonial Card */}
              <div className="mb-6">
                <svg className="h-8 w-8 text-primary-200 mb-2" fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 8c-3.3 0-6 2.7-6 6v10h6V14h-4c0-2.2 1.8-4 4-4zm12 0c-3.3 0-6 2.7-6 6v10h6V14h-4c0-2.2 1.8-4 4-4z"></path>
                </svg>
                <p className="italic text-dark-500 mb-4">
                  "Díky této aplikaci jsem konečně přestal mít problémy s plánováním směn a s porozuměním německým předpisům. 
                  Funkce spolujízdy mi navíc ušetřila spoustu peněz za benzín."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden mr-3">
                    <img 
                      src="https://source.unsplash.com/random/100x100/?portrait" 
                      alt="Spokojený uživatel" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Jan Novák</p>
                    <p className="text-sm text-muted-foreground">Pendler již 3 roky</p>
                  </div>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-5">
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-primary">15+</p>
                  <p className="text-sm text-muted-foreground">Minut úspory času denně</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-primary">30%</p>
                  <p className="text-sm text-muted-foreground">Snížení nákladů</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-primary">5000+</p>
                  <p className="text-sm text-muted-foreground">Spokojených pendlerů</p>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="hidden md:block absolute -top-4 -right-4 w-12 h-12 bg-primary-100 rounded-full"></div>
              <div className="hidden md:block absolute -bottom-6 -left-6 w-16 h-16 bg-secondary-100 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
