"use client";

import { useState, useEffect } from "react";
import { Phone, ArrowUp } from "lucide-react";
import { usePathname } from "next/navigation";

export function FloatingElements() {
  const [showScroll, setShowScroll] = useState(false);
  const pathname = usePathname();

  // Handle Scroll to Top Button
  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (pathname?.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Zalo / Call CSKH */}
      <a 
        href="tel:0567810709" 
        className="w-12 h-12 bg-[#EF4444] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 hover:scale-110 transition-all duration-300 relative group"
      >
        <Phone className="h-5 w-5 animate-wiggle" />
        <span className="absolute inset-0 bg-[#EF4444] rounded-full animate-ping opacity-75" />
        
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Gọi CSKH 0567810709
        </span>
      </a>

      {/* Scroll To Top */}
      <button
        onClick={scrollToTop}
        className={`w-12 h-12 bg-white text-gray-600 border border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 hover:text-gray-900 transition-all duration-300 ${
          showScroll ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
}
