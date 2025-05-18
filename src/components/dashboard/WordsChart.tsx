
import React, { useEffect, useRef } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WordsChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    
    const ctx = chartRef.current;
    
    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const data = {
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
    const options = {
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    // Create new chart instance
    chartInstance.current = new ChartJS(ctx, {
      type: 'bar',
      data,
      options
    });
    
    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="h-[200px]">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default WordsChart;
