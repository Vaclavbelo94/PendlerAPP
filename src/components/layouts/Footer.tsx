
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-dark-500 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <Calendar className="h-6 w-6" />
              <span className="font-roboto font-bold text-xl">Pendler Helper</span>
            </Link>
            <p className="text-gray-300 mb-4">
              Komplexní průvodce a pomocník pro české pendlery pracující v Německu.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Funkce</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/language" className="text-gray-300 hover:text-white transition-colors">
                  Výuka němčiny
                </Link>
              </li>
              <li>
                <Link to="/laws" className="text-gray-300 hover:text-white transition-colors">
                  Přehled zákonů
                </Link>
              </li>
              <li>
                <Link to="/vehicle" className="text-gray-300 hover:text-white transition-colors">
                  Správa vozidla
                </Link>
              </li>
              <li>
                <Link to="/shifts" className="text-gray-300 hover:text-white transition-colors">
                  Plánování směn
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">O nás</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  O projektu
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">
                  Časté otázky
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Kontakt</h3>
            <p className="text-gray-300 mb-2">
              Email: info@pendlerhelper.cz
            </p>
            <p className="text-gray-300 mb-4">
              Telefon: +420 725 458 395
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-300 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-300 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.95 4.57a10 10 0 01-2.82.77 4.96 4.96 0 002.16-2.72c-.95.55-2 .96-3.13 1.19a4.92 4.92 0 00-8.4 4.49 14 14 0 01-10.18-5.14 4.92 4.92 0 001.52 6.57 4.9 4.9 0 01-2.23-.61v.06c0 2.37 1.7 4.36 3.95 4.82a4.96 4.96 0 01-2.22.08 4.93 4.93 0 004.6 3.42 9.87 9.87 0 01-7.28 2.03 14 14 0 007.55 2.2c9.05 0 14-7.5 14-13.98 0-.21 0-.42-.02-.63a9.94 9.94 0 002.4-2.53z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-300 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.06 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.35 1.06.41 2.23.06 1.27.07 1.65.07 4.85 0 3.2-.01 3.58-.07 4.85-.06 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.35-2.23.41-1.27.06-1.65.07-4.85.07-3.2 0-3.58-.01-4.85-.07-1.17-.06-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.43-.35-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85 0-3.2.01-3.58.07-4.85.06-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.35 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.77.14 4.9.35 4.15.65c-.78.3-1.44.71-2.09 1.37-.66.66-1.07 1.32-1.37 2.09-.3.75-.51 1.62-.58 2.9-.06 1.28-.07 1.69-.07 4.95 0 3.26.01 3.67.07 4.95.07 1.28.28 2.15.58 2.9.3.77.71 1.43 1.37 2.09.66.66 1.32 1.07 2.09 1.37.75.3 1.62.51 2.9.58 1.28.06 1.69.07 4.95.07 3.26 0 3.67-.01 4.95-.07 1.28-.07 2.15-.28 2.9-.58.77-.3 1.43-.71 2.09-1.37.66-.66 1.07-1.32 1.37-2.09.3-.75.51-1.62.58-2.9.06-1.28.07-1.69.07-4.95 0-3.26-.01-3.67-.07-4.95-.07-1.28-.28-2.15-.58-2.9-.3-.77-.71-1.43-1.37-2.09-.66-.66-1.32-1.07-2.09-1.37-.75-.3-1.62-.51-2.9-.58C15.67.01 15.26 0 12 0zm0 5.84c-3.4 0-6.16 2.76-6.16 6.16 0 3.4 2.76 6.16 6.16 6.16 3.4 0 6.16-2.76 6.16-6.16 0-3.4-2.76-6.16-6.16-6.16zm0 10.16c-2.21 0-4-1.79-4-4 0-2.21 1.79-4 4-4 2.21 0 4 1.79 4 4 0 2.21-1.79 4-4 4zm7.85-10.4c0 .79-.64 1.43-1.43 1.43-.79 0-1.43-.64-1.43-1.43 0-.79.64-1.43 1.43-1.43.79 0 1.43.64 1.43 1.43z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © 2025 Pendler Helper. Všechna práva vyhrazena.
          </p>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-4 text-sm text-gray-300">
            <Link to="/terms" className="hover:text-white transition-colors">
              Podmínky použití
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Ochrana soukromí
            </Link>
            <Link to="/cookies" className="hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
