import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Sparkles, Stars } from "@react-three/drei";
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
import PartnersCarousel from "./Carousel";
import { Suspense } from "react";

// Custom hook for scroll animations
const useScrollAnimation = (threshold = 0.1, rootMargin = "0px") => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Disconnect after first intersection to prevent re-triggering
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin]);

  return [ref, isVisible];
};

// Animation wrapper component
const AnimatedSection = ({
  children,
  className = "",
  animationType = "fadeInUp",
  delay = 0,
}) => {
  const [ref, isVisible] = useScrollAnimation();

  const getAnimationClasses = () => {
    const baseClasses = "transition-all duration-1000 ease-out";
    const delayClass = delay > 0 ? `delay-${delay}` : "";

    switch (animationType) {
      case "fadeInUp":
        return `${baseClasses} ${delayClass} ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`;
      case "fadeInLeft":
        return `${baseClasses} ${delayClass} ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
        }`;
      case "fadeInRight":
        return `${baseClasses} ${delayClass} ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
        }`;
      case "fadeIn":
        return `${baseClasses} ${delayClass} ${
          isVisible ? "opacity-100" : "opacity-0"
        }`;
      case "scaleIn":
        return `${baseClasses} ${delayClass} ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`;
      case "slideInUp":
        return `${baseClasses} ${delayClass} ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
        }`;
      default:
        return `${baseClasses} ${delayClass} ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`;
    }
  };

  return (
    <div ref={ref} className={`${getAnimationClasses()} ${className}`}>
      {children}
    </div>
  );
};

// Staggered animation for multiple items
const StaggeredGrid = ({ children, className = "", staggerDelay = 200 }) => {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <AnimatedSection
          key={index}
          animationType="fadeInUp"
          delay={isVisible ? index * staggerDelay : 0}
          className="transition-all duration-700 ease-out"
        >
          {child}
        </AnimatedSection>
      ))}
    </div>
  );
};

const cpiLogo =
  "https://res.cloudinary.com/dbjaqbow6/image/upload/v1751207381/CPI-Logo_xm7na3.jpg";

// Lightweight image slider component
const AutoImageSlider = ({ images, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="relative w-full h-48 overflow-hidden">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Slide ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
        />
      ))}
    </div>
  );
};

