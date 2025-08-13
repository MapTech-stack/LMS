import React, { useState, useEffect } from "react";

const Loading = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.addEventListener("load", () => {
      setTimeout(() => setLoading(false), 800); // smoother delay
    });

    return () => window.removeEventListener("load", () => {});
  }, []);

  const colors = ["#ef4444", "#3b82f6", "#facc15", "#8b5cf6"]; // Tailwind red, blue, yellow, purple

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="relative w-32 h-32">
        {colors.map((color, i) => (
          <div
            key={i}
            className="absolute w-10 h-10 rounded-md shadow-lg"
            style={{
              backgroundColor: loading ? color : "#22c55e", // green after load
              animation: `orbit 1.8s linear infinite`,
              animationDelay: `${i * 0.45}s`,
              transformOrigin: "50px 50px", // closer center
              transition: "background-color 0.6s ease",
            }}
          />
        ))}
      </div>

      {/* Keyframes */}
      <style>
        {`
          @keyframes orbit {
            0% { transform: rotate(0deg) translateX(50px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(50px) rotate(-360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Loading;
