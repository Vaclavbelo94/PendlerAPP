import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Truck, MapPin, Phone, User, Mail, CheckCircle, Loader2, ExternalLink, Info } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import dhlLogo from '@/assets/dhl-logo.png';
import LanguageSwitcherCompact from '@/components/ui/LanguageSwitcherCompact';

const DHLRecruitment = () => {
  const { t } = useTranslation('dhl');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    city: '',
    phone: '',
    consent: false
  });

  const cities = [
    'Praha', 'Brno', 'Ostrava', 'Plzeň', 'Liberec', 'Olomouc', 'České Budějovice', 
    'Hradec Králové', 'Ústí nad Labem', 'Pardubice', 'Zlín', 'Kladno', 'Karviná', 
    'Jihlava', 'Teplice', 'Děčín', 'Frýdek-Místek', 'Opava', 'Karlovy Vary', 'Mladá Boleslav'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.city || !formData.phone || !formData.consent) {
      toast.error(t('recruitment.validation.allFieldsRequired'));
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-recruitment-email', {
        body: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          city: formData.city,
          phone: formData.phone,
          language: localStorage.getItem('i18nextLng') || 'cs'
        }
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success(t('recruitment.success.submitted'));
    } catch (error) {
      console.error('Error submitting recruitment form:', error);
      toast.error(t('recruitment.error.submission'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dhl-yellow via-dhl-yellow/80 to-dhl-red/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-dhl-red mb-2">
                {t('recruitment.success.title')}
              </h2>
              <p className="text-muted-foreground">
                {t('recruitment.success.message')}
              </p>
            </div>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-dhl-red hover:bg-dhl-red/90"
            >
              {t('recruitment.success.backToHome')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dhl-yellow via-dhl-yellow/80 to-dhl-red/20 p-4">
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcherCompact />
      </div>
      
      <div className="container mx-auto max-w-2xl py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img 
              src={dhlLogo} 
              alt="DHL Logo" 
              className="h-16 md:h-20 object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold mb-2">{t('recruitment.title')}</h2>
          <p className="text-lg text-muted-foreground">{t('recruitment.subtitle')}</p>
        </div>

        {/* Info banner with link to main app */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-blue-800 mb-2">
                {t('recruitment.info.description')}
              </p>
              <a 
                href="/" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                {t('recruitment.info.linkText')}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-dhl-red">
              <User className="h-5 w-5" />
              {t('recruitment.form.title')}
            </CardTitle>
            <CardDescription>
              {t('recruitment.form.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t('recruitment.form.firstName')}
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder={t('recruitment.form.firstNamePlaceholder')}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t('recruitment.form.lastName')}
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder={t('recruitment.form.lastNamePlaceholder')}
                    required
                  />
                </div>
              </div>

              {/* City selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t('recruitment.form.city')}
                </Label>
                <Select onValueChange={(value) => handleInputChange('city', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder={t('recruitment.form.cityPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {t('recruitment.form.phone')}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder={t('recruitment.form.phonePlaceholder')}
                  required
                />
              </div>

              {/* Consent checkbox */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="consent"
                  checked={formData.consent}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, consent: checked as boolean }))
                  }
                  required
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="consent"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('recruitment.form.consent')}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t('recruitment.form.consentDescription')}
                  </p>
                </div>
              </div>

              {/* Submit button */}
              <Button 
                type="submit" 
                className="w-full bg-dhl-red hover:bg-dhl-red/90 text-white font-semibold py-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('recruitment.form.submitting')}
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    {t('recruitment.form.submit')}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>{t('recruitment.footer')}</p>
        </div>
      </div>
    </div>
  );
};

export default DHLRecruitment;