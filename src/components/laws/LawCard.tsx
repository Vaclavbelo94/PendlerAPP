
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LawItem {
  id: string;
  title: string;
  description: string;
  category: string;
  updated: string;
  icon: React.ReactNode;
  path: string;
}

interface LawCardProps {
  law: LawItem;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('cs-CZ', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(date);
};

export const LawCard: React.FC<LawCardProps> = ({ law }) => (
  <Card className="h-full transition-all hover:shadow-md">
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <div className="p-2 rounded-full bg-slate-100">
          {law.icon}
        </div>
        <Badge variant="outline" className="text-xs">
          Aktualizováno: {formatDate(law.updated)}
        </Badge>
      </div>
      <CardTitle className="mt-2 text-lg">{law.title}</CardTitle>
      <CardDescription>{law.description}</CardDescription>
    </CardHeader>
    <CardFooter>
      <Button asChild variant="secondary" className="w-full">
        <Link to={law.path}>Zobrazit detaily</Link>
      </Button>
    </CardFooter>
  </Card>
);

export default LawCard;
