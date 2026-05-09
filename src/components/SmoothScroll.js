"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Lenis removed — caused double-instance leak in React Strict Mode.
// GSAP ScrollTrigger + native scroll works correctly without it.
export default function SmoothScroll() {
  useEffect(() => {
    gsap.ticker.lagSmoothing(0);
  }, []);

  return null;
}