const Home = () => {
  const businessSectors = [
    {
      title: "School Catering",
      description:
        "Providing high-quality catering services to educational institutions with a focus on nutrition and excellence.",
      icon: <School className="w-8 h-8 text-gray-700" />,
      images: [
        "https://res.cloudinary.com/dbjaqbow6/image/upload/v1753086686/El_Alsson_School-1_env1hi.jpg",
        "https://res.cloudinary.com/dbjaqbow6/image/upload/v1753086687/El_Alsson_School-2_k7vrir.jpg",
        "https://res.cloudinary.com/dbjaqbow6/image/upload/v1753089554/El_Alsson_School-3_jjdtyc.jpg",
        "https://res.cloudinary.com/dbjaqbow6/image/upload/v1753089556/El_Alsson_School-4_llmyfi.jpg",
      ],
    },
    {
      title: "Hawana Café",
      description:
        "A premium café experience offering exceptional coffee and dining in a sophisticated atmosphere.",
      icon: <Landmark className="w-8 h-8 text-gray-700" />,
      images: [
        "https://res.cloudinary.com/dbjaqbow6/image/upload/v1753086083/Hawana-Cafe-1_yocjgz.jpg",
        "https://res.cloudinary.com/dbjaqbow6/image/upload/v1753086084/Hawana-Cafe-2_ieosde.jpg",
        "https://res.cloudinary.com/dbjaqbow6/image/upload/v1753089759/Hawana-Cafe-4_kiv55i.jpg",
        "https://res.cloudinary.com/dbjaqbow6/image/upload/v1753089588/Hawana-Cafe-3_tsrykl.jpg",
      ],
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
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white py-16 min-h-[650px]">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 3, 8], fov: 45 }} shadows>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
            <Suspense fallback={null}>
              <Environment preset="city" />
              <Stars
                radius={100}
                depth={50}
                count={5000}
                factor={4}
                saturation={0}
                fade
              />
              <Sparkles
                count={100}
                scale={[10, 5, 10]}
                speed={0.5}
                size={1.2}
                color="gold"
              />
            </Suspense>
            <OrbitControls
              enableZoom={false}
              autoRotate
              autoRotateSpeed={0.7}
            />
          </Canvas>
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-start z-10 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
            {/* Left Text */}
            <AnimatedSection animationType="fadeInLeft" className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Building Your
                <span className="block text-gray-300">Investment Future</span>
              </h1>
              <AnimatedSection animationType="fadeInLeft" delay={300}>
                <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed">
                  Crystal Power Investments specializes in strategic property
                  investments across diverse business sectors, delivering
                  exceptional returns and sustainable growth.
                </p>
              </AnimatedSection>
              <AnimatedSection animationType="fadeInUp" delay={600}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/contact">
                    <Button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-semibold cursor-pointer transform hover:scale-105 transition-transform duration-200">
                      Get Started
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/careers">
                    <Button
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg font-semibold bg-transparent cursor-pointer transform hover:scale-105 transition-transform duration-200"
                    >
                      Join Our Team
                    </Button>
                  </Link>
                </div>
              </AnimatedSection>
            </AnimatedSection>

            {/* Right Logo */}
            <AnimatedSection
              animationType="fadeInRight"
              className="flex justify-center lg:justify-end"
            >
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 p-6 flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <img
                  src={cpiLogo}
                  alt="Crystal Power Investments"
                  className="w-64 h-64 object-cover rounded-full"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection
            animationType="fadeInUp"
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              About Crystal Power Investments
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are a leading property investment company with a proven track
              record of success across multiple business sectors, committed to
              delivering exceptional value to our clients.
            </p>
          </AnimatedSection>

          {/* Single Video Display */}
          <AnimatedSection
            animationType="scaleIn"
            className="flex justify-center mb-16"
          >
            <div className="w-full max-w-4xl">
              <div
                className="relative rounded-xl shadow-xl overflow-hidden bg-black transform hover:scale-105 transition-transform duration-500"
                style={{ paddingBottom: "56.25%" }}
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source
                    src="https://res.cloudinary.com/dbjaqbow6/video/upload/v1752760692/WhatsApp_Video_2025-07-17_at_16.07.59_1_bdqccq.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
              <AnimatedSection
                animationType="fadeInUp"
                delay={300}
                className="mt-4 text-center"
              >
                <h3 className="text-xl font-semibold text-gray-900">
                  Our Vision
                </h3>
                <p className="text-gray-600">
                  Transforming properties into profitable investments
                </p>
              </AnimatedSection>
            </div>
          </AnimatedSection>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <AnimatedSection
                key={index}
                animationType="fadeInUp"
                delay={index * 200}
                className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection
            animationType="fadeInUp"
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive investment solutions with a primary focus
              on property investments, while also managing strategic ventures in
              the food service industry.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Property Investment with Video */}
            <AnimatedSection
              animationType="fadeInLeft"
              className="order-2 lg:order-1"
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-700 text-white rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-500">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ height: "420px", width: "100%" }}
                >
                  <source
                    src="https://res.cloudinary.com/dbjaqbow6/video/upload/v1752760696/WhatsApp_Video_2025-07-17_at_16.07.57_ak5fmt.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
                <div className="p-8">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-6 transform hover:rotate-12 transition-transform duration-300">
                    <Building2 className="w-8 h-8 text-gray-900" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    Property Investment
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    Our core business focuses on strategic property investments
                    across Egypt's most promising markets. We identify
                    high-potential real estate opportunities and develop them
                    into profitable ventures that deliver sustainable returns
                    for our investors.
                  </p>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-center transform hover:translate-x-2 transition-transform duration-200">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      Residential and commercial property development
                    </li>
                    <li className="flex items-center transform hover:translate-x-2 transition-transform duration-200">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      Strategic location analysis and market research
                    </li>
                    <li className="flex items-center transform hover:translate-x-2 transition-transform duration-200">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      Portfolio management and optimization
                    </li>
                    <li className="flex items-center transform hover:translate-x-2 transition-transform duration-200">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      Long-term investment planning and growth strategies
                    </li>
                  </ul>
                </div>
              </div>
            </AnimatedSection>

            {/* School Catering with Video */}
            <AnimatedSection
              animationType="fadeInRight"
              className="order-1 lg:order-2"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 transform hover:scale-105 transition-transform duration-500">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ height: "420px", width: "100%" }}
                >
                  <source
                    src="https://res.cloudinary.com/dbjaqbow6/video/upload/v1752760696/WhatsApp_Video_2025-07-17_at_16.07.56_bftizl.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
                <div className="p-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-6 transform hover:rotate-12 transition-transform duration-300">
                    <Users className="w-8 h-8 text-gray-700" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    School Catering Services
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    Through our strategic partnerships, we provide high-quality
                    catering services to educational institutions, ensuring
                    nutritious meals and excellent service standards that
                    support student well-being and academic success.
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center transform hover:translate-x-2 transition-transform duration-200">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                      Nutritionally balanced meal programs
                    </li>
                    <li className="flex items-center transform hover:translate-x-2 transition-transform duration-200">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                      Quality food safety and hygiene standards
                    </li>
                    <li className="flex items-center transform hover:translate-x-2 transition-transform duration-200">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                      Customized menu planning and dietary accommodations
                    </li>
                    <li className="flex items-center transform hover:translate-x-2 transition-transform duration-200">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                      Efficient service delivery and management
                    </li>
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Business Sectors Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection
            animationType="fadeInUp"
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Business Sectors
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We operate across diverse sectors, leveraging our expertise to
              create value and drive growth in each market we enter.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {businessSectors.map((sector, index) => (
              <AnimatedSection
                key={index}
                animationType="scaleIn"
                delay={index * 300}
                className="bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 group"
              >
                {/* Auto-sliding images */}
                <div className="overflow-hidden">
                  <div className="transform group-hover:scale-110 transition-transform duration-700">
                    <AutoImageSlider images={sector.images} interval={5000} />
                  </div>
                </div>

                <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-700 text-white">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform duration-500">
                    <div className="text-white">{sector.icon}</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 transform group-hover:translate-x-2 transition-transform duration-300">
                    {sector.title}
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed transform group-hover:translate-x-2 transition-transform duration-300 delay-100">
                    {sector.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <AnimatedSection animationType="fadeInUp">
        <PartnersCarousel />
      </AnimatedSection>

      {/* Call to Action Section */}
      <AnimatedSection animationType="slideInUp">
        <section className="py-20 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedSection animationType="fadeInUp" className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Ready to Invest in Your Future?
              </h2>
              <AnimatedSection animationType="fadeInUp" delay={200}>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Join Crystal Power Investments and discover the potential of
                  strategic property investment. Let us help you build a
                  portfolio that delivers lasting value.
                </p>
              </AnimatedSection>
              <AnimatedSection animationType="fadeInUp" delay={400}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/contact">
                    <Button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-semibold cursor-pointer transform hover:scale-110 transition-all duration-300 hover:shadow-lg">
                      Contact Us Today
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/careers">
                    <Button
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg font-semibold bg-transparent cursor-pointer transform hover:scale-110 transition-all duration-300 hover:shadow-lg"
                    >
                      Explore Careers
                    </Button>
                  </Link>
                </div>
              </AnimatedSection>
            </AnimatedSection>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
};

export default Home;
