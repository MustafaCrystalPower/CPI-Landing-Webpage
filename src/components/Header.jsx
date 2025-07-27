import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronUp, Calculator } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import cpiLogo from "../assets/cpi-logo.jpeg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);
  const [desktopSubmenuOpen, setDesktopSubmenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const toolsMenuRef = useRef(null);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/#about" },
    { name: "Services", href: "/#services" },
    {
      name: "Tools",
      href: "#",
      submenu: [
        {
          name: "ROI Calculator",
          href: "/roi-calculator",
          icon: <Calculator className="w-4 h-4 mr-2" />,
        },
      ],
    },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ];

  // Handle click outside for desktop submenu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        toolsMenuRef.current &&
        !toolsMenuRef.current.contains(event.target)
      ) {
        setDesktopSubmenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle scroll to detect active section
  useEffect(() => {
    if (location.pathname === "/") {
      const handleScroll = () => {
        const scrollPosition = window.scrollY + 100;
        const aboutSection = document.getElementById("about");
        const servicesSection = document.getElementById("services");

        // Reset active section when at top of page
        if (scrollPosition < 150) {
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
        window.scrollTo({ top: 0, behavior: "smooth" });
        setActiveSection(null);
      } else {
        navigate("/");
      }
    } else if (href.startsWith("/#")) {
      e.preventDefault();
      const sectionId = href.split("#")[1];
      setActiveSection(sectionId);

      if (location.pathname === "/") {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        navigate("/");
        setTimeout(() => {
          const section = document.getElementById(sectionId);
          if (section) {
            section.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    } else if (href === "#") {
      e.preventDefault();
      return;
    }
    setIsMenuOpen(false);
    setMobileSubmenuOpen(false);
    setDesktopSubmenuOpen(false);
  };

  const isActive = (path) => {
    if (!path.includes("#") && path !== "/" && location.pathname === path) {
      return true;
    }

    if (path === "/") {
      return location.pathname === "/" && activeSection === null;
    }

    if (path === "/#about") {
      return location.pathname === "/" && activeSection === "about";
    }
    if (path === "/#services") {
      return location.pathname === "/" && activeSection === "services";
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
          <nav className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative h-full flex items-center"
              >
                {item.submenu ? (
                  <div
                    ref={toolsMenuRef}
                    className="h-full flex items-center"
                    onMouseEnter={() => setDesktopSubmenuOpen(true)}
                    onMouseLeave={() => setDesktopSubmenuOpen(false)}
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setDesktopSubmenuOpen(!desktopSubmenuOpen);
                      }}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive(item.href)
                          ? "bg-gray-900 text-white"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      {item.name}
                      {desktopSubmenuOpen ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </button>

                    {desktopSubmenuOpen && (
                      <div className="absolute z-10 left-0 top-full mt-0 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              onClick={(e) => {
                                navigate(subItem.href); // Fixed: Use navigate to go to ROI calculator
                                setDesktopSubmenuOpen(false);
                              }}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {subItem.icon}
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
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
                )}
              </div>
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
                <div key={item.name}>
                  {item.submenu ? (
                    <div>
                      <button
                        onClick={() => setMobileSubmenuOpen(!mobileSubmenuOpen)}
                        className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                          isActive(item.href)
                            ? "bg-gray-900 text-white"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <span>{item.name}</span>
                        {mobileSubmenuOpen ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                      {mobileSubmenuOpen && (
                        <div className="pl-4 mt-1 space-y-1">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              onClick={() => {
                                navigate(subItem.href); // Fixed: Use navigate to go to ROI calculator
                                setIsMenuOpen(false);
                              }}
                              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            >
                              {subItem.icon}
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
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
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
