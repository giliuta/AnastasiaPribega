import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/data/translations';
import { Instagram, Phone, MapPin, Clock } from 'lucide-react';
import { LineReveal } from '@/components/TextReveal';
import MagneticButton from '@/components/MagneticButton';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ContactPage() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post(`${API}/contact`, { ...form, language: lang });
      setSent(true);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error(err);
    }
    setSending(false);
  };

  return (
    <div className="pt-24 md:pt-32" data-testid="contact-page">
      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24">
        <motion.p
          className="font-body text-[10px] uppercase tracking-[0.3em] text-pribega-text-secondary mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {t.contact.title}
        </motion.p>
        <LineReveal>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-pribega-text leading-[0.9]" data-testid="contact-heading">
            PRIBEGA
          </h1>
        </LineReveal>
      </section>

      <section className="px-6 md:px-12 lg:px-24 pb-24 md:pb-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Info */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="font-heading text-base md:text-lg font-light text-pribega-text mb-10">
                {t.contact.studio}
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <MapPin size={15} className="text-pribega-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="font-body text-sm text-pribega-text">{t.contact.location}</p>
                    <p className="font-body text-sm text-pribega-text-secondary">{t.contact.city}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock size={15} className="text-pribega-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary mb-1">{t.contact.hours}</p>
                    <p className="font-body text-sm text-pribega-text">{t.contact.hoursValue}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone size={15} className="text-pribega-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary mb-1">{t.contact.phone}</p>
                    <a href="tel:+35797463797" className="hover-line font-body text-sm text-pribega-text" data-testid="phone-link">
                      +357 97463797
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-5 pt-4">
                  <MagneticButton>
                    <a href="https://www.instagram.com/pribega_brows_paphos" target="_blank" rel="noopener noreferrer"
                      className="text-pribega-text hover:text-pribega-accent transition-colors" data-testid="contact-instagram" data-cursor="hover">
                      <Instagram size={18} />
                    </a>
                  </MagneticButton>
                  <MagneticButton>
                    <a href="https://www.tiktok.com/@pribega_brows" target="_blank" rel="noopener noreferrer"
                      className="text-pribega-text hover:text-pribega-accent transition-colors" data-testid="contact-tiktok" data-cursor="hover">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.87a8.27 8.27 0 0 0 4.76 1.5v-3.4a4.85 4.85 0 0 1-1-.28z"/></svg>
                    </a>
                  </MagneticButton>
                </div>

                <motion.div
                  className="pt-6 border-t border-pribega-border"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="font-body text-[10px] uppercase tracking-[0.2em] text-pribega-accent">
                    {t.contact.limited}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <div className="lg:col-span-6 lg:col-start-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {sent ? (
                <motion.div className="py-20 text-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} data-testid="contact-success">
                  <svg viewBox="0 0 600 60" className="w-full max-w-xs mx-auto mb-10" fill="none">
                    <motion.path d="M0 50 C80 50, 120 8, 200 8 C280 8, 340 25, 400 25 C460 25, 520 35, 600 40" stroke="#A07E66" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }} />
                  </svg>
                  <p className="font-heading text-2xl font-light text-pribega-text">{t.contact.form.success}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-10" data-testid="contact-form">
                  {[
                    { key: 'name', type: 'text', required: true },
                    { key: 'email', type: 'email', required: true },
                    { key: 'phone', type: 'tel', required: false },
                  ].map((field, i) => (
                    <motion.div
                      key={field.key}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.6 }}
                    >
                      <label className="font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary block mb-2">
                        {t.contact.form[field.key]}
                      </label>
                      <input
                        type={field.type}
                        required={field.required}
                        value={form[field.key]}
                        onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                        className="w-full bg-transparent border-b border-pribega-border px-0 py-3 font-body text-sm text-pribega-text focus:border-pribega-accent focus:outline-none transition-colors"
                        data-testid={`contact-${field.key}-input`}
                      />
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    <label className="font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary block mb-2">
                      {t.contact.form.message}
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder={t.contact.form.placeholder}
                      className="w-full bg-transparent border-b border-pribega-border px-0 py-3 font-body text-sm text-pribega-text placeholder:text-pribega-text-secondary/40 focus:border-pribega-accent focus:outline-none transition-colors resize-none"
                      data-testid="contact-message-input"
                    />
                  </motion.div>
                  <MagneticButton>
                    <button
                      type="submit"
                      disabled={sending}
                      className="bg-pribega-text text-pribega-bg px-10 py-4 font-body text-[10px] uppercase tracking-[0.25em] hover:bg-pribega-accent transition-colors duration-500 disabled:opacity-50"
                      data-testid="contact-submit-button"
                      data-cursor="hover"
                    >
                      {sending ? '...' : t.contact.form.send}
                    </button>
                  </MagneticButton>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="w-full" data-testid="map-section">
        <div className="map-grayscale w-full h-80 md:h-[450px]">
          <iframe
            src="https://maps.google.com/maps?q=Lady+Space+Beauty+Coworking+Paphos+Cyprus&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
            referrerPolicy="no-referrer-when-downgrade" title="PRIBEGA Studio Location" data-testid="google-map"
          />
        </div>
      </section>
    </div>
  );
}
