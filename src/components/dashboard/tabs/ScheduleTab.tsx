
import React from "react";
import DashboardCard from "../DashboardCard";
import ScheduleWidget from "../ScheduleWidget";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, MapPin, User } from "lucide-react";

const ScheduleTab = () => {
  const weekStats = {
    totalHours: 32,
    plannedHours: 40,
    overtime: 2,
    shifts: 4
  };

  const nextShifts = [
    {
      date: "2024-01-22",
      time: "6:00 - 14:00",
      type: "Ranní",
      location: "Výrobní hala A",
      status: "confirmed"
    },
    {
      date: "2024-01-24",
      time: "14:00 - 22:00", 
      type: "Odpolední",
      location: "Výrobní hala B",
      status: "pending"
    },
    {
      date: "2024-01-25",
      time: "14:00 - 22:00",
      type: "Odpolední", 
      location: "Výrobní hala A",
      status: "confirmed"
    }
  ];

  const colleagues = [
    { name: "Jan Novák", shift: "6:00 - 14:00", status: "online" },
    { name: "Marie Svobodová", shift: "14:00 - 22:00", status: "offline" },
    { name: "Petr Dvořák", shift: "22:00 - 6:00", status: "online" }
  ];

  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case "Ranní":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "Odpolední":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "Noční":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Potvrzeno</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Čeká</Badge>;
      default:
        return <Badge variant="secondary">Neznámý</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Odpracováno</span>
            </div>
            <p className="text-2xl font-bold mt-1">{weekStats.totalHours}h</p>
            <p className="text-xs text-muted-foreground">z {weekStats.plannedHours}h plánovaných</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Směny</span>
            </div>
            <p className="text-2xl font-bold mt-1">{weekStats.shifts}</p>
            <p className="text-xs text-muted-foreground">tento týden</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium">Přesčasy</span>
            </div>
            <p className="text-2xl font-bold mt-1">{weekStats.overtime}h</p>
            <p className="text-xs text-muted-foreground">nad rámec</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Kolegové</span>
            </div>
            <p className="text-2xl font-bold mt-1">{colleagues.filter(c => c.status === 'online').length}</p>
            <p className="text-xs text-muted-foreground">online nyní</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard
          title="Týdenní rozpis"
          description="Vaše naplánované směny"
          index={0}
        >
          <ScheduleWidget />
        </DashboardCard>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Nadcházející směny</CardTitle>
            <CardDescription>Vaše další směny</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {nextShifts.map((shift, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="text-sm font-medium">
                        {new Date(shift.date).toLocaleDateString('cs-CZ', { 
                          day: 'numeric',
                          month: 'short'
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(shift.date).toLocaleDateString('cs-CZ', { weekday: 'short' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{shift.time}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-xs ${getShiftTypeColor(shift.type)}`}>
                          {shift.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {shift.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(shift.status)}
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-3">
                Zobrazit celý kalendář
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kolegové ve směně</CardTitle>
          <CardDescription>Kdo je nyní v práci</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {colleagues.map((colleague, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    colleague.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                  <div>
                    <p className="font-medium">{colleague.name}</p>
                    <p className="text-sm text-muted-foreground">{colleague.shift}</p>
                  </div>
                </div>
                <Badge variant={colleague.status === 'online' ? 'default' : 'secondary'}>
                  {colleague.status === 'online' ? 'Online' : 'Offline'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleTab;
