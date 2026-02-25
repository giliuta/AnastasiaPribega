import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Preloader({ onComplete }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const seen = sessionStorage.getItem('pribega-loaded');
    if (seen) {
      onComplete();
      return;
    }
    setTimeout(() => setPhase(1), 200);
    setTimeout(() => setPhase(2), 1600);
    setTimeout(() => setPhase(3), 2400);
    setTimeout(() => {
      setPhase(4);
      sessionStorage.setItem('pribega-loaded', '1');
      setTimeout(onComplete, 800);
    }, 3200);
  }, [onComplete]);

  const seen = sessionStorage.getItem('pribega-loaded');
  if (seen) return null;

  const letters = 'PRIBEGA'.split('');

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-pribega-bg flex flex-col items-center justify-center"
      animate={phase >= 4 ? { y: '-100vh' } : {}}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      data-testid="preloader"
    >
      <div className="relative">
        {/* Letters */}
        <div className="flex overflow-hidden">
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-pribega-text tracking-[0.2em] inline-block"
              initial={{ y: 120, opacity: 0 }}
              animate={phase >= 1 ? { y: 0, opacity: 1 } : {}}
              transition={{
                delay: i * 0.07,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          className="font-body text-xs uppercase tracking-[0.3em] text-pribega-text-secondary text-center mt-4"
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          The Standard of Beauty
        </motion.p>

        {/* Brow arch line */}
        <motion.div className="mt-8 flex justify-center">
          <svg viewBox="0 0 300 30" className="w-48" fill="none">
            <motion.path
              d="M0 25 C40 25, 60 4, 100 4 C140 4, 170 12, 200 12 C230 12, 260 18, 300 20"
              stroke="#A07E66"
              strokeWidth="1"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={phase >= 3 ? { pathLength: 1 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Progress line */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 w-24 h-[1px] bg-pribega-border overflow-hidden"
      >
        <motion.div
          className="h-full bg-pribega-accent"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 3, ease: 'linear' }}
        />
      </motion.div>
    </motion.div>
  );
}
