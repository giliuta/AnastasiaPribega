import { motion } from 'framer-motion';

export default function ImageReveal({
  src,
  alt = '',
  className = '',
  direction = 'left',
  delay = 0,
}) {
  const clipFrom = {
    left: 'inset(0 100% 0 0)',
    right: 'inset(0 0 0 100%)',
    top: 'inset(0 0 100% 0)',
    bottom: 'inset(100% 0 0 0)',
  };

  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial={{ clipPath: clipFrom[direction] }}
      whileInView={{ clipPath: 'inset(0 0 0 0)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        delay,
        duration: 1.2,
        ease: [0.76, 0, 0.24, 1],
      }}
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
        initial={{ scale: 1.3 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{
          delay: delay + 0.1,
          duration: 1.8,
          ease: [0.16, 1, 0.3, 1],
        }}
      />
    </motion.div>
  );
}
