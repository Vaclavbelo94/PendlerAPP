import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import Layout from '@/components/layouts/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useErrorNotifications } from '@/hooks/useErrorNotifications';

const Contact = () => {
  const { t } = useTranslation(['contact', 'navigation']);
  const { showError, showSuccess, showValidationError, showEmailValidationError } = useErrorNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = t('notifications:forms.requiredField');
    }
    
    if (!formData.email.trim()) {
      errors.email = t('notifications:forms.requiredField');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t('notifications:forms.invalidEmail');
    }
    
    if (!formData.subject.trim()) {
      errors.subject = t('notifications:forms.requiredField');
    }
    
    if (!formData.message.trim()) {
      errors.message = t('notifications:forms.requiredField');
    } else if (formData.message.trim().length < 10) {
      errors.message = t('notifications:forms.fieldTooShort');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const firstError = Object.keys(errors)[0];
      showValidationError(firstError);
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Simulate form submission with potential failure
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate network error occasionally
          if (Math.random() > 0.8) {
            reject(new Error('Network error'));
          } else {
            resolve(true);
          }
        }, 2000);
      });
      
      showSuccess('submit');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setFormErrors({});
    } catch (error) {
      showError('network');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: t('contact:email'),
      value: 'info@dhlhelper.com',
      href: 'mailto:info@dhlhelper.com'
    },
    {
      icon: Phone,
      title: t('contact:phone'),
      value: '+420 123 456 789',
      href: 'tel:+420123456789'
    },
    {
      icon: MapPin,
      title: t('contact:address'),
      value: 'Praha, Česká republika',
      href: null
    }
  ];

  return (
    <>
      <Helmet>
        <title>{t('contact:title')} | DHL Helper</title>
        <meta name="description" content={t('contact:description')} />
      </Helmet>
      
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-4">
              <MessageCircle className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">{t('contact:title')}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('contact:subtitle')}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{t('contact:formTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t('contact:name')}</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder={t('contact:namePlaceholder')}
                          className={formErrors.name ? 'border-destructive' : ''}
                        />
                        {formErrors.name && (
                          <p className="text-sm text-destructive mt-1">{formErrors.name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('contact:email')}</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder={t('contact:emailPlaceholder')}
                          className={formErrors.email ? 'border-destructive' : ''}
                        />
                        {formErrors.email && (
                          <p className="text-sm text-destructive mt-1">{formErrors.email}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">{t('contact:subject')}</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder={t('contact:subjectPlaceholder')}
                        className={formErrors.subject ? 'border-destructive' : ''}
                      />
                      {formErrors.subject && (
                        <p className="text-sm text-destructive mt-1">{formErrors.subject}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">{t('contact:message')}</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder={t('contact:messagePlaceholder')}
                        className={`min-h-[120px] ${formErrors.message ? 'border-destructive' : ''}`}
                      />
                      {formErrors.message && (
                        <p className="text-sm text-destructive mt-1">{formErrors.message}</p>
                      )}
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                      size="lg"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {t('contact:sending')}
                        </div>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          {t('contact:send')}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{t('contact:infoTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    const content = (
                      <div className="flex items-start space-x-4 p-4 rounded-lg bg-card hover:bg-accent transition-colors">
                        <div className="flex-shrink-0">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{info.title}</h3>
                          <p className="text-muted-foreground">{info.value}</p>
                        </div>
                      </div>
                    );

                    return info.href ? (
                      <a key={index} href={info.href} className="block">
                        {content}
                      </a>
                    ) : (
                      <div key={index}>
                        {content}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">{t('contact:hoursTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{t('contact:weekdays')}</span>
                      <span className="text-muted-foreground">9:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('contact:saturday')}</span>
                      <span className="text-muted-foreground">10:00 - 14:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('contact:sunday')}</span>
                      <span className="text-muted-foreground">{t('contact:closed')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Contact;