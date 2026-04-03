'use client';

import { useEffect, useRef } from 'react';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimateOnScroll({
  children,
  className = '',
  delay = 0,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Use rAF so layout is computed and positions are accurate
    const raf = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const inViewport = rect.top < window.innerHeight && rect.bottom > 0;

      if (inViewport) {
        // Already on screen (initial load or navigated back) — reveal without hiding first
        setTimeout(() => {
          el.classList.remove('scroll-reveal');
          el.classList.add('is-visible-instant');
        }, delay);
        return;
      }

      // Below fold — hide and animate in when scrolled to
      el.classList.add('scroll-reveal');

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              el.classList.add('is-visible');
            }, delay);
            observer.unobserve(el);
          }
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );

      observer.observe(el);
      return () => observer.unobserve(el);
    });

    return () => cancelAnimationFrame(raf);
  }, [delay]);

  // Don't add scroll-reveal in JSX — only add it in JS for below-fold elements
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
