"use client";

import React, { useEffect, useRef, useState } from "react";
import { ShoppingCart, Package, Shield, Award } from "lucide-react";

interface Stat {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  color: string;
  bg: string;
}

const stats: Stat[] = [
  { icon: ShoppingCart, value: 5000, suffix: "+", label: "Đơn Hàng Thành Công", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: Package, value: 500, suffix: "+", label: "Sản Phẩm Chính Hãng", color: "text-amber-600", bg: "bg-amber-50" },
  { icon: Shield, value: 10, suffix: " Năm", label: "Kinh Nghiệm", color: "text-emerald-600", bg: "bg-emerald-50" },
  { icon: Award, value: 99, suffix: "%", label: "Khách Hàng Hài Lòng", color: "text-purple-600", bg: "bg-purple-50" },
];

const CountUpNumber: React.FC<{ target: number; suffix: string; active: boolean }> = ({ target, suffix, active }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [active, target]);

  return <span>{count.toLocaleString("vi-VN")}{suffix}</span>;
};

export const HomeStats: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className={`text-2xl sm:text-3xl font-black ${stat.color} leading-none`}>
                <CountUpNumber target={stat.value} suffix={stat.suffix} active={active} />
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-1.5 leading-tight">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HomeStats;
