import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  TrendingUp,
  Award,
  ArrowRight,
  Landmark,
  School,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import schoolCateringImg from "../assets/school-catering.jpg";
import hawanaCafeImg from "../assets/hawana-cafe.jpg";
import PartnersCarousel from "./Carousel";

const cpiLogo =
  "https://res.cloudinary.com/dbjaqbow6/image/upload/v1751207381/CPI-Logo_xm7na3.jpg";

const Home = () => {
  const businessSectors = [
    {
      title: "School Catering",
      description:
        "Providing high-quality catering services to educational institutions with a focus on nutrition and excellence.",
      icon: <School className="w-8 h-8 text-gray-700" />,
      image: schoolCateringImg,
    },
    {
      title: "Hawana Café",
      description:
        "A premium café experience offering exceptional coffee and dining in a sophisticated atmosphere.",
      icon: <Landmark className="w-8 h-8 text-gray-700" />,
      image: hawanaCafeImg,
    },
  ];

  const features = [
    {
      title: "Expert Investment Strategies",
      description:
        "Our team of experienced professionals develops tailored investment strategies to maximize returns.",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      title: "Diverse Portfolio",
      description:
        "We maintain a diversified portfolio across multiple business sectors to ensure stable growth.",
      icon: <Building2 className="w-6 h-6" />,
    },
    {
      title: "Proven Track Record",
      description:
        "Years of successful investments and satisfied clients demonstrate our commitment to excellence.",
      icon: <Award className="w-6 h-6" />,
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Building Your
                <span className="block text-gray-300">Investment Future</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-gray-300 leading-relaxed">
                Crystal Power Investments specializes in strategic property
                investments across diverse business sectors, delivering
                exceptional returns and sustainable growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-semibold cursor-pointer">
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/careers">
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg font-semibold bg-transparent cursor-pointer"
                  >
                    Join Our Team
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 p-8 flex items-center justify-center shadow-2xl">
                <img
                  src={cpiLogo}
                  alt="Crystal Power Investments"
                  className="w-64 h-64 object-cover rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              About Crystal Power Investments
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are a leading property investment company with a proven track
              record of success across multiple business sectors, committed to
              delivering exceptional value to our clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-6">
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive investment solutions with a primary focus
              on property investments, while also managing strategic ventures in
              the food service industry.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Properties Investment - Main Service */}
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-gray-900 to-gray-700 text-white p-8 rounded-lg shadow-xl">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-6">
                  <Building2 className="w-8 h-8 text-gray-900" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Property Investment</h3>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  Our core business focuses on strategic property investments
                  across Egypt's most promising markets. We identify
                  high-potential real estate opportunities and develop them into
                  profitable ventures that deliver sustainable returns for our
                  investors.
                </p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Residential and commercial property development
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Strategic location analysis and market research
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Portfolio management and optimization
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Long-term investment planning and growth strategies
                  </li>
                </ul>
              </div>
            </div>

            {/* School Catering - Secondary Service */}
            <div className="order-1 lg:order-2">
              <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  School Catering Services
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Through our strategic partnerships, we provide high-quality
                  catering services to educational institutions, ensuring
                  nutritious meals and excellent service standards that support
                  student well-being and academic success.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                    Nutritionally balanced meal programs
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                    Quality food safety and hygiene standards
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                    Customized menu planning and dietary accommodations
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                    Efficient service delivery and management
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Sectors Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Business Sectors
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We operate across diverse sectors, leveraging our expertise to
              create value and drive growth in each market we enter.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {businessSectors.map((sector, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={sector.image}
                    alt={sector.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-700 text-white">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-6">
                    <div className="text-white">{sector.icon}</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{sector.title}</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {sector.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PartnersCarousel></PartnersCarousel>

      {/* Call to Action Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Invest in Your Future?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join Crystal Power Investments and discover the potential of
            strategic property investment. Let us help you build a portfolio
            that delivers lasting value.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-semibold cursor-pointer">
                Contact Us Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/careers">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg font-semibold bg-transparent cursor-pointer"
              >
                Explore Careers
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
