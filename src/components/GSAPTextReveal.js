"use client";
import { useEffect, useRef } from 'react';

export default function GSAPTextReveal({ text, className, tag: Tag = 'h2' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ctx;

    (async () => {
      try {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          const wordInners = ref.current.querySelectorAll('.gsap-word-inner');
          if (!wordInners.length) return;

          gsap.fromTo(
            wordInners,
            { y: '110%', opacity: 0 },
            {
              y: '0%',
              opacity: 1,
              duration: 0.65,
              stagger: 0.055,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: ref.current,
                start: 'top 85%',
                once: true,
              },
            }
          );
        }, ref);
      } catch (err) {
        console.error('GSAPTextReveal init failed:', err);
      }
    })();

    return () => ctx?.revert();
  }, []);

  const words = text.split(' ');

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="gsap-word-wrap"
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', marginRight: i < words.length - 1 ? '0.25em' : 0 }}
        >
          <span className="gsap-word-inner" style={{ display: 'inline-block' }}>
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
}
