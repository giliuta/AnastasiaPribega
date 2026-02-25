import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/data/translations';
import { ArrowDown, ArrowRight } from 'lucide-react';

const HERO_VIDEO = 'https://customer-assets.emergentagent.com/job_47f6f644-e94f-410b-9ee0-18b3ab243391/artifacts/q9bjmbbj_IMG_7319.MP4';

const fadeUp = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
};

const stagger = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const BrowArchSVG = () => (
  <svg viewBox="0 0 600 60" className="w-full max-w-lg mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    <motion.path
      d="M0 50 C80 50, 120 8, 200 8 C280 8, 340 25, 400 25 C460 25, 520 35, 600 40"
      stroke="#A07E66"
      strokeWidth="1"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
    />
  </svg>
);

function HeroSection({ t }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden" data-testid="hero-section">
      <motion.div style={{ y }} className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          data-testid="hero-video"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <div className="hero-overlay absolute inset-0" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6"
      >
        <motion.p
          className="font-body text-xs uppercase tracking-[0.3em] text-white/60 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          {t.hero.appointment}
        </motion.p>

        <motion.h1
          className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-[0.08em] leading-[0.9]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          data-testid="hero-title"
        >
          {t.hero.brand}
        </motion.h1>

        <motion.p
          className="font-body text-xs sm:text-sm uppercase tracking-[0.25em] text-white/70 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          className="mt-8 w-24"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="h-[1px] bg-white/40 w-full" />
        </motion.div>

        <motion.p
          className="font-heading text-base sm:text-lg italic text-white/80 mt-6 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          {t.hero.tagline}
        </motion.p>

        <motion.p
          className="font-body text-xs tracking-[0.15em] text-white/50 mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          {t.hero.subtext}
        </motion.p>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <ArrowDown size={18} className="text-white/40" />
      </motion.div>
    </section>
  );
}

function ManifestoSection({ t }) {
  const lines = [t.manifesto.line1, t.manifesto.line2, '', t.manifesto.line3, t.manifesto.line4, t.manifesto.line5, '', t.manifesto.line6];

  return (
    <section className="px-6 md:px-12 lg:px-24 py-24 md:py-40" data-testid="manifesto-section">
      <div className="max-w-3xl mx-auto">
        {lines.map((line, i) => (
          line === '' ? (
            <div key={i} className="h-8 md:h-12" />
          ) : (
            <motion.p
              key={i}
              className={`font-heading ${i === lines.length - 1 ? 'text-base sm:text-lg md:text-lg font-normal mt-8' : 'text-base sm:text-lg md:text-lg font-light'} text-pribega-text leading-relaxed`}
              {...stagger}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {line}
            </motion.p>
          )
        ))}
      </div>

      <div className="mt-16 md:mt-24">
        <BrowArchSVG />
      </div>
    </section>
  );
}

