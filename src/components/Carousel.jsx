import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TMGLogo from "../assets/TMG-Logo.png";
import NawyLogo from "../assets/Nawy.png";

const PartnersCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const partners = [
    {
      id: 1,
      name: "Tala'at Mostafa Group",
      logo: TMGLogo,
      description:
        "Egypt's premier real estate developer with iconic projects like Madinaty and Al Rehab.",
      projects: ["Madinaty", "Al Rehab", "Taj City"],
      since: 2018,
    },
    {
      id: 2,
      name: "Nawy",
      logo: NawyLogo,
      description:
        "Nawy is a fully integrated platform delivering a seamless real estate experience for buyers, sellers, and investors.",
      projects: ["El Gouna", "O West"],
      since: 2020,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % partners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [partners.length]);

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % partners.length);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + partners.length) % partners.length);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {" "}
      {/* Added overflow-hidden */}
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Our Partners</h2>

        {/* Constrained container with overflow control */}
        <div className="relative h-[500px] w-full overflow-x-hidden">
          {" "}
          {/* Added overflow-x-hidden */}
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 z-30 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          {/* Carousel Cards Container */}
          <div className="relative h-full w-full mx-auto max-w-3xl">
            {" "}
            {/* Added max-width constraint */}
            {partners.map((partner, index) => {
              let position, zIndex, scale, opacity;

              if (index === currentIndex) {
                position = "translate-x-0";
                zIndex = "z-20";
                scale = "scale-100";
                opacity = "opacity-100";
              } else if (index === (currentIndex + 1) % partners.length) {
                position = "translate-x-1/4";
                zIndex = "z-10";
                scale = "scale-95";
                opacity = "opacity-80";
              } else if (
                index ===
                (currentIndex - 1 + partners.length) % partners.length
              ) {
                position = "-translate-x-1/4";
                zIndex = "z-10";
                scale = "scale-95";
                opacity = "opacity-80";
              } else {
                position = "translate-x-0";
                zIndex = "z-0";
                scale = "scale-90";
                opacity = "opacity-0";
              }

              return (
                <div
                  key={partner.id}
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${position} ${zIndex} ${scale} ${opacity}`}
                >
                  <div className="h-full bg-white rounded-xl shadow-lg p-8 flex flex-col mx-4">
                    {" "}
                    {/* Added horizontal margin */}
                    <div className="h-32 flex items-center justify-center mb-4">
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="max-h-full max-w-[200px] object-contain"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-center">
                      {partner.name}
                    </h3>
                    <p className="text-gray-600 text-center mt-2">
                      {partner.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                      {partner.projects.map((project, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {project}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto text-sm text-gray-500 text-center">
                      Partner since {partner.since}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 z-30 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PartnersCarousel;
