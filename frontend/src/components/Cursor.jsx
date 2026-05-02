import React, { useEffect, useState } from "react";

export default function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const enter = (e) => {
      if (e.target.closest("a, button, [data-cursor='hover'], input, textarea")) {
        setActive(true);
      }
    };
    const leave = () => setActive(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", enter);
    window.addEventListener("mouseout", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", enter);
      window.removeEventListener("mouseout", leave);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" style={{ transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%,-50%)` }} />
      <div className={`cursor-ring ${active ? "active" : ""}`} style={{ transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%,-50%)` }} />
    </>
  );
}
