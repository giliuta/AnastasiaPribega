import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/data/translations';
import { ArrowDown, Instagram, Star, Clock, Users, Award, Send, Sparkles, Phone, MapPin, MessageCircle } from 'lucide-react';
import MagneticButton from '@/components/MagneticButton';
import { TextReveal } from '@/components/TextReveal';
import Marquee from '@/components/Marquee';
import axios from 'axios';

const HERO_VIDEO = 'https://customer-assets.emergentagent.com/job_47f6f644-e94f-410b-9ee0-18b3ab243391/artifacts/q9bjmbbj_IMG_7319.MP4';
const BASE = 'https://customer-assets.emergentagent.com/job_arch-beauty-lab/artifacts/';

const PORTFOLIO_MEDIA = [
  { type: 'img', src: `${BASE}pvqmbogu_pribega_brows_paphos_1728495274_3475192696521688954_7225780068.jpg` },
  { type: 'img', src: `${BASE}x5yz2093_pribega_brows_paphos_1735906546_3537362954963173178_7225780068.jpg` },
  { type: 'vid', src: `${BASE}2cjp4h54_pribega_brows_paphos_1744024220_3605458598025928199_7225780068.mp4` },
  { type: 'img', src: `${BASE}nh1rw38t_pribega_brows_paphos_1742551484_3593104735692336233_7225780068.jpg` },
  { type: 'img', src: `${BASE}03wjrhrp_pribega_brows_paphos_1746122179_3623057898775781846_7225780068.jpg` },
  { type: 'img', src: `${BASE}zvwydfwn_pribega_brows_paphos_1746606220_3627118329668659589_7225780068.jpg` },
  { type: 'vid', src: `${BASE}5ca010zd_pribega_brows_paphos_1745825571_3620569690473332598_7225780068.mp4` },
  { type: 'img', src: `${BASE}8qaolxc5_pribega_brows_paphos_1747055311_3630885575490620422_7225780068.jpg` },
  { type: 'img', src: `${BASE}rt4ac7nu_pribega_brows_paphos_1747912864_3638079246262784202_7225780068.jpg` },
  { type: 'img', src: `${BASE}27kwzn5v_pribega_brows_paphos_1751438010_3667650317538195564_7225780068.jpg` },
  { type: 'vid', src: `${BASE}o78ih1v5_pribega_brows_paphos_1748251085_3640915937742678132_7225780068.mp4` },
  { type: 'img', src: `${BASE}adtzj41v_pribega_brows_paphos_1755161280_3698883372948880331_7225780068.jpg` },
  { type: 'img', src: `${BASE}b1hm6e36_pribega_brows_paphos_1755248655_3699616324947209652_7225780068.jpg` },
  { type: 'img', src: `${BASE}fbh4bs1b_pribega_brows_paphos_1756204128_3707631417343088414_7225780068.jpg` },
  { type: 'img', src: `${BASE}7uytkg8w_pribega_brows_paphos_1757324649_3717031024350748519_7225780068.jpg` },
  { type: 'img', src: `${BASE}hj6wj4q9_pribega_brows_paphos_1758702170_3728586510959151692_7225780068.jpg` },
  { type: 'img', src: `${BASE}eq761617_pribega_brows_paphos_1759490047_3735195701098377478_7225780068.jpg` },
];

const INSTA_PHOTOS = PORTFOLIO_MEDIA.filter(m => m.type === 'img').slice(0, 8);
const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const REVIEWS = {
  ru: [
    { text: 'Лучшие брови в Пафосе! Анастасия создала идеальную форму, которая подчёркивает мои черты лица. Теперь только к ней!', author: 'Мария К.' },
    { text: 'Профессионализм на высшем уровне. После ламинирования мои брови выглядят естественно и ухоженно уже 2 месяца.', author: 'Елена С.' },
    { text: 'Наконец-то нашла мастера, которому доверяю полностью. Результат всегда превосходит ожидания. Рекомендую всем!', author: 'Анна В.' },
  ],
  en: [
    { text: 'Best brows in Paphos! Anastasia created the perfect shape that accentuates my facial features. Only her from now on!', author: 'Maria K.' },
    { text: 'Top-level professionalism. After lamination, my brows look natural and polished for 2 months already.', author: 'Elena S.' },
    { text: 'Finally found a master I trust completely. The result always exceeds expectations. Recommend to everyone!', author: 'Anna V.' },
  ],
};

