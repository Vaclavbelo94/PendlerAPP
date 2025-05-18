
import React, { useState } from "react";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  BarController 
} from 'chart.js';
import { useChartInitialization } from "@/hooks/useChartInitialization";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  BarController // Added BarController to fix the "bar" is not a registered controller error
);

const WordsChart = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  // Weekly data
  const weeklyData = {
    labels: ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'],
    datasets: [{
      label: 'Naučená slova',
      data: [12, 19, 8, 15, 12, 20, 10],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
      borderRadius: 5,
    }]
  };

  // Monthly data
  const monthlyData = {
    labels: ['Týden 1', 'Týden 2', 'Týden 3', 'Týden 4'],
    datasets: [{
      label: 'Naučená slova',
      data: [42, 35, 51, 47],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
      borderRadius: 5,
    }]
  };

  // Yearly data
  const yearlyData = {
    labels: ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'],
    datasets: [{
      label: 'Naučená slova',
      data: [120, 145, 132, 152, 170, 142, 130, 128, 180, 195, 210, 172],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
      borderRadius: 5,
    }]
  };

  // Get active data based on time range
  const getActiveData = () => {
    switch(timeRange) {
      case 'month':
        return monthlyData;
      case 'year':
        return yearlyData;
      case 'week':
      default:
        return weeklyData;
    }
  };

  // Chart options
  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: function(context: any) {
            return context[0].label;
          },
          label: function(context: any) {
            return `Počet slov: ${context.raw}`;
          }
        }
      }
    }
  };

  // Use the custom hook to handle chart initialization and cleanup
  const { chartRef } = useChartInitialization({
    type: 'bar',
    data: getActiveData(),
    options: chartOptions
  });

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Select value={timeRange} onValueChange={(value: 'week' | 'month' | 'year') => setTimeRange(value)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Časové období" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Týden</SelectItem>
            <SelectItem value="month">Měsíc</SelectItem>
            <SelectItem value="year">Rok</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-[160px]">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default WordsChart;
