
import React from "react";
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
  // Chart data
  const chartData = {
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

  // Chart options
  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Use the custom hook to handle chart initialization and cleanup
  const { chartRef } = useChartInitialization({
    type: 'bar',
    data: chartData,
    options: chartOptions
  });

  return (
    <div className="h-[200px]">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default WordsChart;
