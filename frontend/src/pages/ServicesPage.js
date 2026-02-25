import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/data/translations';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
};

function ServiceCategory({ title, items, delay = 0 }) {
  return (
    <motion.div
      className="mb-16 md:mb-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
    >
      <h3 className="font-heading text-2xl md:text-3xl font-light text-pribega-text mb-8">
        {title}
      </h3>
      <div>
        {items.map((service, i) => (
          <motion.div
            key={i}
            className="service-item flex justify-between items-center py-5 border-b border-pribega-border"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay + i * 0.08, duration: 0.5 }}
            data-testid={`service-item-${i}`}
          >
            <span className="font-body text-sm md:text-base text-pribega-text tracking-wide">
              {service.name}
            </span>
            <span className="font-body text-sm text-pribega-text-secondary ml-4 whitespace-nowrap">
              {service.price}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function ServicesPage() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const s = t.services;

  return (
    <div className="pt-24 md:pt-32" data-testid="services-page">
      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24">
        <motion.p
          className="font-body text-xs uppercase tracking-[0.2em] text-pribega-text-secondary mb-4"
          {...fadeUp}
        >
          {t.servicesPreview.title}
        </motion.p>
        <motion.h1
          className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-pribega-text leading-[0.9]"
          {...fadeUp}
          data-testid="services-heading"
        >
          {s.pageTitle}
        </motion.h1>
      </section>

      <section className="px-6 md:px-12 lg:px-24 pb-24 md:pb-32">
        <div className="max-w-3xl">
          <ServiceCategory title={s.brows.title} items={s.brows.items} delay={0} />
          <ServiceCategory title={s.lashes.title} items={s.lashes.items} delay={0.1} />
          <ServiceCategory title={s.complex.title} items={s.complex.items} delay={0.2} />
          <ServiceCategory title={s.additional.title} items={s.additional.items} delay={0.3} />
        </div>
      </section>

      {/* Brow Arch Divider */}
      <section className="px-6 md:px-12 lg:px-24 py-16 bg-pribega-surface">
        <svg viewBox="0 0 600 60" className="w-full max-w-md mx-auto" fill="none">
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
    </div>
  );
}
