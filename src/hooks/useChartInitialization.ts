
import { useRef, useEffect } from "react";
import { Chart as ChartJS, ChartData, ChartOptions, ChartType } from 'chart.js';

interface UseChartProps {
  type: ChartType;
  data: ChartData;
  options?: ChartOptions;
}

export const useChartInitialization = ({ type, data, options }: UseChartProps) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    
    const ctx = chartRef.current;
    
    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Create new chart instance
    chartInstance.current = new ChartJS(ctx, {
      type,
      data,
      options
    });
    
    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, options, type]);

  // Update chart when data or options change
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.data = data;
      if (options) {
        chartInstance.current.options = options;
      }
      chartInstance.current.update();
    }
  }, [data, options]);

  return { chartRef };
};
