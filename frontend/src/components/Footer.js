import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/data/translations';
import { Instagram } from 'lucide-react';

export default function Footer() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const year = new Date().getFullYear();

  return (
    <footer className="bg-pribega-bg border-t border-pribega-border" data-testid="footer">
      <div className="px-6 md:px-12 lg:px-24 py-16 md:py-24">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div>
            <Link to="/" className="font-heading text-2xl tracking-[0.15em] font-light text-pribega-text" data-testid="footer-logo">
              PRIBEGA
            </Link>
            <p className="font-body text-xs tracking-[0.15em] uppercase text-pribega-text-secondary mt-3">
              {t.footer.tagline}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-12 md:gap-20">
            <div>
              <p className="font-body text-xs uppercase tracking-[0.2em] text-pribega-text-secondary mb-4">Menu</p>
              <nav className="flex flex-col gap-3">
                <Link to="/" className="font-body text-sm text-pribega-text hover:text-pribega-accent transition-colors" data-testid="footer-link-home">{t.nav.home}</Link>
                <Link to="/about" className="font-body text-sm text-pribega-text hover:text-pribega-accent transition-colors" data-testid="footer-link-about">{t.nav.about}</Link>
                <Link to="/services" className="font-body text-sm text-pribega-text hover:text-pribega-accent transition-colors" data-testid="footer-link-services">{t.nav.services}</Link>
                <Link to="/academy" className="font-body text-sm text-pribega-text hover:text-pribega-accent transition-colors" data-testid="footer-link-academy">{t.nav.academy}</Link>
                <Link to="/contact" className="font-body text-sm text-pribega-text hover:text-pribega-accent transition-colors" data-testid="footer-link-contact">{t.nav.contact}</Link>
              </nav>
            </div>

            <div>
              <p className="font-body text-xs uppercase tracking-[0.2em] text-pribega-text-secondary mb-4">Social</p>
              <div className="flex flex-col gap-3">
                <a
                  href="https://www.instagram.com/pribega_brows_paphos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-pribega-text hover:text-pribega-accent transition-colors flex items-center gap-2"
                  data-testid="footer-instagram"
                >
                  <Instagram size={14} />
                  Instagram
                </a>
                <a
                  href="https://www.tiktok.com/@pribega_brows"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-pribega-text hover:text-pribega-accent transition-colors flex items-center gap-2"
                  data-testid="footer-tiktok"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.87a8.27 8.27 0 0 0 4.76 1.5v-3.4a4.85 4.85 0 0 1-1-.28z"/></svg>
                  TikTok
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-pribega-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-pribega-text-secondary tracking-wide">
            &copy; {year} PRIBEGA. {t.footer.rights}
          </p>
          <p className="font-body text-xs text-pribega-text-secondary tracking-wide">
            Paphos, Cyprus
          </p>
        </div>
      </div>
    </footer>
  );
}
