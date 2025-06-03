
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-100/30 via-purple-100/30 to-indigo-100/30" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-400/10 to-purple-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-indigo-400/10 rounded-full blur-3xl" />
      
      <div className="relative container py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl shadow-lg mb-6"
          >
            <Mail className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Kontaktujte nás
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Máte dotaz nebo návrh? Neváhejte nás kontaktovat. Odpovídáme obvykle do 24 hodin.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  Kontaktní informace
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <motion.div 
                  className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100"
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(139, 92, 246, 0.15)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Email</h3>
                    <p className="text-violet-600 font-medium">info@pendleruvpomocnik.cz</p>
                    <p className="text-sm text-muted-foreground mt-1">Odpovídáme do 24 hodin</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100"
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(147, 51, 234, 0.15)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Telefon</h3>
                    <p className="text-purple-600 font-medium">+420 725 458 395</p>
                    <p className="text-sm text-muted-foreground mt-1">Po-Pá: 9:00 - 17:00</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100"
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(99, 102, 241, 0.15)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Adresa</h3>
                    <div className="text-indigo-600 font-medium space-y-1">
                      <p>Pendlerův Pomocník s.r.o.</p>
                      <p>Hlavní 123</p>
                      <p>150 00 Praha 5</p>
                    </div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Send className="h-6 w-6 text-white" />
                  </div>
                  Napište nám
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Jméno
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Vaše jméno"
                      required
                      className="border-violet-200 focus:border-violet-400 focus:ring-violet-400/20"
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vas@email.cz"
                      required
                      className="border-violet-200 focus:border-violet-400 focus:ring-violet-400/20"
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Zpráva
                    </label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Vaše zpráva..."
                      rows={6}
                      required
                      className="border-violet-200 focus:border-violet-400 focus:ring-violet-400/20 resize-none"
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg text-white font-semibold py-3" 
                      disabled={isLoading}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {isLoading ? "Odesílání..." : "Odeslat zprávu"}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
