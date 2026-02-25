import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) return;

    const cursor = cursorRef.current;
    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;

    const move = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) setVisible(true);
    };

    const handleOver = (e) => {
      const tag = e.target.tagName.toLowerCase();
      const isInteractive = tag === 'a' || tag === 'button' || tag === 'input' ||
        tag === 'textarea' || tag === 'select' ||
        e.target.closest('[role="button"]') || e.target.closest('[data-cursor="hover"]');
      setHovering(isInteractive);
    };

    const handleLeave = () => {
      setVisible(false);
    };

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      if (cursor) {
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
      }
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mouseenter', () => setVisible(true));
    animate();

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, [visible]);

  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
  if (isMobile) return null;

  return (
    <div
      ref={cursorRef}
      className={`pribega-cursor ${hovering ? 'hovering' : ''} ${!visible ? 'hidden' : ''}`}
      data-testid="custom-cursor"
    />
  );
}
