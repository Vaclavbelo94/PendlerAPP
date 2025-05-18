import React, { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CircleInfoIcon } from "@/components/ui/icons";

const ShiftsProgress = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<string | null>(null);

  const data = [
    { label: 'Ranní', value: 24, maxValue: 30, color: 'bg-blue-500', details: { completed: 24, remaining: 6, days: 'Pondělí, Středa, Pátek' } },
    { label: 'Odpolední', value: 18, maxValue: 30, color: 'bg-amber-500', details: { completed: 18, remaining: 12, days: 'Úterý, Čtvrtek' } },
    { label: 'Noční', value: 12, maxValue: 20, color: 'bg-indigo-500', details: { completed: 12, remaining: 8, days: 'Sobota, Neděle' } },
  ];
  
  const totalHours = data.reduce((acc, curr) => acc + curr.value, 0);
  const totalExpectedHours = data.reduce((acc, curr) => acc + curr.maxValue, 0);
  const totalProgress = (totalHours / totalExpectedHours) * 100;
  
  const handleOpenDetails = (label: string) => {
    setSelectedShift(label);
    setDialogOpen(true);
  };
  
  const selectedShiftData = data.find(item => item.label === selectedShift);
  
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between text-sm items-center">
            <div className="flex items-center gap-1">
              <span>{item.label}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => handleOpenDetails(item.label)}>
                      <CircleInfoIcon className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Klikněte pro detaily</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="font-medium">
              <span>{item.value} h</span>
              <span className="text-muted-foreground text-xs ml-1">/ {item.maxValue} h</span>
            </div>
          </div>
          <Progress value={(item.value / item.maxValue) * 100} className="h-2" indicatorClassName={item.color} />
        </div>
      ))}
      <div className="pt-3 border-t">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Celkový progres</span>
          <span className="font-medium">{totalHours} h / {totalExpectedHours} h</span>
        </div>
        <Progress value={totalProgress} className="h-3 mt-1" />
        <div className="text-right text-xs mt-1 text-muted-foreground">
          {totalProgress.toFixed(0)}% splněno
        </div>
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail směny: {selectedShift}</DialogTitle>
            <DialogDescription>
              Přehled odpracovaných hodin a plánovaných směn
            </DialogDescription>
          </DialogHeader>
          
          {selectedShiftData && (
            <div className="py-4">
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="p-4 border rounded-lg bg-muted/30">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Statistika</h3>
                    <div className={`rounded-full h-3 w-3 ${selectedShiftData.color}`}></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Odpracováno:</span>
                      <span className="font-medium">{selectedShiftData.details.completed} hodin</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Zbývá:</span>
                      <span className="font-medium">{selectedShiftData.details.remaining} hodin</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dnů v měsíci:</span>
                      <span className="font-medium">{selectedShiftData.details.completed / 8} dnů</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pokrytí plánu:</span>
                      <span className="font-medium">
                        {((selectedShiftData.value / selectedShiftData.maxValue) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Pravidelné dny</h3>
                  <p className="text-muted-foreground">{selectedShiftData.details.days}</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => setDialogOpen(false)}>Zavřít</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShiftsProgress;