function Counter({ target, suffix = '', duration = 2 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    let start = 0; const end = parseInt(target);
    const step = Math.max(1, Math.floor(end / (duration * 60)));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); } else setCount(start);
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);
  return <span ref={ref} className="counter-number">{count}{suffix}</span>;
}

/* ========== HERO ========== */
function HeroSection({ t }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden" data-testid="hero-section">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover" data-testid="hero-video">
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <div className="hero-overlay absolute inset-0" />
      </motion.div>
      <motion.div style={{ opacity }} className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
        <motion.p className="font-body text-[10px] sm:text-xs uppercase tracking-[0.4em] text-white/40 mb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1 }}>
          {t.hero.appointment}
        </motion.p>
        <div className="overflow-hidden">
          <motion.h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-light text-white tracking-[0.15em] leading-[0.85]"
            initial={{ y: '100%' }} animate={{ y: '0%' }} transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            data-testid="hero-title">
            PRIBEGA
          </motion.h1>
        </div>
        <motion.div className="flex items-center gap-4 mt-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}>
          <div className="w-10 h-[1px] bg-white/25" />
          <p className="font-body text-xs sm:text-sm uppercase tracking-[0.3em] text-white/50">{t.hero.subtitle}</p>
          <div className="w-10 h-[1px] bg-white/25" />
        </motion.div>
      </motion.div>
      <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 scroll-indicator"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}>
        <ArrowDown size={16} className="text-white/25" />
      </motion.div>
    </section>
  );
}

