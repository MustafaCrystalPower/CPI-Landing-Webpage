import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      // Fallback for browsers that ignore unknown behavior values
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
    }
  }, [location.pathname]);

  return null;
};

export default ScrollToTop;
