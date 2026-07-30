"use client";

import React from "react";

export interface SuspenseLoaderProps {
  height?: string | number;
  className?: string;
}

export const SuspenseLoader: React.FC<SuspenseLoaderProps> = ({
  height = "300px",
  className = "",
}) => {
  return (
    <div
      className={`w-full flex items-center justify-center bg-slate-50/50 rounded-2xl border border-slate-200/60 p-6 ${className}`}
      style={{ height: typeof height === "number" ? `${height}px` : height }}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin shadow-sm" />
        <span className="text-xs font-semibold text-slate-400 animate-pulse">
          Đang tải dữ liệu...
        </span>
      </div>
    </div>
  );
};

export default SuspenseLoader;
