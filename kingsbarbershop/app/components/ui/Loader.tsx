"use client";

import React, { memo } from "react";

interface LoaderProps {
  fullScreen?: boolean;  
  color?: string;       
  size?: number;        
  thickness?: number;   
}

const Loader: React.FC<LoaderProps> = memo(({
  fullScreen = false,
  color = "#FFA500",
  size = 48,
  thickness = 2,
}) => {
  const containerClass = fullScreen
    ? "flex items-center justify-center min-h-screen bg-[#0D0D0D] text-[#E5E5E5]"
    : "flex items-center justify-center";

  return (
    <div className={containerClass}>
      <div
        className="animate-spin rounded-full border-solid"
        style={{
          width: size,
          height: size,
          borderWidth: thickness,
          borderColor: `${color} transparent transparent transparent`,
        }}
      />
    </div>
  );
});

export default Loader;