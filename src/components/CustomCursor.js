"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const xSetter = gsap.quickSetter(dot, "x", "px");
    const ySetter = gsap.quickSetter(dot, "y", "px");

    const onMouseMove = (e) => {
      xSetter(e.clientX);
      ySetter(e.clientY);
      gsap.to(ring, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.45,
        ease: "power3.out",
        overwrite: true,
      });
    };

    const onEnter = (e) => {
      if (e.currentTarget.dataset.cursorTarget !== undefined) {
        document.body.classList.add("cursor-target");
      } else {
        document.body.classList.add("cursor-expand");
      }
    };

    const onLeave = () => {
      document.body.classList.remove("cursor-expand", "cursor-target");
    };

    document.addEventListener("mousemove", onMouseMove);

    const addListeners = () => {
      document.querySelectorAll("a, button").forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
      document.querySelectorAll("[data-cursor-target]").forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };

    addListeners();

    // Re-attach on DOM mutations (dynamic content)
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="v6-cursor" style={{ left: 0, top: 0 }} />
      <div ref={ringRef} className="v6-cursor-ring" style={{ left: 0, top: 0 }} />
    </>
  );
}
