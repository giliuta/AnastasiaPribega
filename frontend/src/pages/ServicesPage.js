import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/data/translations';
import { TextReveal, LineReveal } from '@/components/TextReveal';
import Marquee from '@/components/Marquee';

function ServiceCategory({ title, items, delay = 0 }) {
  return (
    <motion.div
      className="mb-20 md:mb-24"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
    >
      <h3 className="font-heading text-2xl md:text-3xl font-light text-pribega-text mb-10">
        {title}
      </h3>
      <div>
        {items.map((service, i) => (
          <motion.div
            key={i}
            className="service-item flex justify-between items-baseline py-6 border-b border-pribega-border/50 group hover:border-pribega-accent transition-colors duration-500"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            data-testid={`service-item-${i}`}
          >
            <span className="font-body text-sm md:text-base text-pribega-text tracking-wide group-hover:text-pribega-accent transition-colors duration-300">
              {service.name}
            </span>
            <div className="flex items-center gap-4 ml-4">
              <motion.div 
                className="hidden md:block h-[1px] bg-pribega-border/30 group-hover:bg-pribega-accent transition-all duration-500"
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                viewport={{ once: true }}
                transition={{ delay: delay + i * 0.08 + 0.3, duration: 0.8 }} />
              <span className="font-heading text-lg md:text-xl text-pribega-text whitespace-nowrap">
                {service.price}
              </span>
            </div>
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
          className="font-body text-[10px] uppercase tracking-[0.3em] text-pribega-text-secondary mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {t.servicesPreview.title}
        </motion.p>
        <LineReveal>
          <h1
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-pribega-text leading-[0.9]"
            data-testid="services-heading"
          >
            {s.pageTitle}
          </h1>
        </LineReveal>
      </section>

      <section className="px-6 md:px-12 lg:px-24 pb-16 md:pb-24">
        <div className="max-w-4xl">
          <ServiceCategory title={s.brows.title} items={s.brows.items} delay={0} />
          <ServiceCategory title={s.lashes.title} items={s.lashes.items} delay={0.1} />
          <ServiceCategory title={s.complex.title} items={s.complex.items} delay={0.15} />
          <ServiceCategory title={s.additional.title} items={s.additional.items} delay={0.2} />
        </div>
      </section>

      <Marquee
        items={['BROW ARCHITECTURE', 'LASH DESIGN', 'NATURAL BEAUTY', 'PRIBEGA']}
        speed={45}
        className="border-t border-pribega-border"
      />

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
