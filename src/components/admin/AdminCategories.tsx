
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Settings, Crown, Key, BarChart3, FileText, Activity } from "lucide-react";

interface AdminSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  variant: "primary" | "secondary" | "accent";
  category: string;
}

interface AdminCategoriesProps {
  adminSections: AdminSection[];
  onSectionClick: (sectionId: string) => void;
}

const categories = {
  "user-management": {
    title: "Správa uživatelů",
    description: "Nástroje pro správu uživatelských účtů a oprávnění"
  },
  "features": {
    title: "Funkce a konfigurace",
    description: "Nastavení aplikačních funkcí a promocí"
  },
  "monitoring": {
    title: "Monitoring a analýza",
    description: "Sledování výkonu a analýza dat"
  }
};

export const AdminCategories = ({ adminSections, onSectionClick }: AdminCategoriesProps) => {
  return (
    <>
      {Object.entries(categories).map(([categoryKey, category]) => (
        <div key={categoryKey} className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-1">{category.title}</h2>
            <p className="text-sm text-muted-foreground">{category.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminSections
              .filter(section => section.category === categoryKey)
              .map((section) => (
                <Card
                  key={section.id}
                  onClick={() => onSectionClick(section.id)}
                  className="group relative cursor-pointer hover:bg-accent/50 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        section.variant === 'primary' ? 'bg-primary/10 text-primary' :
                        section.variant === 'accent' ? 'bg-accent/10 text-accent' :
                        section.variant === 'secondary' ? 'bg-secondary/10 text-secondary' :
                        'bg-muted/20 text-muted-foreground'
                      }`}>
                        {section.icon}
                      </div>
                      <div>
                        <CardTitle className="text-base">{section.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{section.description}</CardDescription>
                  </CardContent>
                </Card>
              ))
            }
          </div>
        </div>
      ))}
    </>
  );
};
