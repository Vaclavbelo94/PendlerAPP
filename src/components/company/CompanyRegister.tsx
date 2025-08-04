import React, { useState } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Eye, EyeOff, Building2, User, Mail, Lock, Phone } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { toast } from 'sonner';
import PromoCodeField from '@/components/auth/PromoCodeField';

const CompanyRegister: React.FC = () => {
  const { company } = useParams<{ company: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation(['auth', 'common']);
  const { signUp } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    promoCode: '',
    acceptTerms: false,
    acceptMarketing: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPromoValid, setIsPromoValid] = useState(false);
  const [isDHLCode, setIsDHLCode] = useState(false);

  const companyConfig = {
    adecco: {
      name: 'Adecco',
      logo: '🏢',
      gradient: 'from-blue-500 via-blue-600 to-blue-700',
      color: 'blue'
    },
    randstad: {
      name: 'Randstad',
      logo: '🔵',
      gradient: 'from-indigo-500 via-purple-600 to-pink-600',
      color: 'indigo'
    },
    dhl: {
      name: 'DHL',
      logo: '📦',
      gradient: 'from-yellow-400 via-orange-500 to-red-600',
      color: 'orange'
    }
  };

  const config = company ? companyConfig[company as keyof typeof companyConfig] : null;

  if (!config) {
    return <Navigate to="/" replace />;
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePromoCodeChange = (code: string, isValid: boolean, isDHL: boolean = false) => {
    console.log('=== COMPANY PROMO CODE CHANGE ===');
    console.log('Code:', code, 'Is Valid:', isValid, 'Is DHL:', isDHL);
    
    setFormData(prev => ({ ...prev, promoCode: code }));
    setIsPromoValid(isValid);
    setIsDHLCode(isDHL);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error(t('auth:passwordsDoNotMatch'));
      return;
    }

    if (!formData.acceptTerms) {
      toast.error(t('auth:acceptTermsRequired'));
      return;
    }

    setIsLoading(true);

    try {
      const username = `${formData.firstName} ${formData.lastName}`.trim();
      
      // Determine company based on URL parameter and promo code validation
      const registrationCompany = isDHLCode && isPromoValid ? 'dhl' : (company || null);
      console.log('Registration company:', registrationCompany);
      
      // Use validated promo code only if it's valid
      const finalPromoCode = (formData.promoCode && isPromoValid) ? formData.promoCode : '';
      
      const { error } = await signUp(
        formData.email,
        formData.password,
        username,
        finalPromoCode,
        registrationCompany
      );

      if (error) {
        toast.error(typeof error === 'string' ? error : error.message);
      } else {
        if (isDHLCode && finalPromoCode) {
          toast.success('Registrace s promo kódem úspěšná!', { 
            description: `Premium na rok aktivován. Po přihlášení můžete dokončit nastavení profilu.`,
            duration: 8000
          });
        } else if (finalPromoCode && isPromoValid) {
          toast.success(t('auth:accountCreatedWithPremium'), { 
            description: `Premium aktivován s kódem ${finalPromoCode}. Nyní se můžete přihlásit.`,
            duration: 8000
          });
        } else {
          toast.success(t('auth:registerSuccess'));
        }
        
        // Automatický reload po úspěšné registraci
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (err) {
      toast.error(t('auth:registrationError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 bg-${config.color}-500/5 rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 bg-${config.color}-500/5 rounded-full blur-3xl animate-pulse delay-1000`}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 hover:bg-background/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common:back')}
          </Button>

          {/* Registration Form */}
          <Card className="bg-background/60 backdrop-blur-lg border-0 shadow-2xl">
            <CardHeader className="text-center pb-6">
              {/* Company Logo */}
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                {config.logo}
              </div>
              
              <CardTitle className="text-2xl font-bold">
                {t('auth:registerWith')} {t(`auth:companies.${company}`)}
              </CardTitle>
              <p className="text-muted-foreground">
                {t('auth:createAccount')}
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      {t('auth:firstName')} *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      {t('auth:lastName')} *
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    {t('auth:email')} *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    {t('auth:phone')}
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">
                    {t('auth:password')} *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    {t('auth:confirmPassword')} *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Promo Code */}
                <PromoCodeField 
                  onPromoCodeChange={handlePromoCodeChange} 
                  validationMode="manual"
                />

                {/* Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => handleInputChange('acceptTerms', !!checked)}
                      required
                    />
                    <Label htmlFor="acceptTerms" className="text-sm">
                      {t('auth:acceptTerms')} *
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="acceptMarketing"
                      checked={formData.acceptMarketing}
                      onCheckedChange={(checked) => handleInputChange('acceptMarketing', !!checked)}
                    />
                    <Label htmlFor="acceptMarketing" className="text-sm">
                      {t('auth:acceptMarketing')}
                    </Label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t('auth:registering')}
                    </div>
                  ) : (
                    t('auth:register')
                  )}
                </Button>

                {isDHLCode && formData.promoCode && isPromoValid && (
                  <div className="text-sm text-center bg-orange-100 p-3 rounded-lg border border-orange-200">
                    <p className="font-medium text-orange-800">✨ Speciální Premium registrace</p>
                    <p className="text-orange-700">Váš účet bude aktivován s premium přístupem na rok!</p>
                  </div>
                )}

                {/* Login Link */}
                <div className="text-center mt-6">
                  <p className="text-sm text-muted-foreground">
                    {t('auth:alreadyHaveAccount')}{' '}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-primary"
                      onClick={() => navigate('/login')}
                    >
                      {t('auth:login')}
                    </Button>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegister;