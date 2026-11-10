
"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function GoToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Go to top"
      title="Go to top"
      className={`
        fixed
        bottom-24
        right-6
        z-50
        p-4
        rounded-full
        bg-[#5921c7]
        hover:bg-[#8c52ff]
        text-white
        shadow-lg
        transition-all
        duration-300
        transform
        hover:scale-110
        ${
          visible
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }
      `}
    >
      <ArrowUp size={24} />
    </button>
  );
}
