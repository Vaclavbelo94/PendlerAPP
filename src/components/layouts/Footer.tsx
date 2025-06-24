
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Heart,
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation('common');
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: t('aboutUs'), href: '/about' },
    { label: t('contact'), href: '/contact' },
    { label: t('privacy'), href: '/privacy' },
    { label: t('terms'), href: '/terms' },
    { label: 'FAQ', href: '/faq' }
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-4">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          {/* Brand Section */}
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <Heart className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold">PendlerApp</span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {footerLinks.map((link, index) => (
              <Link 
                key={index}
                to={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-1">
            {socialLinks.map((social, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                asChild
                className="h-8 w-8 p-0"
              >
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              </Button>
            ))}
          </div>
        </div>

        <Separator className="my-3" />

        {/* Bottom Footer */}
        <div className="text-center text-sm text-muted-foreground">
          © {currentYear} PendlerApp. {t('allRightsReserved')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
