
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from 'recharts';
import { DIFFICULTY_COLORS } from '@/data/vocabularyDashboardData';
import { motion } from 'framer-motion';

interface DifficultyDistributionProps {
  difficultyDistribution?: {
    easy: number;
    medium: number;
    hard: number;
    unspecified: number;
  };
}

const DifficultyDistribution: React.FC<DifficultyDistributionProps> = ({ difficultyDistribution }) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  // Prepare difficulty data
  const difficultyData = difficultyDistribution ? [
    { name: 'Snadná', value: difficultyDistribution.easy, color: DIFFICULTY_COLORS.easy },
    { name: 'Střední', value: difficultyDistribution.medium, color: DIFFICULTY_COLORS.medium },
    { name: 'Obtížná', value: difficultyDistribution.hard, color: DIFFICULTY_COLORS.hard },
    { name: 'Neurčeno', value: difficultyDistribution.unspecified, color: DIFFICULTY_COLORS.unspecified }
  ].filter(item => item.value > 0) : [];

  // If no data, show placeholder
  const isEmpty = !difficultyData.length;

  // Custom tooltip component for difficulty pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white dark:bg-gray-800 shadow-lg rounded-lg border">
          <p className="font-medium">{payload[0].name}</p>
          <p>
            <span className="font-bold">{payload[0].value}</span> slovíček 
            ({((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Animation for active sector in pie chart
  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#999" fontSize={12}>
          {`${payload.name} (${value})`}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" fontSize={12}>
          {`${(percent * 100).toFixed(1)}%`}
        </text>
      </g>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Rozdělení podle obtížnosti</CardTitle>
        <CardDescription>Zastoupení jednotlivých úrovní obtížnosti</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          {!isEmpty ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={difficultyData.map(item => ({ ...item, total: difficultyData.reduce((sum, d) => sum + d.value, 0) }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={1}
                  dataKey="value"
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(undefined)}
                >
                  {difficultyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <motion.div 
              className="h-full flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-muted-foreground">Žádná data k dispozici</p>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DifficultyDistribution;
