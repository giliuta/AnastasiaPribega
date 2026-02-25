import { motion } from 'framer-motion';

export function TextReveal({ text, className = '', as = 'p', delay = 0 }) {
  const words = text.split(' ');
  const Tag = as;

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', rotate: 3 }}
            whileInView={{ y: '0%', rotate: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{
              delay: delay + i * 0.04,
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

export function LineReveal({ children, className = '', delay = 0 }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '100%' }}
        whileInView={{ y: '0%' }}
        viewport={{ once: true }}
        transition={{
          delay,
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function LetterReveal({ text, className = '', delay = 0 }) {
  const letters = text.split('');

  return (
    <span className={className}>
      {letters.map((letter, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: '120%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: delay + i * 0.03,
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
