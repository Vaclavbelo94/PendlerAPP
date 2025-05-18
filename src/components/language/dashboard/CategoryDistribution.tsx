
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CATEGORY_COLORS } from '@/data/vocabularyDashboardData';
import { Button } from '@/components/ui/button';
import { BarChart3, Columns2, SortAsc, SortDesc } from 'lucide-react';

interface CategoryDistributionProps {
  categoryDistribution?: { [key: string]: number };
}

interface CategoryItem {
  name: string;
  value: number;
  color: string;
}

const CategoryDistribution: React.FC<CategoryDistributionProps> = ({ categoryDistribution }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'value' | 'name'>('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'bar' | 'column'>('bar');

  // Process data for the chart
  const processData = (): CategoryItem[] => {
    if (!categoryDistribution) return [];
    
    return Object.entries(categoryDistribution)
      .map(([category, count], idx) => ({
        name: category === 'uncategorized' ? 'Bez kategorie' : category,
        value: count,
        color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length]
      }))
      .sort((a, b) => {
        if (sortBy === 'name') {
          return sortOrder === 'asc' 
            ? a.name.localeCompare(b.name) 
            : b.name.localeCompare(a.name);
        } else {
          return sortOrder === 'asc' 
            ? a.value - b.value 
            : b.value - a.value;
        }
      });
  };
  
  const data = processData();
  const isEmpty = data.length === 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white dark:bg-gray-800 shadow-lg rounded-lg border">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p>Počet slovíček: <span className="font-bold">{payload[0].value}</span></p>
        </div>
      );
    }
    return null;
  };
  
  const toggleSort = () => {
    if (sortBy === 'value') {
      if (sortOrder === 'desc') {
        setSortOrder('asc');
      } else {
        setSortBy('name');
        setSortOrder('asc');
      }
    } else {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else {
        setSortBy('value');
        setSortOrder('desc');
      }
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <CardTitle className="text-lg">Kategorie slovíček</CardTitle>
            <CardDescription>Rozdělení slovíček podle kategorií</CardDescription>
          </div>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleSort}
              title={`Seřadit podle ${sortBy === 'name' ? 'názvu' : 'počtu'} ${sortOrder === 'asc' ? 'vzestupně' : 'sestupně'}`}
            >
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setViewMode(viewMode === 'bar' ? 'column' : 'bar')}
              title={`Zobrazit jako ${viewMode === 'bar' ? 'sloupce' : 'řádky'}`}
            >
              {viewMode === 'bar' ? <BarChart3 className="h-4 w-4" /> : <Columns2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          {!isEmpty ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout={viewMode === 'bar' ? 'vertical' : 'horizontal'}
                onClick={() => setActiveIndex(null)}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                {viewMode === 'bar' ? (
                  <>
                    <XAxis type="number" />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={100} 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => value.length > 10 ? `${value.slice(0, 10)}...` : value}
                    />
                  </>
                ) : (
                  <>
                    <XAxis 
                      type="category" 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => value.length > 10 ? `${value.slice(0, 10)}...` : value}
                    />
                    <YAxis type="number" />
                  </>
                )}
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  // Removed nameKey prop as it's not supported by the Bar component
                  radius={[4, 4, 0, 0]}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={activeIndex === index ? entry.color : `${entry.color}99`}
                      onMouseOver={() => setActiveIndex(index)}
                      onMouseOut={() => setActiveIndex(null)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Žádné kategorie zatím nebyly přidány</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryDistribution;
