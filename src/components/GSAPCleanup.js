"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function GSAPCleanup() {
  const pathname = usePathname();

  useEffect(() => {
    return () => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().forEach(t => t.kill());
      }).catch(() => {});
    };
  }, [pathname]);

  return null;
}
