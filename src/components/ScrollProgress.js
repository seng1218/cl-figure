"use client";
import { useScroll, useSpring, motion } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{
        scaleX,
        transformOrigin: "0%",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: "linear-gradient(90deg, #2563eb 0%, #60a5fa 60%, #fff 100%)",
        boxShadow: "0 0 14px rgba(37,99,235,0.7)",
        zIndex: 200,
        pointerEvents: "none",
      }}
    />
  );
}
