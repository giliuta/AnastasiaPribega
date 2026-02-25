import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/data/translations';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { TextReveal, LineReveal } from '@/components/TextReveal';
import ImageReveal from '@/components/ImageReveal';
import MagneticButton from '@/components/MagneticButton';
import Marquee from '@/components/Marquee';
import HorizontalGallery from '@/components/HorizontalGallery';

const HERO_VIDEO = 'https://customer-assets.emergentagent.com/job_47f6f644-e94f-410b-9ee0-18b3ab243391/artifacts/q9bjmbbj_IMG_7319.MP4';
const FOUNDER_PHOTO = 'https://customer-assets.emergentagent.com/job_47f6f644-e94f-410b-9ee0-18b3ab243391/artifacts/8sxwltdz_photo_2026-02-25_19-22-30.jpg';

const BrowArchSVG = ({ className = '' }) => (
  <svg viewBox="0 0 600 60" className={`w-full max-w-lg mx-auto ${className}`} fill="none">
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

/* ==========================================
   COUNTER COMPONENT
   ========================================== */
function Counter({ target, suffix = '', duration = 2 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = parseInt(target);
    const step = Math.max(1, Math.floor(end / (duration * 60)));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={ref} className="counter-number">{count}{suffix}</span>;
}

/* ==========================================
   HERO SECTION
   ========================================== */
function HeroSection({ t }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden" data-testid="hero-section">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover" data-testid="hero-video">
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <div className="hero-overlay absolute inset-0" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
        <motion.p
          className="font-body text-[10px] sm:text-xs uppercase tracking-[0.35em] text-white/50 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          {t.hero.appointment}
        </motion.p>

        <div className="overflow-hidden">
          <motion.h1
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-[0.12em] leading-[0.9]"
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            data-testid="hero-title"
          >
            PRIBEGA
          </motion.h1>
        </div>

        <motion.div
          className="flex items-center gap-4 mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <div className="w-8 h-[1px] bg-white/30" />
          <p className="font-body text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white/60">
            {t.hero.subtitle}
          </p>
          <div className="w-8 h-[1px] bg-white/30" />
        </motion.div>

        <motion.p
          className="font-heading text-sm sm:text-base italic text-white/70 mt-8 max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 1 }}
        >
          {t.hero.tagline}
        </motion.p>

        <motion.p
          className="font-body text-[10px] tracking-[0.2em] text-white/40 mt-3 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
        >
          {t.hero.subtext}
        </motion.p>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <ArrowDown size={16} className="text-white/30" />
      </motion.div>
    </section>
  );
}

/* ==========================================
   MANIFESTO SECTION
   ========================================== */
function ManifestoSection({ t }) {
  return (
    <section className="px-6 md:px-12 lg:px-24 py-28 md:py-44" data-testid="manifesto-section">
      <div className="max-w-4xl mx-auto lg:ml-[15%]">
        <TextReveal
          text={t.manifesto.line1}
          className="font-heading text-2xl sm:text-3xl md:text-4xl font-light text-pribega-text leading-snug"
          as="p"
        />
        <TextReveal
          text={t.manifesto.line2}
          className="font-heading text-2xl sm:text-3xl md:text-4xl font-light text-pribega-text leading-snug mt-1"
          as="p"
          delay={0.15}
        />

        <div className="h-12 md:h-16" />

        <TextReveal
          text={t.manifesto.line3}
          className="font-heading text-base md:text-lg font-light text-pribega-text-secondary leading-relaxed"
          as="p"
          delay={0.2}
        />
        <TextReveal
          text={t.manifesto.line4}
          className="font-heading text-base md:text-lg font-light text-pribega-text-secondary leading-relaxed mt-1"
          as="p"
          delay={0.25}
        />
        <TextReveal
          text={t.manifesto.line5}
          className="font-heading text-base md:text-lg font-light text-pribega-text-secondary leading-relaxed mt-1"
          as="p"
          delay={0.3}
        />

        <div className="h-12 md:h-16" />

        <LineReveal delay={0.35}>
          <p className="font-heading text-base md:text-lg font-normal text-pribega-accent italic">
            {t.manifesto.line6}
          </p>
        </LineReveal>
      </div>

      <div className="mt-20 md:mt-28">
        <BrowArchSVG />
      </div>
    </section>
  );
}

/* ==========================================
   PRINCIPLES SECTION
   ========================================== */
function PrinciplesSection({ t }) {
  const items = [
    { num: '01', ...t.principles.precision },
    { num: '02', ...t.principles.balance },
    { num: '03', ...t.principles.elevation },
  ];

  return (
    <section className="px-6 md:px-12 lg:px-24 py-28 md:py-36 bg-pribega-surface" data-testid="principles-section">
      <motion.p
        className="font-body text-[10px] uppercase tracking-[0.3em] text-pribega-text-secondary mb-20 md:mb-28"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {t.principles.title}
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
        {items.map((item, i) => (
          <motion.div
            key={item.num}
            className="group"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-heading text-4xl sm:text-5xl font-light text-pribega-border group-hover:text-pribega-accent transition-colors duration-700">
              {item.num}
            </span>
            <div className="h-[1px] bg-pribega-border mt-6 mb-6 group-hover:bg-pribega-accent transition-colors duration-700" />
            <h3 className="font-heading text-2xl md:text-3xl font-light text-pribega-text mb-4 tracking-wide">
              {item.title}
            </h3>
            <p className="font-body text-sm text-pribega-text-secondary leading-relaxed">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ==========================================
   SERVICES PREVIEW
   ========================================== */
function ServicesPreview({ t }) {
  const previewServices = [
    ...t.services.brows.items.slice(0, 3),
    t.services.complex.items[0],
  ];

  return (
    <section className="px-6 md:px-12 lg:px-24 py-28 md:py-36" data-testid="services-preview-section">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        <div className="lg:col-span-4">
          <motion.p
            className="font-body text-[10px] uppercase tracking-[0.3em] text-pribega-text-secondary mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {t.servicesPreview.title}
          </motion.p>
          <TextReveal
            text={t.servicesPreview.subtitle}
            className="font-heading text-2xl md:text-3xl font-light text-pribega-text leading-snug"
            as="h2"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-10"
          >
            <MagneticButton>
              <Link
                to="/services"
                className="hover-line font-body text-xs uppercase tracking-[0.2em] text-pribega-accent"
                data-testid="services-view-all"
                data-cursor="hover"
              >
                {t.servicesPreview.viewAll}
                <ArrowRight size={12} className="inline ml-2" />
              </Link>
            </MagneticButton>
          </motion.div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          {previewServices.map((service, i) => (
            <motion.div
              key={i}
              className="service-item flex justify-between items-center py-6 border-b border-pribega-border"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="font-body text-sm text-pribega-text tracking-wide">{service.name}</span>
              <span className="font-heading text-lg text-pribega-text ml-4 whitespace-nowrap">{service.price}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   ACADEMY PREVIEW
   ========================================== */
function AcademyPreview({ t }) {
  return (
    <section className="px-6 md:px-12 lg:px-24 py-28 md:py-36" data-testid="academy-preview-section">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-5">
          <motion.p
            className="font-body text-[10px] uppercase tracking-[0.3em] text-pribega-text-secondary mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Academy
          </motion.p>
          <TextReveal
            text={t.academy.title}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-pribega-text leading-[0.9]"
            as="h2"
          />
          <motion.p
            className="font-body text-sm text-pribega-text-secondary mt-8 leading-relaxed max-w-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {t.academy.preview}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-10"
          >
            <MagneticButton>
              <Link
                to="/academy"
                className="inline-block bg-pribega-text text-pribega-bg px-10 py-4 font-body text-[10px] uppercase tracking-[0.25em] hover:bg-pribega-accent transition-colors duration-500"
                data-testid="academy-preview-link"
                data-cursor="hover"
              >
                {t.academy.apply}
              </Link>
            </MagneticButton>
          </motion.div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <ImageReveal
            src={FOUNDER_PHOTO}
            alt="Anastasia Pribega"
            className="w-full h-[400px] md:h-[600px]"
            direction="right"
          />
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   CTA SECTION
   ========================================== */
function CTASection({ t }) {
  return (
    <section className="px-6 md:px-12 lg:px-24 py-32 md:py-48 text-center" data-testid="cta-section">
      <BrowArchSVG className="mb-16" />

      <TextReveal
        text={t.cta.title}
        className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-pribega-text leading-[0.9]"
        as="h2"
      />

      <motion.p
        className="font-body text-sm text-pribega-text-secondary mt-8 tracking-wide"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        {t.cta.subtitle}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-12"
      >
        <MagneticButton>
          <Link
            to="/contact"
            className="inline-block bg-pribega-text text-pribega-bg px-12 py-5 font-body text-[10px] uppercase tracking-[0.25em] hover:bg-pribega-accent transition-colors duration-500"
            data-testid="cta-book-button"
            data-cursor="hover"
          >
            {t.cta.button}
          </Link>
        </MagneticButton>
      </motion.div>
    </section>
  );
}

/* ==========================================
   MAIN HOMEPAGE
   ========================================== */
export default function HomePage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <div data-testid="home-page">
      <HeroSection t={t} />

      <Marquee items={['PRECISION', 'BALANCE', 'ELEVATION', 'PRIBEGA', 'THE STANDARD OF BEAUTY']} speed={50} />

      <ManifestoSection t={t} />

      <PrinciplesSection t={t} />

      <ServicesPreview t={t} />

      <div className="bg-pribega-surface">
        <HorizontalGallery title={t.gallery.title} subtitle={t.gallery.subtitle} />
      </div>

      <AcademyPreview t={t} />

      <Marquee
        items={['NATURAL PRECISION', 'ARCHITECTURAL BEAUTY', 'PAPHOS CYPRUS', 'BY APPOINTMENT ONLY']}
        speed={45}
        className="border-y border-pribega-border"
      />

      <CTASection t={t} />
    </div>
  );
}
