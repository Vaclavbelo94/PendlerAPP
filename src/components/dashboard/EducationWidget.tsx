
import React from "react";
import { Button } from "@/components/ui/button";

// Removed German courses: now shows general education blocks
const EducationWidget = () => {
  const courses = [
    { name: 'Interní školení', progress: 90, total: '12 modulů' },
    { name: 'Školení BOZP', progress: 100, total: '1 modul' },
    { name: 'Práce s novým zařízením', progress: 60, total: '4 kroky' },
  ];
  
  return (
    <div className="space-y-4">
      {courses.map((course, i) => (
        <div key={i} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">{course.name}</span>
            <span className="text-xs text-muted-foreground">{course.progress}% z {course.total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </div>
      ))}
      <div className="pt-2">
        <Button variant="outline" size="sm" className="w-full">
          Pokračovat ve školení
        </Button>
      </div>
    </div>
  );
};

export default EducationWidget;
