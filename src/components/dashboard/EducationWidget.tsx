
import React from "react";
import { Button } from "@/components/ui/button";

const EducationWidget = () => {
  const courses = [
    { name: 'Základy němčiny', progress: 78, total: '24 lekcí' },
    { name: 'Odborná němčina pro výrobu', progress: 45, total: '18 lekcí' },
    { name: 'Německé pracovní právo', progress: 10, total: '12 lekcí' },
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
          Pokračovat ve studiu
        </Button>
      </div>
    </div>
  );
};

export default EducationWidget;
