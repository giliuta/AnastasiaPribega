import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/data/translations';
import { Instagram, Phone, MapPin, Clock } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
};

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
          className="font-body text-xs uppercase tracking-[0.2em] text-pribega-text-secondary mb-4"
          {...fadeUp}
        >
          {t.contact.title}
        </motion.p>
        <motion.h1
          className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-pribega-text leading-[0.9]"
          {...fadeUp}
          data-testid="contact-heading"
        >
          PRIBEGA
        </motion.h1>
      </section>

      <section className="px-6 md:px-12 lg:px-24 pb-24 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Info */}
          <div className="lg:col-span-5">
            <motion.div {...fadeUp}>
              <p className="font-heading text-base md:text-lg font-light text-pribega-text mb-8">
                {t.contact.studio}
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-pribega-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="font-body text-sm text-pribega-text">{t.contact.location}</p>
                    <p className="font-body text-sm text-pribega-text-secondary">{t.contact.city}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-pribega-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="font-body text-xs uppercase tracking-[0.15em] text-pribega-text-secondary mb-1">{t.contact.hours}</p>
                    <p className="font-body text-sm text-pribega-text">{t.contact.hoursValue}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-pribega-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="font-body text-xs uppercase tracking-[0.15em] text-pribega-text-secondary mb-1">{t.contact.phone}</p>
                    <a
                      href="tel:+35797463797"
                      className="font-body text-sm text-pribega-text hover:text-pribega-accent transition-colors"
                      data-testid="phone-link"
                    >
                      +357 97463797
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <a
                    href="https://www.instagram.com/pribega_brows_paphos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pribega-text hover:text-pribega-accent transition-colors"
                    data-testid="contact-instagram"
                    data-cursor="hover"
                  >
                    <Instagram size={18} />
                  </a>
                  <a
                    href="https://www.tiktok.com/@pribega_brows"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pribega-text hover:text-pribega-accent transition-colors"
                    data-testid="contact-tiktok"
                    data-cursor="hover"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.87a8.27 8.27 0 0 0 4.76 1.5v-3.4a4.85 4.85 0 0 1-1-.28z"/></svg>
                  </a>
                </div>

                <div className="pt-4 border-t border-pribega-border mt-6">
                  <p className="font-body text-xs uppercase tracking-[0.15em] text-pribega-accent">
                    {t.contact.limited}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <div className="lg:col-span-6 lg:col-start-7">
            <motion.div {...fadeUp}>
              {sent ? (
                <motion.div
                  className="py-16 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  data-testid="contact-success"
                >
                  <p className="font-heading text-2xl font-light text-pribega-text mb-4">
                    {t.contact.form.success}
                  </p>
                  <svg viewBox="0 0 600 60" className="w-full max-w-xs mx-auto mt-8" fill="none">
                    <motion.path
                      d="M0 50 C80 50, 120 8, 200 8 C280 8, 340 25, 400 25 C460 25, 520 35, 600 40"
                      stroke="#A07E66"
                      strokeWidth="1"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2 }}
                    />
                  </svg>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8" data-testid="contact-form">
                  <div>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder={t.contact.form.name}
                      className="w-full bg-transparent border-b border-pribega-border px-0 py-4 font-body text-sm text-pribega-text placeholder:text-pribega-text-secondary/50 focus:border-pribega-accent focus:outline-none transition-colors"
                      data-testid="contact-name-input"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder={t.contact.form.email}
                      className="w-full bg-transparent border-b border-pribega-border px-0 py-4 font-body text-sm text-pribega-text placeholder:text-pribega-text-secondary/50 focus:border-pribega-accent focus:outline-none transition-colors"
                      data-testid="contact-email-input"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder={t.contact.form.phone}
                      className="w-full bg-transparent border-b border-pribega-border px-0 py-4 font-body text-sm text-pribega-text placeholder:text-pribega-text-secondary/50 focus:border-pribega-accent focus:outline-none transition-colors"
                      data-testid="contact-phone-input"
                    />
                  </div>
                  <div>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder={t.contact.form.placeholder}
                      className="w-full bg-transparent border-b border-pribega-border px-0 py-4 font-body text-sm text-pribega-text placeholder:text-pribega-text-secondary/50 focus:border-pribega-accent focus:outline-none transition-colors resize-none"
                      data-testid="contact-message-input"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="bg-pribega-text text-pribega-bg px-10 py-4 font-body text-xs uppercase tracking-[0.2em] hover:bg-pribega-accent transition-colors duration-300 disabled:opacity-50"
                    data-testid="contact-submit-button"
                    data-cursor="hover"
                  >
                    {sending ? '...' : t.contact.form.send}
                  </button>
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
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="PRIBEGA Studio Location"
            data-testid="google-map"
          />
        </div>
      </section>
    </div>
  );
}
