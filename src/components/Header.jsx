import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import cpiLogo from "../assets/cpi-logo.jpeg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/#about" },
    { name: "Services", href: "/#services" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ];

  // Handle scroll to detect active section
  useEffect(() => {
    if (location.pathname === "/") {
      const handleScroll = () => {
        const scrollPosition = window.scrollY + 100;
        const aboutSection = document.getElementById("about");
        const servicesSection = document.getElementById("services");

        // Reset active section when at top of page
        if (scrollPosition < 150) {
          // Increased threshold for better UX
          setActiveSection(null);
          return;
        }

        // Check which section is in view
        if (servicesSection && scrollPosition >= servicesSection.offsetTop) {
          setActiveSection("services");
        } else if (aboutSection && scrollPosition >= aboutSection.offsetTop) {
          setActiveSection("about");
        } else {
          setActiveSection(null);
        }
      };

      // Run once on mount to set initial state
      handleScroll();

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setActiveSection(null);
    }
  }, [location.pathname]);

  const handleNavigation = (href, e) => {
    if (href === "/") {
      e.preventDefault();
      if (location.pathname === "/") {
        // Scroll to top if already on home page
        window.scrollTo({ top: 0, behavior: "smooth" });
        setActiveSection(null);
      } else {
        // Navigate to home if not already there
        navigate("/");
      }
    } else if (href.startsWith("/#")) {
      e.preventDefault();
      const sectionId = href.split("#")[1];
      setActiveSection(sectionId); // Immediately set active section

      if (location.pathname === "/") {
        // Scroll to section if on home page
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Navigate to home then scroll to section
        navigate("/");
        setTimeout(() => {
          const section = document.getElementById(sectionId);
          if (section) {
            section.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    }
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    // For non-home pages
    if (!path.includes("#") && location.pathname === path) return true;

    // For home page
    if (path === "/") {
      // Only active if we're at the very top with no active section
      return location.pathname === "/" && activeSection === null;
    }

    // For home page sections
    if (path === "/#about") {
      return activeSection === "about";
    }
    if (path === "/#services") {
      return activeSection === "services";
    }

    return false;
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3"
            onClick={(e) => {
              if (location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                setActiveSection(null);
              }
            }}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              <img
                src={cpiLogo}
                alt="Crystal Power Investments"
                className="w-10 h-10 object-cover rounded-full"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">
                Crystal Power Investments
              </h1>
              <p className="text-sm text-gray-600">
                Property Investment Specialists
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={(e) => handleNavigation(item.href, e)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mb-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={(e) => handleNavigation(item.href, e)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
