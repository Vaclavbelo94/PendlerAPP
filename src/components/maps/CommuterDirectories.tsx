
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Users, Calendar, Car } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Ukázkové rozhraní pro komunitu pendlerů
interface PendlerCommunity {
  id: number;
  name: string;
  region: string;
  members: number;
  established: string;
  transportType: 'car' | 'public' | 'mixed';
  tags: string[];
  description: string;
}

// Ukázková data
const pendlerCommunities: PendlerCommunity[] = [
  {
    id: 1,
    name: "Karlovarská dopravní skupina",
    region: "Karlovy Vary → Bayreuth",
    members: 42,
    established: "2020",
    transportType: "car",
    tags: ["sdílení jízd", "flexibilní", "denní dojíždění"],
    description: "Skupina pendlerů z Karlovarského kraje dojíždějících do Bayreuthu. Sdílíme jízdy, zkušenosti a rady."
  },
  {
    id: 2,
    name: "Praha-Drážďany Express",
    region: "Praha → Dresden",
    members: 78,
    established: "2018",
    transportType: "public",
    tags: ["vlakem", "Dresden", "týdenní dojíždění"],
    description: "Komunita zaměřená na dojíždění vlakem z Prahy do Drážďan. Sdílíme tipy na levné jízdenky a ubytování."
  },
  {
    id: 3,
    name: "Plzeňsko-Německá skupina",
    region: "Plzeň → Regensburg",
    members: 35,
    established: "2021",
    transportType: "mixed",
    tags: ["kombinovaná doprava", "Bavorsko", "Regensburg"],
    description: "Kombinujeme auto i veřejnou dopravu pro cestování z Plzeňského kraje do Regensburgu a okolí."
  },
  {
    id: 4,
    name: "Ústecký pendler klub",
    region: "Ústí nad Labem → Chemnitz",
    members: 29,
    established: "2019",
    transportType: "car",
    tags: ["spolujízda", "denní dojíždění", "automobilem"],
    description: "Skupina pendlerů z Ústecka, kteří společně dojíždějí do Chemnitzu a okolních měst."
  }
];

const CommuterDirectories: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  
  const filteredCommunities = pendlerCommunities.filter(community => 
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const getTransportIcon = (type: 'car' | 'public' | 'mixed') => {
    switch (type) {
      case 'car':
        return <Car className="h-4 w-4" />;
      case 'public':
        return <Users className="h-4 w-4" />;
      case 'mixed':
        return <Users className="h-4 w-4" />;
    }
  };
  
  const getTransportLabel = (type: 'car' | 'public' | 'mixed') => {
    switch (type) {
      case 'car':
        return "Automobilem";
      case 'public':
        return "Veřejná doprava";
      case 'mixed':
        return "Kombinovaná doprava";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adresář pendlerských komunit</CardTitle>
        <CardDescription>
          Najděte komunitu pendlerů ve vašem okolí nebo pro vaši trasu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4">
          <Input
            placeholder="Hledat podle názvu, regionu nebo klíčového slova"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mr-2"
          />
          <Button variant="outline" className="flex-shrink-0">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          {filteredCommunities.length > 0 ? (
            filteredCommunities.map((community) => (
              <div key={community.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium">{community.name}</h3>
                  <Button size="sm" variant="secondary">
                    Připojit se
                  </Button>
                </div>
                
                <div className="flex items-center text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{community.region}</span>
                </div>
                
                <p className="mb-3">{community.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {community.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline">{tag}</Badge>
                  ))}
                </div>
                
                <Separator className="my-3" />
                
                <div className="flex flex-wrap justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{community.members} členů</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Založeno {community.established}</span>
                  </div>
                  <div className="flex items-center">
                    {getTransportIcon(community.transportType)}
                    <span className="ml-1">{getTransportLabel(community.transportType)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Žádné komunity neodpovídají vašemu vyhledávání.</p>
              <Button variant="outline" className="mt-2" onClick={() => setSearchTerm("")}>
                Zobrazit všechny komunity
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommuterDirectories;
