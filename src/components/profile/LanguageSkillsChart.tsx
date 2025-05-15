
import { useState, useEffect } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateLanguageSkillsData } from "@/utils/chartData";

const LanguageSkillsChart = () => {
  const [data, setData] = useState(generateLanguageSkillsData());
  
  // Simulate skill improvement every 5 seconds for demo purposes
  useEffect(() => {
    const interval = setInterval(() => {
      setData(data.map(item => ({
        ...item,
        value: Math.min(100, item.value + (Math.random() > 0.7 ? 1 : 0))
      })));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [data]);
  
  const averageSkill = Math.round(data.reduce((sum, item) => sum + item.value, 0) / data.length);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Jazykové dovednosti</CardTitle>
          <Badge variant="outline" className="font-normal">
            Průměr: {averageSkill}/100
          </Badge>
        </div>
        <CardDescription>
          Přehled vašich jazykových dovedností
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={90} data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Dovednosti"
                dataKey="value"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguageSkillsChart;
