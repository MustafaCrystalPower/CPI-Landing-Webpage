import { Link } from "react-router-dom";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Instagram,
  Facebook,
} from "lucide-react";
import cpiLogo from "../assets/cpi-logo.jpeg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About Us", href: "/about_us" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ];

  const businessSectors = [
    { name: "School Catering", href: "#" },
    { name: "Hawana Café", href: "#" },
    { name: "Property Investment", href: "#" },
  ];

  const socialLinks = [
    { name: "LinkedIn", icon: <Linkedin className="w-5 h-5" />, href: "#" },
    { name: "Instagram", icon: <Instagram className="w-5 h-5" />, href: "#" },
    { name: "Facebook", icon: <Facebook className="w-5 h-5" />, href: "#" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                <img
                  src={cpiLogo}
                  alt="Crystal Power Investments"
                  className="w-10 h-10 object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Crystal Power Investments
                </h3>
                <p className="text-gray-400">Property Investment Specialists</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
              Leading the way in strategic property investments across diverse
              business sectors. We are committed to delivering exceptional
              returns and building lasting partnerships with our clients and
              investors.
            </p>

            {/* Contact Information */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">
                  6 October, Dream Land GT10
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div className="text-gray-300">
                  <div>+201066505665</div>
                  <div>+201005288884</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">
                  info@crystalpowerinvestments.com
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2"
                  >
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Sectors */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">
              Business Sectors
            </h4>
            <ul className="space-y-3">
              {businessSectors.map((sector) => (
                <li key={sector.name}>
                  <a
                    href={sector.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>{sector.name}</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <div className="mt-8">
              <h5 className="text-md font-semibold text-white mb-4">
                Follow Us
              </h5>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-200"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} Crystal Power Investments. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
