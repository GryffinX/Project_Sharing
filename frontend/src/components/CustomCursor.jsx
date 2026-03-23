import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs for the outer ring (slower, floating effect)
  const springX = useSpring(cursorX, { damping: 25, stiffness: 120, mass: 0.5 });
  const springY = useSpring(cursorY, { damping: 25, stiffness: 120, mass: 0.5 });

  // Faster springs for the inner dot
  const dotSpringX = useSpring(cursorX, { damping: 30, stiffness: 400, mass: 0.1 });
  const dotSpringY = useSpring(cursorY, { damping: 30, stiffness: 400, mass: 0.1 });

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleHover = (e) => {
      const target = e.target;
      const isClickable = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.card-interactive') ||
        target.closest('.ws-project-card') ||
        target.closest('.card-v5');

      setIsHovering(!!isClickable);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleHover);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleHover);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  return (
    <>
      {/* The main outer ring */}
      <motion.div
        className="cursor-ring"
        style={{
          x: springX,
          y: springY,
          scale: isHovering ? 1.5 : 1,
          opacity: isVisible ? 1 : 0,
          borderColor: isHovering ? 'transparent' : 'rgba(255, 255, 255, 0.4)',
          background: isHovering ? 'var(--accent-glow)' : 'transparent',
          backdropFilter: isHovering ? 'blur(2px)' : 'none',
        }}
      />
      {/* The focus inner dot */}
      <motion.div
        className="cursor-dot"
        style={{
          x: dotSpringX,
          y: dotSpringY,
          opacity: isVisible ? 1 : 0,
          scale: isHovering ? 0 : 1,
        }}
      />
      <style>{`
        body {
          cursor: none;
        }
        a, button, input, textarea, select, .ws-project-card, .card-v5, .nav-brand {
          cursor: none !important;
        }
        .cursor-ring {
          position: fixed;
          top: 0;
          left: 0;
          width: 40px;
          height: 40px;
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transition: scale 0.2s ease, border-color 0.2s ease, background 0.2s ease, backdrop-filter 0.2s ease, opacity 0.3s ease;
          box-sizing: border-box;
          transform: translate(-50%, -50%);
        }
        .cursor-dot {
          position: fixed;
          top: 0;
          left: 0;
          width: 8px;
          height: 8px;
          background: var(--accent-primary);
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          box-shadow: 0 0 10px var(--accent-primary);
          transition: scale 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
          transform: translate(-50%, -50%);
        }
        @media (max-width: 768px) {
          .cursor-ring, .cursor-dot { display: none !important; }
          body, a, button, input, textarea, select, .ws-project-card, .card-v5, .nav-brand {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  );
}
