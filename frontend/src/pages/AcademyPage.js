import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/data/translations';
import { TextReveal, LineReveal } from '@/components/TextReveal';
import ImageReveal from '@/components/ImageReveal';
import MagneticButton from '@/components/MagneticButton';
import Marquee from '@/components/Marquee';

export default function AcademyPage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <div className="pt-24 md:pt-32" data-testid="academy-page">
      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24">
        <motion.p
          className="font-body text-[10px] uppercase tracking-[0.3em] text-pribega-text-secondary mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Academy
        </motion.p>
        <LineReveal>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-pribega-text leading-[0.9]" data-testid="academy-heading">
            {t.academy.title}
          </h1>
        </LineReveal>
      </section>

      <section className="px-6 md:px-12 lg:px-24 pb-24 md:pb-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-6">
            <ImageReveal
              src="https://images.unsplash.com/photo-1518892974594-4adbf359419c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwzfHxtaW5pbWFsaXN0JTIwYmVpZ2UlMjBhcmNoaXRlY3R1cmFsJTIwaW50ZXJpb3IlMjBzdG9uZSUyMHRleHR1cmV8ZW58MHx8fHwxNzcyMDQzODQ5fDA&ixlib=rb-4.1.0&q=85"
              alt="PRIBEGA Academy"
              className="w-full h-80 md:h-[550px]"
              direction="bottom"
            />
          </div>

          <div className="lg:col-span-5 lg:col-start-8 flex flex-col justify-center">
            <TextReveal
              text={t.academy.desc}
              className="font-heading text-base md:text-lg font-light text-pribega-text leading-relaxed"
              as="p"
            />

            <motion.div
              className="section-line my-10 md:my-14"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              style={{ transformOrigin: 'left' }}
            />

            <motion.p
              className="font-body text-sm text-pribega-text-secondary leading-relaxed mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {lang === 'ru'
                ? 'Индивидуальное обучение с полным погружением в технику архитектуры бровей. Программа разработана для мастеров, которые хотят выйти на премиальный уровень.'
                : 'Individual training with full immersion in brow architecture technique. The program is designed for artists who want to reach premium level.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <MagneticButton>
                <Link
                  to="/contact"
                  className="inline-block bg-pribega-text text-pribega-bg px-10 py-4 font-body text-[10px] uppercase tracking-[0.25em] hover:bg-pribega-accent transition-colors duration-500"
                  data-testid="academy-apply-button"
                  data-cursor="hover"
                >
                  {t.academy.apply}
                </Link>
              </MagneticButton>
            </motion.div>
          </div>
        </div>
      </section>

      <Marquee
        items={['TECHNIQUE', 'PRACTICE', 'MASTERY', 'PRIBEGA ACADEMY']}
        speed={45}
        className="border-y border-pribega-border"
      />

      <section className="px-6 md:px-12 lg:px-24 py-20 md:py-32 bg-pribega-surface">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            { num: '01', title: lang === 'ru' ? 'Техника' : 'Technique', desc: lang === 'ru' ? 'Авторская методика архитектуры формы' : 'Proprietary form architecture methodology' },
            { num: '02', title: lang === 'ru' ? 'Практика' : 'Practice', desc: lang === 'ru' ? 'Работа с реальными клиентами под руководством' : 'Work with real clients under guidance' },
            { num: '03', title: lang === 'ru' ? 'Результат' : 'Results', desc: lang === 'ru' ? 'Портфолио и сертификат PRIBEGA ACADEMY' : 'Portfolio and PRIBEGA ACADEMY certificate' },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="font-heading text-4xl sm:text-5xl font-light text-pribega-border group-hover:text-pribega-accent transition-colors duration-700">
                {item.num}
              </span>
              <div className="h-[1px] bg-pribega-border mt-6 mb-6 group-hover:bg-pribega-accent transition-colors duration-700" />
              <h3 className="font-heading text-2xl font-light text-pribega-text mb-3 tracking-wide">{item.title}</h3>
              <p className="font-body text-sm text-pribega-text-secondary leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
