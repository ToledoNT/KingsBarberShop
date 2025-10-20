// app/components/ui/Loader.tsx
"use client";

import React from "react";

interface LoaderProps {
  fullScreen?: boolean; 
  color?: string;       
  size?: number;        
}

const Loader: React.FC<LoaderProps> = ({ fullScreen = false, color = "#FFA500", size = 48 }) => {
  const containerClass = fullScreen
    ? "flex items-center justify-center min-h-screen bg-[#0D0D0D] text-[#E5E5E5]"
    : "flex items-center justify-center";

  return (
    <div className={containerClass}>
      <div
        className="animate-spin rounded-full border-t-2 border-b-2 border-solid"
        style={{
          width: size,
          height: size,
          borderColor: `${color} transparent transparent transparent`,
        }}
      ></div>
    </div>
  );
};

export default Loader;