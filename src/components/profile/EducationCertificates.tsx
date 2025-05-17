
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PlusIcon, TrashIcon, FileTextIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EducationCertificatesProps {
  userId?: string;
  readOnly?: boolean;
}

interface Certificate {
  id?: string;
  name: string;
  issuer: string;
  year: string;
  type: string;
  url?: string;
}

const EducationCertificates = ({ userId, readOnly = false }: EducationCertificatesProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [newCertificate, setNewCertificate] = useState<Certificate>({
    name: "",
    issuer: "",
    year: new Date().getFullYear().toString(),
    type: "language",
    url: ""
  });

  const targetUserId = userId || user?.id;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());

  useEffect(() => {
    const loadCertificates = async () => {
      if (!targetUserId) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_certificates')
          .select('*')
          .eq('user_id', targetUserId)
          .order('year', { ascending: false });
        
        if (error) {
          console.error('Chyba při načítání certifikátů:', error);
          throw error;
        }

        setCertificates(data || []);
      } catch (error) {
        console.error('Chyba při načítání certifikátů:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCertificates();
  }, [targetUserId]);

  const handleAddCertificate = async () => {
    if (!user?.id) return;
    if (!newCertificate.name || !newCertificate.issuer || !newCertificate.year) {
      toast.error("Vyplňte všechny povinné údaje");
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_certificates')
        .insert({
          user_id: user.id,
          name: newCertificate.name,
          issuer: newCertificate.issuer,
          year: newCertificate.year,
          type: newCertificate.type,
          url: newCertificate.url || null
        })
        .select();
      
      if (error) {
        throw error;
      }

      setCertificates(prev => [...prev, data[0]]);
      setNewCertificate({
        name: "",
        issuer: "",
        year: new Date().getFullYear().toString(),
        type: "language",
        url: ""
      });
      
      toast.success("Certifikát byl úspěšně přidán");
    } catch (error) {
      console.error('Chyba při přidávání certifikátu:', error);
      toast.error("Nepodařilo se přidat certifikát");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCertificate = async (id: string) => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_certificates')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }

      setCertificates(prev => prev.filter(cert => cert.id !== id));
      toast.success("Certifikát byl úspěšně odstraněn");
    } catch (error) {
      console.error('Chyba při odstraňování certifikátu:', error);
      toast.error("Nepodařilo se odstranit certifikát");
    } finally {
      setLoading(false);
    }
  };

  const getCertificateTypeLabel = (type: string) => {
    switch (type) {
      case "language": return "Jazykový";
      case "professional": return "Profesní";
      case "academic": return "Akademický";
      case "other": return "Ostatní";
      default: return type;
    }
  };

  if (loading && certificates.length === 0) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vzdělání a certifikáty</CardTitle>
        <CardDescription>
          {readOnly 
            ? "Přehled certifikátů a vzdělání" 
            : "Přidejte certifikáty, osvědčení a vzdělání"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Seznam certifikátů */}
        {certificates.length > 0 ? (
          <div className="space-y-4">
            {certificates.map(cert => (
              <div 
                key={cert.id} 
                className="p-4 border rounded-lg bg-card flex flex-col md:flex-row md:items-center gap-3 md:gap-4"
              >
                <div className="shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileTextIcon className="h-5 w-5 text-primary" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{cert.name}</h4>
                    <span className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
                      {getCertificateTypeLabel(cert.type)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{cert.issuer}, {cert.year}</p>
                  {cert.url && (
                    <a 
                      href={cert.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-blue-500 hover:underline mt-1 inline-block"
                    >
                      Zobrazit certifikát
                    </a>
                  )}
                </div>
                
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => cert.id && handleDeleteCertificate(cert.id)}
                  >
                    <TrashIcon className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              {readOnly 
                ? "Tento uživatel nemá přidané žádné certifikáty" 
                : "Nemáte přidané žádné certifikáty"}
            </p>
          </div>
        )}
        
        {/* Formulář pro přidání certifikátu */}
        {!readOnly && (
          <div className="mt-6 border-t pt-6">
            <h3 className="font-medium text-lg mb-4">Přidat nový certifikát</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="certName">Název certifikátu *</Label>
                  <Input
                    id="certName"
                    value={newCertificate.name}
                    onChange={(e) => setNewCertificate(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="např. B2 First Certificate"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="certIssuer">Vydavatel *</Label>
                  <Input
                    id="certIssuer"
                    value={newCertificate.issuer}
                    onChange={(e) => setNewCertificate(prev => ({ ...prev, issuer: e.target.value }))}
                    placeholder="např. Cambridge Assessment English"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="certType">Typ certifikátu</Label>
                  <Select 
                    value={newCertificate.type} 
                    onValueChange={(value) => setNewCertificate(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger id="certType" className="w-full">
                      <SelectValue placeholder="Vyberte typ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="language">Jazykový</SelectItem>
                      <SelectItem value="professional">Profesní</SelectItem>
                      <SelectItem value="academic">Akademický</SelectItem>
                      <SelectItem value="other">Ostatní</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="certYear">Rok vydání *</Label>
                  <Select 
                    value={newCertificate.year} 
                    onValueChange={(value) => setNewCertificate(prev => ({ ...prev, year: value }))}
                  >
                    <SelectTrigger id="certYear" className="w-full">
                      <SelectValue placeholder="Vyberte rok" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="certUrl">URL certifikátu (volitelné)</Label>
                <Input
                  id="certUrl"
                  value={newCertificate.url}
                  onChange={(e) => setNewCertificate(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://"
                />
                <p className="text-xs text-muted-foreground">
                  Odkaz na váš certifikát nebo diplom (pokud je dostupný online)
                </p>
              </div>
              
              <Button 
                onClick={handleAddCertificate} 
                disabled={!newCertificate.name || !newCertificate.issuer}
                className="mt-2"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Přidat certifikát
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EducationCertificates;
