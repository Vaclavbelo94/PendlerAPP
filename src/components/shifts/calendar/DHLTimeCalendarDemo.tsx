
import React, { useState } from 'react';
import DHLTimeCalendarMockup from './DHLTimeCalendarMockup';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Download, Bell } from 'lucide-react';

const DHLTimeCalendarDemo: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date('2024-01-15'));

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Mock-up: DHL Kalendář s časy směn
                <Badge className="bg-blue-100 text-blue-800">Demo</Badge>
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Ukázka rozšíření současného kalendáře o přesné časy začátku a konce směn
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-1" />
                Nastavení sync
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-1" />
                Notifikace
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Calendar */}
      <DHLTimeCalendarMockup
        shifts={[]} // Uses mock data internally
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        isDHLUser={true}
      />

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Nové funkce v mock-upu:</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">📅 Vizuální vylepšení:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Přesné časy začátku a konce směny</li>
                <li>• Výpočet délky směny (8h, 8h 30m, atd.)</li>
                <li>• Barevné rozlišení auto-sync vs. manuální</li>
                <li>• Rychlé statistiky pod kalendářem</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">🔄 Automatická aktualizace:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Indikátor posledního auto-sync</li>
                <li>• Badge pro manuálně upravené směny</li>
                <li>• Možnost "Reset na plán haly"</li>
                <li>• Notifikace při změnách časů</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Pouze pro DHL zaměstnance:</strong> Funkce automatické aktualizace časů bude dostupná pouze uživatelům s DHL přístupem. 
              Admini budou mít v admin panelu možnost spravovat import a bulk operace.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DHLTimeCalendarDemo;
