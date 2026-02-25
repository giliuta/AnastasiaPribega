import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ImageReveal from './ImageReveal';

const GALLERY_IMAGES = [
  {
    src: 'https://images.pexels.com/photos/3762664/pexels-photo-3762664.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Brow detail',
    height: 'h-[400px] md:h-[550px]',
  },
  {
    src: 'https://customer-assets.emergentagent.com/job_47f6f644-e94f-410b-9ee0-18b3ab243391/artifacts/8sxwltdz_photo_2026-02-25_19-22-30.jpg',
    alt: 'Anastasia Pribega',
    height: 'h-[450px] md:h-[600px]',
  },
  {
    src: 'https://images.unsplash.com/photo-1568918803912-933d961baa1a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTV8MHwxfHNlYXJjaHwyfHxtYWNybyUyMGV5ZWJyb3clMjBleWVsYXNoZXMlMjBsdXh1cnklMjBtYWtldXB8ZW58MHx8fHwxNzcyMDQzODQ4fDA&ixlib=rb-4.1.0&q=85',
    alt: 'Beauty macro',
    height: 'h-[380px] md:h-[500px]',
  },
  {
    src: 'https://images.pexels.com/photos/8558522/pexels-photo-8558522.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Lash design',
    height: 'h-[420px] md:h-[560px]',
  },
  {
    src: 'https://images.pexels.com/photos/5128277/pexels-photo-5128277.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Brow shaping process',
    height: 'h-[400px] md:h-[520px]',
  },
];

export default function HorizontalGallery({ title, subtitle }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['5%', '-45%']);

  return (
    <section ref={containerRef} className="py-16 md:py-24 overflow-hidden" data-testid="horizontal-gallery">
      <div className="px-6 md:px-12 lg:px-24 mb-12">
        <motion.p
          className="font-body text-xs uppercase tracking-[0.2em] text-pribega-text-secondary mb-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {title}
        </motion.p>
        <motion.p
          className="font-heading text-base md:text-lg font-light text-pribega-text"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {subtitle}
        </motion.p>
      </div>

      <motion.div
        style={{ x }}
        className="flex gap-6 md:gap-8 pl-6 md:pl-12 lg:pl-24"
      >
        {GALLERY_IMAGES.map((img, i) => (
          <div
            key={i}
            className={`shrink-0 w-[300px] md:w-[400px] lg:w-[450px] ${img.height}`}
          >
            <ImageReveal
              src={img.src}
              alt={img.alt}
              className="w-full h-full"
              direction={i % 2 === 0 ? 'bottom' : 'left'}
              delay={i * 0.1}
            />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
