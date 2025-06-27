import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/hooks/auth';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Plus, Calendar, ExternalLink } from "lucide-react";

interface EducationCertificate {
  id: string;
  title: string;
  institution: string;
  date: string;
  description: string;
  link?: string;
}

const initialCertificates: EducationCertificate[] = [
  {
    id: "1",
    title: "Bachelor's Degree in Computer Science",
    institution: "University of Example",
    date: "2018-2022",
    description: "Completed a comprehensive program in computer science.",
    link: "https://example.com/certificate1"
  },
  {
    id: "2",
    title: "Master's Degree in Data Science",
    institution: "Tech Academy",
    date: "2022-2024",
    description: "Specialized in data analysis and machine learning.",
    link: "https://example.com/certificate2"
  }
];

const EducationCertificates: React.FC = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<EducationCertificate[]>(initialCertificates);

  if (!user) {
    return <p>Please log in to view your education certificates.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education Certificates</CardTitle>
        <CardDescription>
          List of your education certificates and achievements.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {certificates.map((certificate) => (
          <div key={certificate.id} className="border rounded-md p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold">{certificate.title}</h4>
                <p className="text-sm text-muted-foreground">{certificate.institution}</p>
              </div>
              <Badge variant="secondary">
                <Calendar className="h-3 w-3 mr-1" />
                {certificate.date}
              </Badge>
            </div>
            <p className="mt-2 text-sm">{certificate.description}</p>
            {certificate.link && (
              <a href={certificate.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-500 hover:underline mt-2">
                View Certificate
                <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            )}
          </div>
        ))}
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Certificate
        </Button>
      </CardContent>
    </Card>
  );
};

export default EducationCertificates;
