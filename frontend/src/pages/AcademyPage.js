import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/data/translations';
import { TextReveal, LineReveal } from '@/components/TextReveal';
import MagneticButton from '@/components/MagneticButton';
import { Play, CheckCircle } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const BASE = 'https://customer-assets.emergentagent.com/job_arch-beauty-lab/artifacts/';

const TRAINING_VIDEOS = [
  { src: `${BASE}2cjp4h54_pribega_brows_paphos_1744024220_3605458598025928199_7225780068.mp4` },
  { src: `${BASE}5ca010zd_pribega_brows_paphos_1745825571_3620569690473332598_7225780068.mp4` },
  { src: `${BASE}o78ih1v5_pribega_brows_paphos_1748251085_3640915937742678132_7225780068.mp4` },
];

export default function AcademyPage() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post(`${API}/contact`, {
        ...form,
        message: `[ACADEMY APPLICATION] ${form.message}`,
        language: lang,
      });
      setSent(true);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) { console.error(err); }
    setSending(false);
  };

  const isRu = lang === 'ru';

  const program = isRu ? [
    'Архитектура формы бровей — авторская методика',
    'Работа с различными типами лица и формами',
    'Техники коррекции и окрашивания',
    'Ламинирование бровей и ресниц',
    'Работа с клиентами: консультация и подбор',
    'Создание портфолио премиального уровня',
  ] : [
    'Brow architecture — proprietary methodology',
    'Working with different face types and shapes',
    'Correction and tinting techniques',
    'Brow and lash lamination',
    'Client work: consultation and selection',
    'Building a premium-level portfolio',
  ];

  return (
    <div className="pt-24 md:pt-32" data-testid="academy-page">
      {/* Header */}
      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24">
        <motion.p className="font-body text-[10px] uppercase tracking-[0.3em] text-pribega-text-secondary mb-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          [ ACADEMY ]
        </motion.p>
        <LineReveal>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-pribega-text leading-[0.9]" data-testid="academy-heading">
            {t.academy.title}
          </h1>
        </LineReveal>
        <motion.p className="font-body text-sm text-pribega-text-secondary mt-6 max-w-2xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          {t.academy.desc}
        </motion.p>
      </section>

      {/* Training Videos */}
      <section className="px-6 md:px-12 lg:px-24 pb-20 md:pb-28">
        <motion.p className="font-body text-[10px] uppercase tracking-[0.3em] text-pribega-text-secondary mb-8"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          [ {isRu ? 'ПРОЦЕСС РАБОТЫ' : 'WORK PROCESS'} ]
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TRAINING_VIDEOS.map((vid, i) => (
            <motion.div key={i} className="relative overflow-hidden rounded-sm aspect-[9/16] md:aspect-[3/4] group"
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8 }}>
              <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                <source src={vid.src} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-pribega-text/5 group-hover:bg-pribega-text/0 transition-colors duration-500" />
              <div className="absolute bottom-4 left-4">
                <span className="font-body text-[10px] uppercase tracking-[0.2em] text-white/70 bg-pribega-text/40 px-3 py-1 backdrop-blur-sm">
                  {isRu ? 'Видео' : 'Video'} {String(i + 1).padStart(2, '0')}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Program */}
      <section className="px-6 md:px-12 lg:px-24 py-20 md:py-28 bg-pribega-surface">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <motion.p className="font-body text-[10px] uppercase tracking-[0.3em] text-pribega-text-secondary mb-6"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              [ {isRu ? 'ПРОГРАММА ОБУЧЕНИЯ' : 'TRAINING PROGRAM'} ]
            </motion.p>
            <TextReveal text={isRu ? 'Чему вы научитесь' : 'What you will learn'}
              className="font-heading text-2xl sm:text-3xl font-light text-pribega-text leading-snug mb-10" as="h2" />
            <div className="space-y-5">
              {program.map((item, i) => (
                <motion.div key={i} className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}>
                  <CheckCircle size={16} className="text-pribega-accent mt-0.5 shrink-0" />
                  <p className="font-body text-sm text-pribega-text leading-relaxed">{item}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <motion.p className="font-body text-[10px] uppercase tracking-[0.3em] text-pribega-text-secondary mb-6"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              [ {isRu ? 'ДЕТАЛИ' : 'DETAILS'} ]
            </motion.p>
            <div className="space-y-6">
              {[
                { label: isRu ? 'Формат' : 'Format', value: isRu ? 'Индивидуальное обучение' : 'Individual training' },
                { label: isRu ? 'Продолжительность' : 'Duration', value: isRu ? 'От 3 до 5 дней' : '3 to 5 days' },
                { label: isRu ? 'Практика' : 'Practice', value: isRu ? 'Работа с реальными клиентами' : 'Work with real clients' },
                { label: isRu ? 'Результат' : 'Result', value: isRu ? 'Сертификат PRIBEGA ACADEMY + портфолио' : 'PRIBEGA ACADEMY certificate + portfolio' },
                { label: isRu ? 'Локация' : 'Location', value: isRu ? 'Пафос, Кипр' : 'Paphos, Cyprus' },
              ].map((detail, i) => (
                <motion.div key={i} className="flex justify-between items-baseline py-3 border-b border-pribega-border"
                  initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}>
                  <span className="font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary">{detail.label}</span>
                  <span className="font-body text-sm text-pribega-text">{detail.value}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="px-6 md:px-12 lg:px-24 py-20 md:py-28" data-testid="academy-form-section">
        <div className="max-w-xl mx-auto">
          <motion.p className="font-body text-[10px] uppercase tracking-[0.3em] text-pribega-text-secondary mb-6 text-center"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            [ {isRu ? 'ЗАЯВКА' : 'APPLICATION'} ]
          </motion.p>
          <TextReveal text={isRu ? 'Подать заявку на обучение' : 'Apply for Training'}
            className="font-heading text-2xl sm:text-3xl font-light text-pribega-text leading-snug mb-12 text-center" as="h2" />

          {sent ? (
            <motion.div className="text-center py-12" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              data-testid="academy-form-success">
              <CheckCircle size={32} className="text-pribega-accent mx-auto mb-4" />
              <p className="font-heading text-xl font-light text-pribega-text">
                {isRu ? 'Спасибо! Мы свяжемся с вами в ближайшее время.' : 'Thank you! We will contact you shortly.'}
              </p>
            </motion.div>
          ) : (
            <motion.form onSubmit={handleSubmit} className="space-y-8" data-testid="academy-form"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              {[
                { key: 'name', type: 'text', label: isRu ? 'Имя' : 'Name', required: true },
                { key: 'email', type: 'email', label: 'Email', required: true },
                { key: 'phone', type: 'tel', label: isRu ? 'Телефон' : 'Phone', required: true },
              ].map((field) => (
                <div key={field.key}>
                  <label className="font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary block mb-2">{field.label}</label>
                  <input type={field.type} required={field.required} value={form[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full bg-transparent border-b border-pribega-border px-0 py-3 font-body text-sm text-pribega-text focus:border-pribega-accent focus:outline-none transition-colors"
                    data-testid={`academy-${field.key}-input`} />
                </div>
              ))}
              <div>
                <label className="font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary block mb-2">
                  {isRu ? 'Сообщение' : 'Message'}
                </label>
                <textarea rows={3} value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder={isRu ? 'Расскажите о вашем опыте...' : 'Tell us about your experience...'}
                  className="w-full bg-transparent border-b border-pribega-border px-0 py-3 font-body text-sm text-pribega-text placeholder:text-pribega-text-secondary/40 focus:border-pribega-accent focus:outline-none transition-colors resize-none"
                  data-testid="academy-message-input" />
              </div>
              <div className="text-center pt-4">
                <MagneticButton>
                  <button type="submit" disabled={sending}
                    className="bg-pribega-text text-pribega-bg px-12 py-4 font-body text-[10px] uppercase tracking-[0.25em] hover:bg-pribega-accent transition-colors duration-500 disabled:opacity-50"
                    data-testid="academy-submit-button" data-cursor="hover">
                    {sending ? '...' : (isRu ? 'Отправить заявку' : 'Submit Application')}
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
