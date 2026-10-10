import React, { useEffect, useRef, useState } from 'react';

/**
 * Universal Scroll Reveal Engine Hook
 * Automatically observes elements marked with:
 * - [data-reveal]
 * - .scroll-reveal
 * - .reveal-group (staggers children sequentially)
 * - .bubble-glass (reveals card as bubble emerges)
 */
export function useScrollRevealEngine(dependencies: any[] = []) {
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    let observer: IntersectionObserver | null = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            // Unobserve once revealed to free CPU/GPU resources
            observer?.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '120px 0px 80px 0px',
        threshold: 0,
      }
    );

    const setupObserver = () => {
      const candidateSelectors = [
        '.scroll-reveal',
        '[data-reveal]',
        '.reveal-group',
      ];

      const elements = document.querySelectorAll<HTMLElement>(candidateSelectors.join(', '));
      const vh = window.innerHeight;

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < vh + 120 && rect.bottom > -120) {
          el.classList.add('is-revealed');
        } else {
          observer?.observe(el);
        }

        if (el.classList.contains('reveal-group') || el.hasAttribute('data-stagger-children')) {
          const children = el.children;
          for (let i = 0; i < children.length; i++) {
            const child = children[i] as HTMLElement;
            if (!child.style.getPropertyValue('--reveal-idx')) {
              child.style.setProperty('--reveal-idx', String(i));
            }
            child.classList.add('reveal-item');
          }
        }
      });
    };

    const timeoutId = setTimeout(setupObserver, 60);

    return () => {
      clearTimeout(timeoutId);
      observer?.disconnect();
    };
  }, dependencies);
}

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'scale' | 'fade';
  staggerChildren?: boolean;
  as?: React.ElementType;
}

/**
 * ScrollReveal Wrapper Component
 * Makes content appear sequentially one-by-one as the user scrolls down,
 * like it wasn't there until scrolled into view.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  staggerChildren = false,
  as: Component = 'div',
}) => {
  const ref = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(el);
        }
      },
      {
        threshold: 0,
        rootMargin: '120px 0px 80px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Component
      ref={ref}
      data-reveal="true"
      style={{
        transitionDelay: delay ? `${delay}ms` : undefined,
      }}
      className={`scroll-reveal ${isRevealed ? 'is-revealed' : ''} ${
        staggerChildren ? 'reveal-group' : ''
      } ${className}`}
    >
      {children}
    </Component>
  );
};

/**
 * Splits text into individual lines or words that reveal one by one sequentially
 */
export const StaggerText: React.FC<{
  text: string;
  as?: React.ElementType;
  className?: string;
  wordClassName?: string;
  baseDelay?: number;
}> = ({ text, as: Component = 'p', className = '', wordClassName = '', baseDelay = 40 }) => {
  const ref = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(' ');

  return (
    <Component ref={ref} className={`stagger-text-container ${className}`}>
      {words.map((word, i) => (
        <span
          key={i}
          className={`inline-block transition-all duration-700 ease-out ${wordClassName} ${
            isRevealed
              ? 'opacity-100 translate-y-0 filter-none'
              : 'opacity-0 translate-y-4 blur-[4px]'
          }`}
          style={{
            transitionDelay: `${i * baseDelay}ms`,
            marginRight: '0.28em',
          }}
        >
          {word}
        </span>
      ))}
    </Component>
  );
};
