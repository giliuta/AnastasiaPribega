import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { LineReveal } from '@/components/TextReveal';
import MagneticButton from '@/components/MagneticButton';
import { CheckCircle, Send, Calendar, User, Award as AwardIcon, MessageCircle } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const BASE = 'https://customer-assets.emergentagent.com/job_arch-beauty-lab/artifacts/';

const TRAINING_VIDEOS = [
  `${BASE}7m6is1b5_pribega_brows_paphos_1736883813_3545560754309893494_7225780068.mp4`,
  `${BASE}lqopx3ob_pribega_brows_paphos_1739972213_3571465257773037586_7225780068.mp4`,
  `${BASE}4uh59sr9_pribega_brows_paphos_1742206767_3590212851844163810_7225780068.mp4`,
  `${BASE}d5knb5f2_pribega_brows_paphos_1742815528_3595318625373212119_7225780068.mp4`,
];

export default function AcademyPage() {
  const { lang } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const isRu = lang === 'ru';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post(`${API}/contact`, { ...form, message: `[ACADEMY] ${form.message}`, language: lang });
      setSent(true);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) { console.error(err); }
    setSending(false);
  };

  const courseIncludes = isRu ? [
    'Полная теория по коррекции и окрашиванию',
    'Демонстрация на модели и два полных практических дня',
    'Разбор и отработка формы, симметрии, подбора цвета',
    'Подробная информация о материалах: что нужно, в каком объёме и как подобрать под свой старт',
    'Помощь в заказе и расчёте стоимости материалов',
    'Индивидуальный подход — обучение один на один, по авторской методике',
    'Поддержка после курса — на связи ещё в течение месяца: помощь с вопросами, разбор работ, советы',
    'Как продвигать себя в Instagram: найти первых клиентов и красиво оформить профиль',
  ] : [
    'Full theory on correction and tinting',
    'Demonstration on a model and two full practice days',
    'Shape analysis, symmetry work, color matching',
    'Detailed information about materials: what you need, quantities, and how to choose for your start',
    'Help with ordering and calculating material costs',
    'Individual approach — one-on-one training using proprietary methodology',
    'Post-course support — staying in touch for a month: help with questions, work review, advice',
    'How to promote yourself on Instagram: find first clients and beautifully design your profile',
  ];

  const daySchedule = isRu ? [
    { day: 'День 1', title: 'Теория + демонстрация', desc: 'Подробно разбираем строение бровей, формы, типы кожи, особенности подбора оттенков. Демонстрация коррекции и окрашивания на модели — вы наблюдаете и записываете все нюансы.' },
    { day: 'День 2', title: 'Практика', desc: 'Вы работаете самостоятельно на моделях под полным контролем мастера. От подготовки до финального результата — всё делаете сами.' },
    { day: 'День 3', title: 'Практика', desc: 'Продолжение самостоятельной работы на моделях. Закрепление навыков, разбор ошибок, финальная отработка техники.' },
  ] : [
    { day: 'Day 1', title: 'Theory + Demonstration', desc: 'Detailed study of brow structure, shapes, skin types, shade selection. Demonstration of correction and tinting on a model — you observe and note all nuances.' },
    { day: 'Day 2', title: 'Practice', desc: 'You work independently on models under full supervision. From preparation to final result — you do everything yourself.' },
    { day: 'Day 3', title: 'Practice', desc: 'Continued independent work on models. Skill reinforcement, error analysis, final technique refinement.' },
  ];

  return (
    <div className="pt-24 md:pt-32" data-testid="academy-page">
      {/* Header */}
      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24">
        <LineReveal>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-pribega-text leading-[0.9]" data-testid="academy-heading">
            PRIBEGA ACADEMY
          </h1>
        </LineReveal>
        <motion.p className="font-body text-sm text-pribega-text-secondary mt-6 max-w-xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          {isRu
            ? 'Индивидуальное обучение по коррекции и окрашиванию бровей от Анастасии Прибега. 3 дня интенсива — теория, демонстрация и полная практика на моделях.'
            : 'Individual brow correction and tinting training by Anastasia Pribega. 3 days of intensive study — theory, demonstration, and full hands-on practice.'}
        </motion.p>
      </section>

      {/* Videos */}
      <section className="px-6 md:px-12 lg:px-24 pb-16 md:pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TRAINING_VIDEOS.map((vid, i) => (
            <motion.div key={i} className="overflow-hidden rounded-sm aspect-[9/16]"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7 }}>
              <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                <source src={vid} type="video/mp4" />
              </video>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Key details */}
      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-20 bg-pribega-surface">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: User, title: isRu ? 'Один на один' : 'One on One', desc: isRu ? 'Персональное обучение по авторской методике PRIBEGA' : 'Personal training using PRIBEGA proprietary methodology' },
            { icon: Calendar, title: isRu ? '3 дня' : '3 Days', desc: isRu ? '1 день теории + 2 дня полной практики на моделях' : '1 day theory + 2 days full hands-on practice' },
            { icon: AwardIcon, title: isRu ? 'Сертификат + портфолио' : 'Certificate + Portfolio', desc: isRu ? 'Готовое портфолио работ и сертификат PRIBEGA ACADEMY' : 'Ready work portfolio and PRIBEGA ACADEMY certificate' },
          ].map((card, i) => (
            <motion.div key={i} className="border-t border-pribega-border pt-8"
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.8 }}>
              <card.icon size={18} className="text-pribega-accent mb-4" />
              <h3 className="font-heading text-xl font-light text-pribega-text mb-2">{card.title}</h3>
              <p className="font-body text-sm text-pribega-text-secondary leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Day-by-day schedule */}
      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24">
        <p className="font-heading text-2xl sm:text-3xl font-light text-pribega-text mb-10">
          {isRu ? 'Как проходит обучение' : 'How training works'}
        </p>
        <div className="space-y-8">
          {daySchedule.map((day, i) => (
            <motion.div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 border-b border-pribega-border pb-8"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7 }}>
              <div className="md:col-span-2">
                <span className="font-heading text-3xl sm:text-4xl font-light text-pribega-border">{day.day}</span>
              </div>
              <div className="md:col-span-3">
                <p className="font-heading text-lg font-light text-pribega-text">{day.title}</p>
              </div>
              <div className="md:col-span-7">
                <p className="font-body text-sm text-pribega-text-secondary leading-relaxed">{day.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* What's included */}
      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-20 bg-pribega-surface">
        <p className="font-heading text-2xl sm:text-3xl font-light text-pribega-text mb-10">
          {isRu ? 'Что входит в курс' : 'What the course includes'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courseIncludes.map((item, i) => (
            <motion.div key={i} className="flex items-start gap-3"
              initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}>
              <CheckCircle size={14} className="text-pribega-accent mt-1 shrink-0" />
              <p className="font-body text-sm text-pribega-text leading-relaxed">{item}</p>
            </motion.div>
          ))}
        </div>

        <motion.div className="flex items-start gap-3 mt-8 pt-6 border-t border-pribega-border"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <MessageCircle size={14} className="text-pribega-accent mt-1 shrink-0" />
          <p className="font-body text-sm text-pribega-accent leading-relaxed">
            {isRu
              ? 'Поддержка после курса — остаюсь на связи в течение месяца'
              : 'Post-course support — staying in touch for a month'}
          </p>
        </motion.div>
      </section>

      {/* Application Form */}
      <section className="px-6 md:px-12 lg:px-24 py-20 md:py-28" data-testid="academy-form-section">
        <div className="max-w-md mx-auto">
          <p className="font-heading text-2xl sm:text-3xl font-light text-pribega-text mb-10 text-center">
            {isRu ? 'Записаться на обучение' : 'Apply for training'}
          </p>

          {sent ? (
            <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} data-testid="academy-form-success">
              <CheckCircle size={28} className="text-pribega-accent mx-auto mb-4" />
              <p className="font-heading text-xl font-light text-pribega-text">
                {isRu ? 'Заявка отправлена!' : 'Application sent!'}
              </p>
            </motion.div>
          ) : (
            <motion.form onSubmit={handleSubmit} className="space-y-5" data-testid="academy-form"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div>
                <label className="font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary block mb-2">{isRu ? 'Имя' : 'Name'}</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-pribega-surface border border-pribega-border px-5 py-4 font-body text-sm text-pribega-text focus:border-pribega-accent focus:outline-none transition-colors"
                  data-testid="academy-name-input" />
              </div>
              <div>
                <label className="font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary block mb-2">{isRu ? 'Телефон' : 'Phone'}</label>
                <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+357"
                  className="w-full bg-pribega-surface border border-pribega-border px-5 py-4 font-body text-sm text-pribega-text placeholder:text-pribega-text-secondary/30 focus:border-pribega-accent focus:outline-none transition-colors"
                  data-testid="academy-phone-input" />
              </div>
              <div className="pt-2">
                <MagneticButton>
                  <button type="submit" disabled={sending}
                    className="w-full bg-pribega-text text-pribega-bg py-4 font-body text-[10px] uppercase tracking-[0.25em] hover:bg-pribega-accent transition-colors duration-500 disabled:opacity-50 inline-flex items-center justify-center gap-2"
                    data-testid="academy-submit-button" data-cursor="hover">
                    <Send size={12} />
                    {sending ? '...' : (isRu ? 'Записаться' : 'Apply')}
                  </button>
                </MagneticButton>
              </div>
            </motion.form>
          )}
        </div>
      </section>
    </div>
  );
}
