import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/data/translations';
// icons removed

const navLinks = [
  { path: '/', key: 'home' },
  { path: '/about', key: 'about' },
  { path: '/services', key: 'services' },
  { path: '/academy', key: 'academy' },
  { path: '/contact', key: 'contact' },
];

export default function Navigation() {
  const { lang, toggleLanguage } = useLanguage();
  const t = translations[lang];
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [soundPlayed, setSoundPlayed] = useState(false);
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const playChime = () => {
    if (soundPlayed || !soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 830;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.8);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.frequency.value = 1245;
      osc2.type = 'sine';
      gain2.gain.setValueAtTime(0.03, ctx.currentTime + 0.3);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
      osc2.start(ctx.currentTime + 0.3);
      osc2.stop(ctx.currentTime + 2);
      setSoundPlayed(true);
    } catch (e) { /* silent fail */ }
  };

  useEffect(() => {
    if (soundEnabled && !soundPlayed) {
      const handler = () => { playChime(); window.removeEventListener('click', handler); };
      window.addEventListener('click', handler);
      return () => window.removeEventListener('click', handler);
    }
  });

  const navBg = isHome && !scrolled
    ? 'bg-transparent'
    : 'bg-pribega-bg/90 backdrop-blur-md';

  const textColor = isHome && !scrolled
    ? 'text-white'
    : 'text-pribega-text';

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${navBg} ${isHome && !scrolled ? 'mix-blend-exclusion' : ''}`}
        data-testid="main-navigation"
      >
        <nav className="flex items-center justify-between px-6 md:px-12 lg:px-24 py-5 md:py-6">
          <Link
            to="/"
            className={`font-heading text-xl md:text-2xl tracking-[0.15em] font-light ${isHome && !scrolled ? 'text-white' : textColor} transition-colors duration-300`}
            data-testid="nav-logo"
          >
            PRIBEGA
          </Link>

          <div className={`hidden lg:flex items-center gap-10 ${isHome && !scrolled ? 'text-white' : textColor}`}>
            {navLinks.map(link => (
              <Link
                key={link.key}
                to={link.path}
                className={`font-body text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:opacity-60 ${
                  location.pathname === link.path ? 'opacity-100' : 'opacity-70'
                }`}
                data-testid={`nav-link-${link.key}`}
              >
                {t.nav[link.key]}
              </Link>
            ))}
            <Link
              to="/quiz"
              className={`font-body text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:opacity-60 border-b pb-0.5 ${
                isHome && !scrolled ? 'border-white/40' : 'border-pribega-accent'
              } ${location.pathname === '/quiz' ? 'opacity-100' : 'opacity-70'}`}
              data-testid="nav-link-quiz"
            >
              {t.nav.quiz}
            </Link>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`${isHome && !scrolled ? 'text-white' : textColor} opacity-50 hover:opacity-100 transition-opacity`}
              data-testid="sound-toggle"
              aria-label="Toggle sound"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            <button
              onClick={toggleLanguage}
              className={`font-body text-xs uppercase tracking-[0.2em] ${isHome && !scrolled ? 'text-white' : textColor} opacity-70 hover:opacity-100 transition-opacity`}
              data-testid="language-toggle"
              data-cursor="hover"
            >
              {lang === 'ru' ? 'EN' : 'RU'}
            </button>

            <button
              onClick={() => setMenuOpen(true)}
              className={`lg:hidden ${isHome && !scrolled ? 'text-white' : textColor}`}
              data-testid="menu-toggle"
              aria-label="Open menu"
            >
              <div className="flex flex-col gap-1.5">
                <span className="block w-6 h-[1px] bg-current" />
                <span className="block w-4 h-[1px] bg-current" />
              </div>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-pribega-bg flex flex-col justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            data-testid="mobile-menu"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-5 right-6 text-pribega-text"
              data-testid="menu-close"
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <line x1="4" y1="4" x2="20" y2="20" />
                <line x1="20" y1="4" x2="4" y2="20" />
              </svg>
            </button>

            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.key}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className="font-heading text-4xl sm:text-5xl font-light text-pribega-text tracking-wide hover:text-pribega-accent transition-colors"
                    data-testid={`mobile-nav-${link.key}`}
                  >
                    {t.nav[link.key]}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Link
                  to="/quiz"
                  onClick={() => setMenuOpen(false)}
                  className="font-body text-sm uppercase tracking-[0.2em] text-pribega-accent mt-8 border-b border-pribega-accent pb-1"
                  data-testid="mobile-nav-quiz"
                >
                  {t.nav.quiz}
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
