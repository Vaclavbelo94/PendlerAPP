
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChartProps {
  data: any[];
  height?: number;
  tooltipFormatter?: (value: any) => [string, any];
  bars: {
    name: string;
    dataKey: string;
    fill: string;
  }[];
}

const CommuteComparisonChart = ({ data, height, tooltipFormatter, bars }: ChartProps) => {
  const isMobile = useIsMobile();
  const chartHeight = height || (isMobile ? 200 : 300);
  
  return (
    <div className={`h-[${chartHeight}px]`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={isMobile ? { top: 5, right: 10, left: 10, bottom: 5 } : { top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={tooltipFormatter || ((value) => [value, undefined])} />
          <Legend />
          {bars.map((bar) => (
            <Bar key={bar.dataKey} name={bar.name} dataKey={bar.dataKey} fill={bar.fill} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CommuteComparisonChart;
