
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulace odeslání formuláře
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Zpráva byla úspěšně odeslána");
    
    // Reset formuláře
    setName("");
    setEmail("");
    setMessage("");
    setIsLoading(false);
  };

  return (
    <div className="py-12 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Kontaktujte nás</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Máte dotaz nebo návrh? Neváhejte nás kontaktovat. Odpovídáme obvykle do 24 hodin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div>
            <Card className="p-6 h-full">
              <h2 className="text-2xl font-bold mb-6">Kontaktní informace</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-primary mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p>info@pendlerhelper.cz</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-primary mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold">Telefon</h3>
                    <p>+420 725 458 395</p>
                    <p className="text-sm text-muted-foreground">Po-Pá: 9:00 - 17:00</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-primary mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold">Adresa</h3>
                    <p>Pendler Helper s.r.o.</p>
                    <p>Hlavní 123</p>
                    <p>150 00 Praha 5</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Napište nám</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Jméno
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Vaše jméno"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vas@email.cz"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Zpráva
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Vaše zpráva..."
                    rows={4}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Odesílání..." : "Odeslat zprávu"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