/* ========== WHY STATS ========== */
function WhyStats({ lang }) {
  const items = lang === 'ru' ? [
    { icon: Clock, num: 7, suffix: '+', label: 'Лет опыта' },
    { icon: Users, num: 1000, suffix: '+', label: 'Довольных клиентов' },
    { icon: Award, num: 1, suffix: '', label: 'Индивидуальный подход' },
  ] : [
    { icon: Clock, num: 7, suffix: '+', label: 'Years Experience' },
    { icon: Users, num: 1000, suffix: '+', label: 'Happy Clients' },
    { icon: Award, num: 1, suffix: '', label: 'Individual Approach' },
  ];
  return (
    <section className="px-6 md:px-12 lg:px-24 py-20 md:py-28 bg-pribega-surface" data-testid="why-section">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        {items.map((item, i) => (
          <motion.div key={i} className="text-center"
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
            <item.icon size={18} className="text-pribega-accent mx-auto mb-3" />
            <p className="font-heading text-5xl sm:text-6xl font-light text-pribega-text">
              <Counter target={item.num} suffix={item.suffix} />
            </p>
            <p className="font-body text-[10px] uppercase tracking-[0.25em] text-pribega-text-secondary mt-3">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ========== QUIZ BUTTON ========== */
function QuizButton({ lang }) {
  return (
    <section className="px-6 md:px-12 lg:px-24 py-14 md:py-18 text-center" data-testid="quiz-button-section">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <MagneticButton>
          <Link to="/quiz"
            className="inline-flex items-center gap-3 border border-pribega-accent px-10 py-4 font-body text-[10px] uppercase tracking-[0.25em] text-pribega-accent hover:bg-pribega-accent hover:text-pribega-bg transition-all duration-500"
            data-testid="quiz-cta-button" data-cursor="hover">
            <Sparkles size={14} />
            {lang === 'ru' ? 'Подобрать форму бровей' : 'Find your brow shape'}
          </Link>
        </MagneticButton>
      </motion.div>
    </section>
  );
}

/* ========== FULL SERVICES ========== */
function FullServices({ t }) {
  const s = t.services;
  const categories = [
    { title: s.brows.title, items: s.brows.items },
    { title: s.lashes.title, items: s.lashes.items },
    { title: s.complex.title, items: s.complex.items },
    { title: s.additional.title, items: s.additional.items },
  ];
  return (
    <section className="px-6 md:px-12 lg:px-24 py-20 md:py-28" data-testid="services-full-section">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-14">
        {categories.map((cat, ci) => (
          <motion.div key={ci} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: ci * 0.1, duration: 0.7 }}>
            <h3 className="font-heading text-2xl font-light text-pribega-text mb-6">{cat.title}</h3>
            {cat.items.map((item, i) => (
              <div key={i} className="service-item flex justify-between items-baseline py-4 border-b border-pribega-border group">
                <div className="flex items-baseline gap-3">
                  <span className="font-body text-[10px] text-pribega-border group-hover:text-pribega-accent transition-colors">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-body text-sm text-pribega-text">{item.name}</span>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <div className="hidden md:block w-12 h-[1px] bg-pribega-border group-hover:bg-pribega-accent group-hover:w-20 transition-all duration-500" />
                  <span className="font-heading text-lg text-pribega-text whitespace-nowrap">{item.price}</span>
                </div>
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ========== PORTFOLIO MARQUEE ========== */
function PortfolioMarquee() {
  return (
    <section className="py-12 md:py-16 bg-pribega-surface overflow-hidden" data-testid="portfolio-section">
      <div className="media-marquee-wrapper mb-4">
        <div className="media-marquee-track" style={{ animationDuration: '80s' }}>
          {[...PORTFOLIO_MEDIA.slice(0, 9), ...PORTFOLIO_MEDIA.slice(0, 9)].map((item, i) => (
            <div key={i} className="shrink-0 w-[160px] h-[160px] md:w-[200px] md:h-[200px] mx-1.5 overflow-hidden rounded-sm">
              {item.type === 'img' ? (
                <img src={item.src} alt="PRIBEGA" className="w-full h-full object-cover gallery-img" loading="lazy" />
              ) : (
                <video autoPlay muted loop playsInline className="w-full h-full object-cover"><source src={item.src} type="video/mp4" /></video>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="media-marquee-wrapper">
        <div className="media-marquee-track-reverse" style={{ animationDuration: '90s' }}>
          {[...PORTFOLIO_MEDIA.slice(8), ...PORTFOLIO_MEDIA.slice(8)].map((item, i) => (
            <div key={i} className="shrink-0 w-[160px] h-[160px] md:w-[200px] md:h-[200px] mx-1.5 overflow-hidden rounded-sm">
              {item.type === 'img' ? (
                <img src={item.src} alt="PRIBEGA" className="w-full h-full object-cover gallery-img" loading="lazy" />
              ) : (
                <video autoPlay muted loop playsInline className="w-full h-full object-cover"><source src={item.src} type="video/mp4" /></video>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== REVIEWS ========== */
function ReviewsSection({ lang }) {
  const reviews = REVIEWS[lang];
  return (
    <section className="px-6 md:px-12 lg:px-24 py-20 md:py-28" data-testid="reviews-section">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((review, i) => (
          <motion.div key={i} className="border-t border-pribega-border pt-8"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <div className="flex gap-1 mb-5">
              {[...Array(5)].map((_, j) => <Star key={j} size={11} className="fill-pribega-accent text-pribega-accent" />)}
            </div>
            <p className="font-heading text-base font-light text-pribega-text leading-relaxed italic mb-6">
              &ldquo;{review.text}&rdquo;
            </p>
            <p className="font-body text-xs uppercase tracking-[0.2em] text-pribega-text-secondary">&mdash; {review.author}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ========== CONTACT SECTION ========== */
function ContactSection({ lang }) {
  const [form, setForm] = useState({ name: '', phone: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const isRu = lang === 'ru';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post(`${API_URL}/contact`, { ...form, language: lang });
      setSent(true);
      setForm({ name: '', phone: '' });
    } catch (err) { console.error(err); }
    setSending(false);
  };

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/pribega_brows_paphos', label: 'Instagram' },
    { icon: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>, href: 'https://www.tiktok.com/@pribega_brows', label: 'TikTok' },
    { icon: Phone, href: 'tel:+35797463797', label: 'Phone' },
    { icon: MessageCircle, href: 'https://wa.me/35797463797', label: 'WhatsApp' },
    { icon: MapPin, href: 'https://maps.app.goo.gl/ipeyHYpxMbJ33gEAA', label: 'Location' },
  ];

  return (
    <section className="px-6 md:px-12 lg:px-24 py-20 md:py-28 bg-pribega-surface" data-testid="booking-form-section">
      <div className="max-w-5xl mx-auto">
        {/* Social Links Row */}
        <motion.div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-16"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          {socialLinks.map((link, i) => (
            <motion.a key={link.label} href={link.href} target={link.href.startsWith('tel') ? '_self' : '_blank'}
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-pribega-text-secondary hover:text-pribega-accent transition-all duration-300"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              data-testid={`social-${link.label.toLowerCase()}`} data-cursor="hover">
              <span className="w-10 h-10 rounded-full border border-pribega-border group-hover:border-pribega-accent flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <link.icon size={16} />
              </span>
              <span className="font-body text-xs uppercase tracking-[0.15em] hidden sm:block">{link.label}</span>
            </motion.a>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left — Info & Hours */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8 }}>
            <p className="font-heading text-3xl sm:text-4xl lg:text-5xl font-light text-pribega-text leading-[1.1]">
              {isRu ? 'Оставить заявку' : 'Book appointment'}
            </p>
            
            {/* Creative Working Hours */}
            <div className="mt-10 relative">
              <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-pribega-accent via-pribega-accent/50 to-transparent" />
              <div className="space-y-4 pl-6">
                <div className="flex items-baseline gap-4">
                  <span className="font-heading text-5xl sm:text-6xl font-light text-pribega-accent">08</span>
                  <span className="font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary">:00</span>
                </div>
                <div className="w-8 h-[1px] bg-pribega-border" />
                <div className="flex items-baseline gap-4">
                  <span className="font-heading text-5xl sm:text-6xl font-light text-pribega-text">20</span>
                  <span className="font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary">:00</span>
                </div>
                <p className="font-body text-xs text-pribega-text-secondary uppercase tracking-[0.15em] pt-2">
                  {isRu ? 'Ежедневно' : 'Daily'}
                </p>
              </div>
            </div>

            {/* Phone */}
            <motion.a href="tel:+35797463797" 
              className="inline-flex items-center gap-3 mt-10 group"
              whileHover={{ x: 5 }}
              data-testid="contact-phone-link" data-cursor="hover">
              <span className="w-12 h-12 rounded-full bg-pribega-text text-pribega-bg flex items-center justify-center group-hover:bg-pribega-accent transition-colors duration-300">
                <Phone size={18} />
              </span>
              <span className="font-heading text-xl sm:text-2xl text-pribega-text group-hover:text-pribega-accent transition-colors">
                +357 97 463 797
              </span>
            </motion.a>
          </motion.div>

          {/* Right — Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}>
            {sent ? (
              <motion.div className="text-center py-12" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                data-testid="booking-success">
                <motion.div className="w-16 h-[1px] bg-pribega-accent mx-auto mb-6"
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8 }} />
                <p className="font-heading text-2xl font-light text-pribega-text">
                  {isRu ? 'Спасибо!' : 'Thank you!'}
                </p>
                <p className="font-body text-sm text-pribega-text-secondary mt-3">
                  {isRu ? 'Мы свяжемся с вами' : 'We will contact you'}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" data-testid="booking-form">
                <div>
                  <label className="font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary block mb-2">
                    {isRu ? 'Имя' : 'Name'}
                  </label>
                  <input type="text" required value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-pribega-bg/60 border border-pribega-border px-5 py-4 font-body text-sm text-pribega-text focus:border-pribega-accent focus:outline-none transition-colors"
                    data-testid="booking-name-input" />
                </div>
                <div>
                  <label className="font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary block mb-2">
                    {isRu ? 'Телефон' : 'Phone'}
                  </label>
                  <input type="tel" required value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="+357"
                    className="w-full bg-pribega-bg/60 border border-pribega-border px-5 py-4 font-body text-sm text-pribega-text placeholder:text-pribega-text-secondary/30 focus:border-pribega-accent focus:outline-none transition-colors"
                    data-testid="booking-phone-input" />
                </div>
                <MagneticButton>
                  <button type="submit" disabled={sending}
                    className="w-full bg-pribega-text text-pribega-bg py-4 font-body text-[10px] uppercase tracking-[0.25em] hover:bg-pribega-accent transition-colors duration-500 disabled:opacity-50 flex items-center justify-center gap-2"
                    data-testid="booking-submit-button" data-cursor="hover">
                    <Send size={12} />
                    {sending ? '...' : (isRu ? 'Записаться' : 'Book')}
                  </button>
                </MagneticButton>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ========== INSTAGRAM ========== */
function InstagramGrid() {
  return (
    <section className="px-6 md:px-12 lg:px-24 py-16 md:py-20" data-testid="instagram-section">
      <div className="flex justify-center mb-8">
        <MagneticButton>
          <a href="https://www.instagram.com/pribega_brows_paphos" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.25em] text-pribega-text-secondary hover:text-pribega-accent transition-colors"
            data-testid="instagram-follow-link" data-cursor="hover">
            <Instagram size={14} />
            @pribega_brows_paphos
          </a>
        </MagneticButton>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {INSTA_PHOTOS.map((photo, i) => (
          <motion.a key={i} href="https://www.instagram.com/pribega_brows_paphos" target="_blank" rel="noopener noreferrer"
            className="relative group overflow-hidden aspect-square"
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.5 }}>
            <img src={photo.src} alt="PRIBEGA" className="w-full h-full object-cover gallery-img" loading="lazy" />
            <div className="absolute inset-0 bg-pribega-text/0 group-hover:bg-pribega-text/20 transition-all duration-500 flex items-center justify-center">
              <Instagram size={18} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

/* ========== ACADEMY BUTTON ========== */
function AcademyButton({ lang }) {
  return (
    <section className="px-6 md:px-12 lg:px-24 py-16 md:py-20 text-center bg-pribega-surface" data-testid="academy-button-section">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <MagneticButton>
          <Link to="/academy"
            className="inline-block border border-pribega-text px-12 py-5 font-body text-[10px] uppercase tracking-[0.3em] text-pribega-text hover:bg-pribega-text hover:text-pribega-bg transition-all duration-500"
            data-testid="academy-button" data-cursor="hover">
            PRIBEGA ACADEMY
          </Link>
        </MagneticButton>
      </motion.div>
    </section>
  );
}

/* ========== MAIN ========== */
export default function HomePage() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <div data-testid="home-page">
      <HeroSection t={t} />
      <Marquee items={['PRECISION', 'BALANCE', 'ELEVATION', 'PRIBEGA', 'THE STANDARD OF BEAUTY']} speed={50} />
      <WhyStats lang={lang} />
      <QuizButton lang={lang} />
      <FullServices t={t} />
      <PortfolioMarquee />
      <ReviewsSection lang={lang} />
      <BookingForm lang={lang} />
      <InstagramGrid />
      <AcademyButton lang={lang} />
    </div>
  );
}
