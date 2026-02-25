import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/data/translations';
import { TextReveal, LineReveal } from '@/components/TextReveal';
import ImageReveal from '@/components/ImageReveal';

const FOUNDER_PHOTO = 'https://customer-assets.emergentagent.com/job_47f6f644-e94f-410b-9ee0-18b3ab243391/artifacts/8sxwltdz_photo_2026-02-25_19-22-30.jpg';

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

export default function AboutPage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <div className="pt-24 md:pt-32" data-testid="about-page">
      {/* Header */}
      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24">
        <motion.p
          className="font-body text-[10px] uppercase tracking-[0.3em] text-pribega-text-secondary mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {t.about.title}
        </motion.p>
        <LineReveal>
          <h1
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-pribega-text leading-[0.9]"
            data-testid="about-heading"
          >
            Anastasia Pribega
          </h1>
        </LineReveal>
      </section>

      {/* Editorial Content */}
      <section className="px-6 md:px-12 lg:px-24 pb-24 md:pb-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Photo */}
          <div className="lg:col-span-5">
            <ImageReveal
              src={FOUNDER_PHOTO}
              alt="Anastasia Pribega"
              className="w-full h-[500px] md:h-[700px]"
              direction="left"
            />
          </div>

          {/* Text */}
          <div className="lg:col-span-6 lg:col-start-7 flex flex-col justify-center">
            <TextReveal
              text={t.about.intro}
              className="font-heading text-base md:text-lg font-light text-pribega-text leading-relaxed"
              as="p"
            />

            <motion.div
              className="section-line my-10 md:my-14"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'left' }}
            />

            <motion.p
              className="font-body text-sm text-pribega-text-secondary leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {t.about.text1}
            </motion.p>

            <motion.p
              className="font-body text-sm text-pribega-text-secondary leading-relaxed mt-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {t.about.text2}
            </motion.p>

            {/* Digital Signature */}
            <motion.div
              className="mt-14 md:mt-20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 1.2 }}
            >
              <p className="font-heading text-3xl md:text-4xl italic text-pribega-accent" data-testid="digital-signature">
                {t.about.signature}
              </p>
              <motion.div
                className="mt-4 w-20 h-[1px] bg-pribega-accent"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8 }}
                style={{ transformOrigin: 'left' }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brow Arch Divider */}
      <section className="px-6 md:px-12 lg:px-24 py-12">
        <svg viewBox="0 0 600 60" className="w-full max-w-lg mx-auto" fill="none">
          <motion.path
            d="M0 50 C80 50, 120 8, 200 8 C280 8, 340 25, 400 25 C460 25, 520 35, 600 40"
            stroke="#A07E66"
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
      </section>

      {/* Experience Stats with animated counters */}
      <section className="px-6 md:px-12 lg:px-24 py-20 md:py-32 bg-pribega-surface">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          {[
            { num: 7, suffix: '+', label: lang === 'ru' ? 'Лет опыта' : 'Years Experience' },
            { num: 1000, suffix: '+', label: lang === 'ru' ? 'Довольных клиентов' : 'Happy Clients' },
            { num: 1, suffix: '', label: lang === 'ru' ? 'Стандарт качества' : 'Standard of Quality' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-heading text-5xl sm:text-6xl font-light text-pribega-text">
                <Counter target={stat.num} suffix={stat.suffix} />
              </p>
              <p className="font-body text-[10px] uppercase tracking-[0.25em] text-pribega-text-secondary mt-4">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
