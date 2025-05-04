"use client";

import React, { useEffect, useState } from "react";

const LoadingState: React.FC = () => {
  const [dotCount, setDotCount] = useState<number>(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prevCount) => (prevCount % 3) + 1);
    }, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-neutral-900 overflow-hidden transition-all duration-500">
      <div className="absolute inset-0 pointer-events-none">
        <div className="blob top-12 left-12 bg-blue-700/20"></div>
        <div className="blob top-10 right-[20%] bg-purple-700/20"></div>
        <div className="blob top-[30%] left-1/3 bg-pink-700/20"></div>
      </div>
      <div className="relative flex items-center justify-center mb-14">
        <div className="absolute w-20 h-20 border-4 border-neutral-700 border-t-white rounded-full animate-spin"></div>
        <div className="absolute w-12 h-12 border-4 border-neutral-600 border-t-white rounded-full animate-spin"></div>
      </div>
      <p className="text-lg font-semibold text-neutral-300">
        Preparing everything for you{".".repeat(dotCount)}
      </p>
    </div>
  );
};

export default LoadingState;
