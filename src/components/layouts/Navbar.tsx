
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BriefcaseIcon, 
  GlobeIcon, 
  LanguagesIcon, 
  LogOutIcon, 
  MenuIcon, 
  UserIcon, 
  X,
  CarFrontIcon,
  CalendarClockIcon,
  TranslateIcon
} from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check login status when the component mounts or route changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);
      
      if (loggedIn) {
        try {
          const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
          setUserName(currentUser.name || "");
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    };

    checkLoginStatus();
  }, [location]);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
    setUserName("");
    navigate("/");
  };

  const navItems = [
    {
      title: "Výuka němčiny",
      path: "/language",
      icon: <LanguagesIcon className="w-4 h-4" />
    },
    {
      title: "Překladač",
      path: "/translator",
      icon: <TranslateIcon className="w-4 h-4" />
    },
    {
      title: "Přehled zákonů",
      path: "/laws",
      icon: <GlobeIcon className="w-4 h-4" />
    },
    {
      title: "Správa vozidla",
      path: "/vehicle",
      icon: <CarFrontIcon className="w-4 h-4" />
    },
    {
      title: "Plánování směn",
      path: "/shifts",
      icon: <CalendarClockIcon className="w-4 h-4" />
    },
  ];

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="container-custom mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold">
                PH
              </div>
              <span className="font-poppins font-bold text-xl text-gray-800">Pendler Helper</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`text-gray-600 font-medium text-sm hover:text-primary-600 transition-colors flex items-center gap-1.5 px-1 py-1.5 ${
                  location.pathname === item.path ? 'text-primary-600 border-b-2 border-primary-500' : ''
                }`}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
            
            {isLoggedIn ? (
              <div className="flex items-center gap-3 ml-4">
                <div className="flex items-center gap-2 bg-gray-50 py-1.5 px-3 rounded-full">
                  <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{userName}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5">
                  <LogOutIcon className="h-4 w-4" />
                  Odhlásit se
                </Button>
              </div>
            ) : (
              <Button variant="default" size="sm" onClick={() => navigate("/login")} className="ml-4">
                Přihlásit se
              </Button>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 hover:text-primary-600 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <MenuIcon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-fade-in">
          <div className="container-custom py-4">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`text-gray-700 font-medium text-sm transition-colors flex items-center gap-2 p-2 rounded-lg ${
                    location.pathname === item.path ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
              
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-2 p-2">
                    <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                      <UserIcon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">{userName}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full gap-2 mt-2"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOutIcon className="h-4 w-4" />
                    Odhlásit se
                  </Button>
                </>
              ) : (
                <Button 
                  variant="default" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/login");
                  }}
                >
                  Přihlásit se
                </Button>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
