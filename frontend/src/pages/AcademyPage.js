import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/data/translations';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
};

export default function AcademyPage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <div className="pt-24 md:pt-32" data-testid="academy-page">
      {/* Hero */}
      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24">
        <motion.p
          className="font-body text-xs uppercase tracking-[0.2em] text-pribega-text-secondary mb-4"
          {...fadeUp}
        >
          Academy
        </motion.p>
        <motion.h1
          className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-pribega-text leading-[0.9]"
          {...fadeUp}
          data-testid="academy-heading"
        >
          {t.academy.title}
        </motion.h1>
      </section>

      {/* Content */}
      <section className="px-6 md:px-12 lg:px-24 pb-24 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-6">
            <motion.div
              className="overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <img
                src="https://images.unsplash.com/photo-1518892974594-4adbf359419c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwzfHxtaW5pbWFsaXN0JTIwYmVpZ2UlMjBhcmNoaXRlY3R1cmFsJTIwaW50ZXJpb3IlMjBzdG9uZSUyMHRleHR1cmV8ZW58MHx8fHwxNzcyMDQzODQ5fDA&ixlib=rb-4.1.0&q=85"
                alt="PRIBEGA Academy"
                className="w-full h-80 md:h-[550px] object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8 flex flex-col justify-center">
            <motion.p
              className="font-heading text-base md:text-lg font-light text-pribega-text leading-relaxed"
              {...fadeUp}
            >
              {t.academy.desc}
            </motion.p>

            <motion.div className="h-[1px] bg-pribega-border my-8 md:my-12" {...fadeUp} />

            <motion.div {...fadeUp}>
              <p className="font-body text-sm text-pribega-text-secondary leading-relaxed mb-8">
                {lang === 'ru'
                  ? 'Индивидуальное обучение с полным погружением в технику архитектуры бровей. Программа разработана для мастеров, которые хотят выйти на премиальный уровень.'
                  : 'Individual training with full immersion in brow architecture technique. The program is designed for artists who want to reach premium level.'}
              </p>

              <Link
                to="/contact"
                className="inline-block bg-pribega-text text-pribega-bg px-10 py-4 font-body text-xs uppercase tracking-[0.2em] hover:bg-pribega-accent transition-colors duration-300"
                data-testid="academy-apply-button"
                data-cursor="hover"
              >
                {t.academy.apply}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24 bg-pribega-surface">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              num: '01',
              title: lang === 'ru' ? 'Техника' : 'Technique',
              desc: lang === 'ru' ? 'Авторская методика архитектуры формы' : 'Proprietary form architecture methodology',
            },
            {
              num: '02',
              title: lang === 'ru' ? 'Практика' : 'Practice',
              desc: lang === 'ru' ? 'Работа с реальными клиентами под руководством' : 'Work with real clients under guidance',
            },
            {
              num: '03',
              title: lang === 'ru' ? 'Результат' : 'Results',
              desc: lang === 'ru' ? 'Портфолио и сертификат PRIBEGA ACADEMY' : 'Portfolio and PRIBEGA ACADEMY certificate',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="border-t border-pribega-border pt-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
            >
              <span className="font-body text-xs text-pribega-text-secondary">{item.num}</span>
              <h3 className="font-heading text-2xl font-light text-pribega-text mt-4 mb-3">{item.title}</h3>
              <p className="font-body text-sm text-pribega-text-secondary leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
