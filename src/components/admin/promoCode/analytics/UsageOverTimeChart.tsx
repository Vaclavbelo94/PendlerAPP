
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UsageOverTimeData } from '../types';

interface UsageOverTimeChartProps {
  data: UsageOverTimeData[];
}

export const UsageOverTimeChart = ({ data }: UsageOverTimeChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }} 
          tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value, name) => {
            const formattedName = name === 'redemptions' ? 'Uplatněno' : 'Vytvořeno';
            return [value, formattedName];
          }}
          labelFormatter={(label) => new Date(label).toLocaleDateString()}
        />
        <Area 
          type="monotone" 
          dataKey="redemptions" 
          name="Uplatněno"
          stackId="1" 
          stroke="var(--color-usages)" 
          fill="var(--color-usages)"
          fillOpacity={0.3} 
        />
        <Area 
          type="monotone" 
          dataKey="created" 
          name="Vytvořeno"
          stackId="2" 
          stroke="var(--color-creations)" 
          fill="var(--color-creations)" 
          fillOpacity={0.3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
