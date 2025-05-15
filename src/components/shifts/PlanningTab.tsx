
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

export const PlanningTab = ({ user }: { user: any }) => {
  const navigate = useNavigate();
  const [route, setRoute] = useState({ from: "", to: "", time: "" });
  
  // Handler for saving route
  const handleSaveRoute = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    toast({
      title: `Trasa uložena`,
      description: `${route.from} → ${route.to} v ${route.time}`,
      variant: "default"
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Route Planning Section */}
      <Card className="border-dhl-yellow">
        <CardHeader className="border-b border-dhl-yellow">
          <CardTitle>Plánování trasy</CardTitle>
          <CardDescription>Zadejte svou trasu a časy cesty</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="from">Odkud</Label>
            <Input 
              id="from" 
              placeholder="Místo odjezdu" 
              value={route.from} 
              onChange={(e) => setRoute({...route, from: e.target.value})} 
              className="border-dhl-black focus-visible:ring-dhl-yellow"
            />
          </div>
          <div>
            <Label htmlFor="to">Kam</Label>
            <Input 
              id="to" 
              placeholder="Cílová destinace" 
              value={route.to}
              onChange={(e) => setRoute({...route, to: e.target.value})}
              className="border-dhl-black focus-visible:ring-dhl-yellow"
            />
          </div>
          <div>
            <Label htmlFor="time">Čas odjezdu</Label>
            <Input 
              id="time" 
              type="time" 
              value={route.time}
              onChange={(e) => setRoute({...route, time: e.target.value})}
              className="border-dhl-black focus-visible:ring-dhl-yellow"
            />
          </div>
          <Button 
            className="w-full bg-dhl-yellow text-dhl-black hover:bg-dhl-yellow/90" 
            onClick={handleSaveRoute}
          >
            Uložit trasu
          </Button>
        </CardContent>
      </Card>

      {/* Ride Sharing Section */}
      <Card className="border-dhl-yellow">
        <CardHeader className="border-b border-dhl-yellow">
          <CardTitle>Spolujízda</CardTitle>
          <CardDescription>Najděte nebo nabídněte spolujízdu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted rounded-md p-3">
            <p className="font-medium mb-2">Dostupné spolujízdy:</p>
            <ul className="space-y-2">
              <li className="p-2 bg-background rounded border border-dhl-yellow">
                <p className="font-medium">Praha → Mladá Boleslav</p>
                <p className="text-sm text-muted-foreground">Odjezd: 5:30, Volná místa: 3</p>
              </li>
              <li className="p-2 bg-background rounded border border-dhl-yellow">
                <p className="font-medium">Kladno → Praha</p>
                <p className="text-sm text-muted-foreground">Odjezd: 6:00, Volná místa: 2</p>
              </li>
              <li className="p-2 bg-background rounded border border-dhl-yellow">
                <p className="font-medium">Beroun → Praha</p>
                <p className="text-sm text-muted-foreground">Odjezd: 6:15, Volná místa: 1</p>
              </li>
            </ul>
          </div>
          <Button className="w-full bg-dhl-red text-white hover:bg-dhl-red/90">
            Hledat spolujízdu
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
