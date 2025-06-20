
import { Link } from "react-router-dom";
import { 
  Calendar, 
  GithubIcon, 
  FacebookIcon, 
  InstagramIcon, 
  TwitterIcon, 
  PhoneIcon, 
  MailIcon, 
  GlobeIcon 
} from "lucide-react";
import { useLanguage } from '@/hooks/useLanguage';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();
  
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-gray-800">
          <div className="col-span-1 md:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold">
                PP
              </div>
              <span className="font-bold text-xl">{t('footer.appName')}</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white transition-all">
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white transition-all">
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white transition-all">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Github" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white transition-all">
                <GithubIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-semibold text-lg mb-4 text-white">{t('footer.features')}</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/vocabulary" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  {t('footer.germanLessons')}
                </Link>
              </li>
              <li>
                <Link to="/laws" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  {t('footer.lawsOverview')}
                </Link>
              </li>
              <li>
                <Link to="/vehicle" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  {t('footer.vehicleManagement')}
                </Link>
              </li>
              <li>
                <Link to="/shifts" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  {t('footer.shiftPlanning')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-semibold text-lg mb-4 text-white">{t('footer.aboutUs')}</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  {t('footer.aboutProject')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  {t('contact')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  {t('footer.frequentQuestions')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1 md:col-span-4">
            <h3 className="font-semibold text-lg mb-4 text-white">{t('contact')}</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-blue-400">
                  <MailIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('contactEmail')}</p>
                  <p className="text-gray-300">admin@pendlerapp.cz</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-blue-400">
                  <PhoneIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('contactPhone')}</p>
                  <p className="text-gray-300">+420 725 458 395</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-blue-400">
                  <GlobeIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('footer.website')}</p>
                  <p className="text-gray-300">www.pendlerapp.cz</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} {t('footer.appName')}. {t('footer.allRightsReserved')}.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <Link to="/terms" className="hover:text-blue-400 transition-colors">
              {t('footer.termsOfUse')}
            </Link>
            <Link to="/privacy" className="hover:text-blue-400 transition-colors">
              {t('footer.privacyProtection')}
            </Link>
            <Link to="/cookies" className="hover:text-blue-400 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
