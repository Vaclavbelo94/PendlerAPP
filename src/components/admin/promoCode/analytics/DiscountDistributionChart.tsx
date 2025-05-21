
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DiscountDistributionData } from '../types';

interface DiscountDistributionChartProps {
  data: DiscountDistributionData[];
}

export const DiscountDistributionChart = ({ data }: DiscountDistributionChartProps) => {
  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="discount"
          label={({discount}) => `${discount}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value, name) => [`${value} kódů`, `${name}% sleva`]}
        />
        <Legend formatter={(value) => `${value}% sleva`} />
      </PieChart>
    </ResponsiveContainer>
  );
};
