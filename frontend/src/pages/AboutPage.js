import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/data/translations';

const FOUNDER_PHOTO = 'https://customer-assets.emergentagent.com/job_47f6f644-e94f-410b-9ee0-18b3ab243391/artifacts/8sxwltdz_photo_2026-02-25_19-22-30.jpg';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
};

export default function AboutPage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <div className="pt-24 md:pt-32" data-testid="about-page">
      {/* Header */}
      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24">
        <motion.p
          className="font-body text-xs uppercase tracking-[0.2em] text-pribega-text-secondary mb-4"
          {...fadeUp}
        >
          {t.about.title}
        </motion.p>
        <motion.h1
          className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-pribega-text leading-[0.9]"
          {...fadeUp}
          data-testid="about-heading"
        >
          Anastasia Pribega
        </motion.h1>
      </section>

      {/* Editorial Content */}
      <section className="px-6 md:px-12 lg:px-24 pb-24 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Photo */}
          <motion.div
            className="lg:col-span-5 lg:col-start-1"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="overflow-hidden">
              <img
                src={FOUNDER_PHOTO}
                alt="Anastasia Pribega"
                className="w-full h-[500px] md:h-[650px] object-cover object-top"
                data-testid="founder-photo"
              />
            </div>
          </motion.div>

          {/* Text */}
          <div className="lg:col-span-6 lg:col-start-7 flex flex-col justify-center">
            <motion.p
              className="font-heading text-base md:text-lg font-light text-pribega-text leading-relaxed"
              {...fadeUp}
            >
              {t.about.intro}
            </motion.p>

            <motion.div className="h-[1px] bg-pribega-border my-8 md:my-12" {...fadeUp} />

            <motion.p
              className="font-body text-sm text-pribega-text-secondary leading-relaxed"
              {...fadeUp}
            >
              {t.about.text1}
            </motion.p>

            <motion.p
              className="font-body text-sm text-pribega-text-secondary leading-relaxed mt-6"
              {...fadeUp}
            >
              {t.about.text2}
            </motion.p>

            {/* Digital Signature */}
            <motion.div
              className="mt-12 md:mt-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              <p
                className="font-heading text-2xl md:text-3xl italic text-pribega-accent"
                data-testid="digital-signature"
              >
                {t.about.signature}
              </p>
              <div className="mt-3 w-16 h-[1px] bg-pribega-accent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brow Arch Divider */}
      <section className="px-6 md:px-12 lg:px-24 py-16">
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

      {/* Experience Stats */}
      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24 bg-pribega-surface">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { num: '7+', label: lang === 'ru' ? 'Лет опыта' : 'Years Experience' },
            { num: '1000+', label: lang === 'ru' ? 'Довольных клиентов' : 'Happy Clients' },
            { num: '1', label: lang === 'ru' ? 'Стандарт качества' : 'Standard of Quality' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
            >
              <p className="font-heading text-4xl sm:text-5xl font-light text-pribega-text">{stat.num}</p>
              <p className="font-body text-xs uppercase tracking-[0.2em] text-pribega-text-secondary mt-3">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
