import { ReactLenis } from '@studio-freight/react-lenis';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';

export default function Layout({ children }) {
  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}>
      <CustomCursor />
      <div className="noise-overlay" />
      <Navigation />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </ReactLenis>
  );
}
