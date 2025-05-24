
import React from "react";
import DashboardCard from "../DashboardCard";
import EducationWidget from "../EducationWidget";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, FileText, Calendar, Award } from "lucide-react";

const EducationTab = () => {
  const certificates = [
    {
      name: "Základy němčiny A1",
      issuer: "Goethe Institut",
      date: "2024-01-15",
      status: "completed",
      type: "language"
    },
    {
      name: "Bezpečnost práce",
      issuer: "TÜV SÜD",
      date: "2024-03-10",
      status: "completed",
      type: "safety"
    },
    {
      name: "Němčina B1",
      issuer: "Goethe Institut",
      date: "2024-06-20",
      status: "in_progress",
      type: "language"
    }
  ];

  const upcomingDeadlines = [
    {
      title: "Obnovení certifikátu bezpečnosti",
      date: "2024-12-15",
      priority: "high"
    },
    {
      title: "Zkouška němčiny B1",
      date: "2024-06-20",
      priority: "medium"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Dokončeno</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Probíhá</Badge>;
      default:
        return <Badge variant="secondary">Neznámý</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "language":
        return <GraduationCap className="h-4 w-4" />;
      case "safety":
        return <Award className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard
          title="Aktuální kurzy"
          description="Vaše probíhající vzdělávání"
          index={0}
        >
          <EducationWidget />
        </DashboardCard>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Nadcházející termíny</CardTitle>
            <CardDescription>Důležité deadliny a zkoušky</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{deadline.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(deadline.date).toLocaleDateString('cs-CZ')}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={deadline.priority === 'high' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {deadline.priority === 'high' ? 'Vysoká' : 'Střední'}
                  </Badge>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-3">
                Zobrazit všechny termíny
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Moje certifikáty</CardTitle>
          <CardDescription>Přehled vašich certifikátů a kvalifikací</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {certificates.map((cert, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted/50 rounded-lg">
                    {getTypeIcon(cert.type)}
                  </div>
                  <div>
                    <h4 className="font-medium">{cert.name}</h4>
                    <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(cert.date).toLocaleDateString('cs-CZ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(cert.status)}
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              <FileText className="h-4 w-4 mr-2" />
              Přidat certifikát
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EducationTab;