function PrinciplesSection({ t }) {
  const items = [
    { num: '01', ...t.principles.precision },
    { num: '02', ...t.principles.balance },
    { num: '03', ...t.principles.elevation },
  ];

  return (
    <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32 bg-pribega-surface" data-testid="principles-section">
      <motion.p
        className="font-body text-xs uppercase tracking-[0.2em] text-pribega-text-secondary mb-16 md:mb-24"
        {...fadeUp}
      >
        {t.principles.title}
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        {items.map((item, i) => (
          <motion.div
            key={item.num}
            className="border-t border-pribega-border pt-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-body text-xs text-pribega-text-secondary tracking-wide">{item.num}</span>
            <h3 className="font-heading text-2xl md:text-3xl font-light text-pribega-text mt-4 mb-4">{item.title}</h3>
            <p className="font-body text-sm text-pribega-text-secondary leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ServicesPreview({ t }) {
  const previewServices = [
    ...t.services.brows.items.slice(0, 3),
    ...t.services.lashes.items.slice(0, 1),
  ];

  return (
    <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32" data-testid="services-preview-section">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        <div>
          <motion.p
            className="font-body text-xs uppercase tracking-[0.2em] text-pribega-text-secondary mb-4"
            {...fadeUp}
          >
            {t.servicesPreview.title}
          </motion.p>
          <motion.h2
            className="font-heading text-base md:text-lg font-light text-pribega-text"
            {...fadeUp}
          >
            {t.servicesPreview.subtitle}
          </motion.h2>
          <motion.div {...fadeUp} className="mt-8">
            <Link
              to="/services"
              className="font-body text-xs uppercase tracking-[0.2em] text-pribega-accent hover:text-pribega-text transition-colors inline-flex items-center gap-2"
              data-testid="services-view-all"
              data-cursor="hover"
            >
              {t.servicesPreview.viewAll}
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>

        <div>
          {previewServices.map((service, i) => (
            <motion.div
              key={i}
              className="service-item flex justify-between items-center py-5 border-b border-pribega-border"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <span className="font-body text-sm text-pribega-text">{service.name}</span>
              <span className="font-body text-sm text-pribega-text-secondary">{service.price}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ t }) {
  const images = [
    { src: 'https://images.pexels.com/photos/3762664/pexels-photo-3762664.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', span: 'md:col-span-7 md:row-span-2' },
    { src: 'https://images.unsplash.com/photo-1568918803912-933d961baa1a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTV8MHwxfHNlYXJjaHwyfHxtYWNybyUyMGV5ZWJyb3clMjBleWVsYXNoZXMlMjBsdXh1cnklMjBtYWtldXB8ZW58MHx8fHwxNzcyMDQzODQ4fDA&ixlib=rb-4.1.0&q=85', span: 'md:col-span-5' },
    { src: 'https://images.pexels.com/photos/8558522/pexels-photo-8558522.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', span: 'md:col-span-5' },
  ];

  return (
    <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32 bg-pribega-surface" data-testid="gallery-section">
      <motion.p
        className="font-body text-xs uppercase tracking-[0.2em] text-pribega-text-secondary mb-4"
        {...fadeUp}
      >
        {t.gallery.title}
      </motion.p>
      <motion.h2
        className="font-heading text-base md:text-lg font-light text-pribega-text mb-12 md:mb-16"
        {...fadeUp}
      >
        {t.gallery.subtitle}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        {images.map((img, i) => (
          <motion.div
            key={i}
            className={`${img.span} overflow-hidden`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.8 }}
          >
            <img
              src={img.src}
              alt="PRIBEGA portfolio"
              className="gallery-img w-full h-64 md:h-full object-cover"
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function AcademyPreview({ t }) {
  return (
    <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32" data-testid="academy-preview-section">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        <motion.div {...fadeUp}>
          <p className="font-body text-xs uppercase tracking-[0.2em] text-pribega-text-secondary mb-4">Academy</p>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-pribega-text leading-[0.9]">
            {t.academy.title}
          </h2>
          <p className="font-body text-sm text-pribega-text-secondary mt-6 leading-relaxed max-w-md">
            {t.academy.preview}
          </p>
          <Link
            to="/academy"
            className="inline-block mt-8 font-body text-xs uppercase tracking-[0.2em] text-pribega-text border-b border-pribega-text pb-1 hover:text-pribega-accent hover:border-pribega-accent transition-colors"
            data-testid="academy-preview-link"
            data-cursor="hover"
          >
            {t.academy.apply}
          </Link>
        </motion.div>

        <motion.div
          className="overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src="https://images.unsplash.com/photo-1518892974594-4adbf359419c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwzfHxtaW5pbWFsaXN0JTIwYmVpZ2UlMjBhcmNoaXRlY3R1cmFsJTIwaW50ZXJpb3IlMjBzdG9uZSUyMHRleHR1cmV8ZW58MHx8fHwxNzcyMDQzODQ5fDA&ixlib=rb-4.1.0&q=85"
            alt="PRIBEGA Academy"
            className="w-full h-80 md:h-[500px] object-cover"
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  );
}

function CTASection({ t }) {
  return (
    <section className="px-6 md:px-12 lg:px-24 py-24 md:py-40 text-center" data-testid="cta-section">
      <BrowArchSVG />

      <motion.h2
        className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-pribega-text mt-12 leading-[0.9]"
        {...fadeUp}
      >
        {t.cta.title}
      </motion.h2>

      <motion.p
        className="font-body text-sm text-pribega-text-secondary mt-6 tracking-wide"
        {...fadeUp}
      >
        {t.cta.subtitle}
      </motion.p>

      <motion.div {...fadeUp} className="mt-10">
        <Link
          to="/contact"
          className="inline-block bg-pribega-text text-pribega-bg px-10 py-4 font-body text-xs uppercase tracking-[0.2em] hover:bg-pribega-accent transition-colors duration-300"
          data-testid="cta-book-button"
          data-cursor="hover"
        >
          {t.cta.button}
        </Link>
      </motion.div>
    </section>
  );
}

export default function HomePage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <div data-testid="home-page">
      <HeroSection t={t} />
      <ManifestoSection t={t} />
      <PrinciplesSection t={t} />
      <ServicesPreview t={t} />
      <GallerySection t={t} />
      <AcademyPreview t={t} />
      <CTASection t={t} />
    </div>
  );
}
