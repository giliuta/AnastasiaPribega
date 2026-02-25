import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/data/translations';
import { LineReveal } from '@/components/TextReveal';
import MagneticButton from '@/components/MagneticButton';
import { CheckCircle, Send, Calendar, User, Award as AwardIcon } from 'lucide-react';
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
  const t = translations[lang];
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

  const program = isRu ? [
    'Архитектура формы бровей — авторская методика PRIBEGA',
    'Анализ типов лица и подбор идеальной формы',
    'Техники коррекции: прореживание, моделирование',
    'Окрашивание бровей и ресниц',
    'Ламинирование бровей и ресниц',
    'Работа с клиентами: консультация, коммуникация, сервис',
    'Создание премиального портфолио',
  ] : [
    'Brow architecture — proprietary PRIBEGA methodology',
    'Face type analysis and perfect shape selection',
    'Correction techniques: thinning, shaping',
    'Brow and lash tinting',
    'Brow and lash lamination',
    'Client work: consultation, communication, service',
    'Building a premium portfolio',
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
            ? 'Индивидуальное обучение от Анастасии Прибега. 3 дня интенсивной практики — от основ архитектуры бровей до работы с реальными клиентами.'
            : 'Individual training by Anastasia Pribega. 3 days of intensive practice — from brow architecture fundamentals to working with real clients.'}
        </motion.p>
      </section>

      {/* Training Videos */}
      <section className="px-6 md:px-12 lg:px-24 pb-16 md:pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TRAINING_VIDEOS.map((vid, i) => (
            <motion.div key={i} className="relative overflow-hidden rounded-sm aspect-[9/16] group"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7 }}>
              <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                <source src={vid} type="video/mp4" />
              </video>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Details cards */}
      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24 bg-pribega-surface">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 md:mb-24">
          {[
            { icon: User, title: isRu ? 'Индивидуально' : 'Individual', desc: isRu ? 'Персональное обучение один на один с мастером' : 'Personal one-on-one training with the master' },
            { icon: Calendar, title: isRu ? '3 дня' : '3 Days', desc: isRu ? 'Интенсивная программа с полным погружением в практику' : 'Intensive program with full immersion in practice' },
            { icon: AwardIcon, title: isRu ? 'Сертификат' : 'Certificate', desc: isRu ? 'Сертификат PRIBEGA ACADEMY + готовое портфолио' : 'PRIBEGA ACADEMY certificate + ready portfolio' },
          ].map((card, i) => (
            <motion.div key={i} className="border-t border-pribega-border pt-8"
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8 }}>
              <card.icon size={20} className="text-pribega-accent mb-4" />
              <h3 className="font-heading text-2xl font-light text-pribega-text mb-3">{card.title}</h3>
              <p className="font-body text-sm text-pribega-text-secondary leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Program */}
        <div className="max-w-2xl">
          <p className="font-heading text-2xl sm:text-3xl font-light text-pribega-text mb-8">
            {isRu ? 'Программа обучения' : 'Training program'}
          </p>
          <div className="space-y-4">
            {program.map((item, i) => (
              <motion.div key={i} className="flex items-start gap-3"
                initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}>
                <CheckCircle size={15} className="text-pribega-accent mt-0.5 shrink-0" />
                <p className="font-body text-sm text-pribega-text leading-relaxed">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="px-6 md:px-12 lg:px-24 py-20 md:py-28" data-testid="academy-form-section">
        <div className="max-w-xl mx-auto">
          <p className="font-heading text-2xl sm:text-3xl font-light text-pribega-text mb-10 text-center">
            {isRu ? 'Подать заявку' : 'Apply for training'}
          </p>

          {sent ? (
            <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} data-testid="academy-form-success">
              <CheckCircle size={28} className="text-pribega-accent mx-auto mb-4" />
              <p className="font-heading text-xl font-light text-pribega-text">
                {isRu ? 'Заявка отправлена!' : 'Application sent!'}
              </p>
              <p className="font-body text-sm text-pribega-text-secondary mt-2">
                {isRu ? 'Мы свяжемся с вами в ближайшее время.' : 'We will contact you shortly.'}
              </p>
            </motion.div>
          ) : (
            <motion.form onSubmit={handleSubmit} className="space-y-6" data-testid="academy-form"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary block mb-2">{isRu ? 'Имя' : 'Name'}</label>
                  <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-pribega-surface border border-pribega-border px-4 py-3.5 font-body text-sm text-pribega-text focus:border-pribega-accent focus:outline-none transition-colors rounded-none"
                    data-testid="academy-name-input" />
                </div>
                <div>
                  <label className="font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary block mb-2">{isRu ? 'Телефон' : 'Phone'}</label>
                  <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-pribega-surface border border-pribega-border px-4 py-3.5 font-body text-sm text-pribega-text focus:border-pribega-accent focus:outline-none transition-colors rounded-none"
                    data-testid="academy-phone-input" />
                </div>
              </div>
              <div>
                <label className="font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary block mb-2">Email</label>
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-pribega-surface border border-pribega-border px-4 py-3.5 font-body text-sm text-pribega-text focus:border-pribega-accent focus:outline-none transition-colors rounded-none"
                  data-testid="academy-email-input" />
              </div>
              <div>
                <label className="font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary block mb-2">{isRu ? 'Сообщение' : 'Message'}</label>
                <textarea rows={3} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder={isRu ? 'Расскажите о вашем опыте...' : 'Tell us about your experience...'}
                  className="w-full bg-pribega-surface border border-pribega-border px-4 py-3.5 font-body text-sm text-pribega-text placeholder:text-pribega-text-secondary/40 focus:border-pribega-accent focus:outline-none transition-colors resize-none rounded-none"
                  data-testid="academy-message-input" />
              </div>
              <div className="text-center pt-2">
                <MagneticButton>
                  <button type="submit" disabled={sending}
                    className="bg-pribega-text text-pribega-bg px-12 py-4 font-body text-[10px] uppercase tracking-[0.25em] hover:bg-pribega-accent transition-colors duration-500 disabled:opacity-50 inline-flex items-center gap-2"
                    data-testid="academy-submit-button" data-cursor="hover">
                    <Send size={12} />
                    {sending ? '...' : (isRu ? 'Отправить заявку' : 'Submit')}
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
