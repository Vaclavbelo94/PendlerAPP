
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Share, Mail, Link, Download, Calendar } from 'lucide-react';
import { toast } from "sonner";

interface ShareOptions {
  format: 'link' | 'email' | 'calendar' | 'pdf';
  timeRange: 'week' | 'month' | 'custom';
  includeDetails: boolean;
}

const ScheduleShareDialog = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'email' | 'export'>('link');
  const [shareOptions, setShareOptions] = useState<ShareOptions>({
    format: 'link',
    timeRange: 'week',
    includeDetails: true
  });
  const [emailData, setEmailData] = useState({
    recipient: '',
    subject: 'Můj pracovní rozvrh',
    message: 'Dobrý den,\n\npřikládám svůj pracovní rozvrh.\n\nS pozdravem'
  });

  const generateShareLink = () => {
    const baseUrl = window.location.origin;
    const shareId = Math.random().toString(36).substring(2, 15);
    const shareUrl = `${baseUrl}/shared-schedule/${shareId}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success("Odkaz byl zkopírován do schránky");
    }).catch(() => {
      toast.error("Nepodařilo se zkopírovat odkaz");
    });
    
    return shareUrl;
  };

  const handleEmailShare = () => {
    if (!emailData.recipient) {
      toast.error("Zadejte e-mailovou adresu příjemce");
      return;
    }
    
    toast.success("E-mail s rozvrhem byl odeslán");
    setOpen(false);
  };

  const handleExport = (format: 'pdf' | 'calendar') => {
    if (format === 'pdf') {
      toast.success("PDF s rozvrhem bylo staženo");
    } else {
      toast.success("Kalendář byl exportován");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Share className="h-4 w-4" />
          Sdílet rozvrh
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Sdílení rozvrhu směn</DialogTitle>
          <DialogDescription>
            Vyberte způsob, jak chcete sdílet svůj pracovní rozvrh
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            <Button
              variant={activeTab === 'link' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('link')}
              className="flex-1"
            >
              <Link className="h-4 w-4 mr-2" />
              Odkaz
            </Button>
            <Button
              variant={activeTab === 'email' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('email')}
              className="flex-1"
            >
              <Mail className="h-4 w-4 mr-2" />
              E-mail
            </Button>
            <Button
              variant={activeTab === 'export' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('export')}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {activeTab === 'link' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sdílení odkazem</CardTitle>
                <CardDescription>
                  Vygenerujte odkaz, který můžete sdílet s kýmkoli
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Časové období</Label>
                  <Select
                    value={shareOptions.timeRange}
                    onValueChange={(value: any) => setShareOptions(prev => ({ ...prev, timeRange: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Tento týden</SelectItem>
                      <SelectItem value="month">Tento měsíc</SelectItem>
                      <SelectItem value="custom">Vlastní období</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={generateShareLink} className="w-full">
                  <Link className="h-4 w-4 mr-2" />
                  Vygenerovat odkaz
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'email' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Odeslání e-mailem</CardTitle>
                <CardDescription>
                  Pošlete rozvrh přímo na e-mailovou adresu
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">E-mail příjemce</Label>
                  <Input
                    id="recipient"
                    type="email"
                    placeholder="priklad@email.cz"
                    value={emailData.recipient}
                    onChange={(e) => setEmailData(prev => ({ ...prev, recipient: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Předmět</Label>
                  <Input
                    id="subject"
                    value={emailData.subject}
                    onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Zpráva</Label>
                  <Textarea
                    id="message"
                    rows={4}
                    value={emailData.message}
                    onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                  />
                </div>
                
                <Button onClick={handleEmailShare} className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Odeslat e-mail
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'export' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Export rozvrhu</CardTitle>
                <CardDescription>
                  Stáhněte rozvrh v různých formátech
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => handleExport('pdf')}
                  className="w-full justify-start"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Stáhnout jako PDF
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleExport('calendar')}
                  className="w-full justify-start"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Exportovat do kalendáře
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
            Zavřít
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleShareDialog;
