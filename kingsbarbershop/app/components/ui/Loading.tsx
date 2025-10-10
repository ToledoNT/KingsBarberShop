"use client";

import { LoadingProps } from "@/app/interfaces/loginInterface";
import React from "react";

const Loading: React.FC<LoadingProps> = ({ size = 6, text = "Carregando..." }) => {
  const dimension = `${size}rem`; 
  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full h-full">
      <div
        className="border-4 border-t-transparent border-white rounded-full animate-spin"
        style={{ width: dimension, height: dimension }}
      />
      {text && <span className="text-white text-sm sm:text-base">{text}</span>}
    </div>
  );
};

export default Loading;