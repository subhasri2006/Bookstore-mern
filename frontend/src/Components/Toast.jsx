import { useEffect } from "react";

export default function Toast({ message, show, setShow, type = "success" }) {

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

  return (
  <>
    <div style={{
      position: "fixed",
      top: "40px", // 🔥 slightly more spacing
      right: "0",
      zIndex: 9999,
      transform: "skewX(-20deg)",
      background: type === "success" ? "#a5d6a7" : "#ef9a9a",
      padding: "40px 100px",   // 🔥 BIGGER parallelogram
      boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
      animation: "slideInRight 0.5s ease forwards"
    }}>
      <div style={{
        transform: "skewX(20deg)",
        color: type === "success" ? "#1b5e20" : "#b71c1c",
        fontSize: "30px",      // 🔥 bigger text
        fontWeight: "bold"
      }}>
        {message}
      </div>
    </div>

    <style>
      {`
        @keyframes slideInRight {
          from {
            transform: translateX(100%) skewX(-20deg);
            opacity: 0;
          }
          to {
            transform: translateX(0) skewX(-20deg);
            opacity: 1;
          }
        }
      `}
    </style>
  </>
);
}