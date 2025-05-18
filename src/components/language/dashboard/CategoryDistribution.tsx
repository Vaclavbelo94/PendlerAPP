
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CATEGORY_COLORS } from '@/data/vocabularyDashboardData';

interface CategoryDistributionProps {
  categoryDistribution: { [key: string]: number } | undefined;
}

const CategoryDistribution: React.FC<CategoryDistributionProps> = ({ categoryDistribution }) => {
  // Prepare data for category distribution chart
  const categoryData = Object.entries(categoryDistribution || {})
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Kategorie slovíček</CardTitle>
        <CardDescription>Počet slovíček v každé kategorii</CardDescription>
      </CardHeader>
      <CardContent className="pb-1">
        {categoryData.length > 0 ? (
          <div className="space-y-3 overflow-hidden">
            {categoryData.slice(0, 6).map((category, index) => (
              <div key={category.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{category.name}</span>
                  <span className="font-medium">{category.value}</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full">
                  <div 
                    className="h-2 rounded-full transition-all" 
                    style={{ 
                      width: `${(category.value / Math.max(...categoryData.map(c => c.value))) * 100}%`,
                      backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
                    }}
                  ></div>
                </div>
              </div>
            ))}
            
            {categoryData.length > 6 && (
              <div className="text-xs text-muted-foreground text-center pt-2">
                +{categoryData.length - 6} dalších kategorií
              </div>
            )}
          </div>
        ) : (
          <div className="h-[220px] flex items-center justify-center">
            <p className="text-muted-foreground">Zatím nemáte žádná slovíčka v kategoriích</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryDistribution;
