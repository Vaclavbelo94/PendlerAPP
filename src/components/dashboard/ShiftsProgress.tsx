
import React from "react";

const ShiftsProgress = () => {
  const data = [
    { label: 'Ranní', value: 24, color: 'bg-blue-500' },
    { label: 'Odpolední', value: 18, color: 'bg-amber-500' },
    { label: 'Noční', value: 12, color: 'bg-indigo-500' },
  ];
  
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{item.label}</span>
            <span className="font-medium">{item.value} h</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div className={`${item.color} h-2 rounded-full`} style={{ width: `${(item.value / 30) * 100}%` }}></div>
          </div>
        </div>
      ))}
      <div className="pt-2 flex justify-between text-sm">
        <span className="text-muted-foreground">Celkem</span>
        <span className="font-medium">{data.reduce((acc, curr) => acc + curr.value, 0)} h</span>
      </div>
    </div>
  );
};

export default ShiftsProgress;
