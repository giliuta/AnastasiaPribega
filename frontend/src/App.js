import { useEffect, useState, useCallback } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Layout from "@/components/Layout";
import Preloader from "@/components/Preloader";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ServicesPage from "@/pages/ServicesPage";
import AcademyPage from "@/pages/AcademyPage";
import ContactPage from "@/pages/ContactPage";
import AdminPage from "@/pages/AdminPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  // Admin page without Layout
  if (isAdmin) {
    return <AdminPage />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/academy" element={<AcademyPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const [loaded, setLoaded] = useState(false);
  const handleComplete = useCallback(() => setLoaded(true), []);
  const location = window.location.pathname;
  const isAdmin = location === '/admin';

  return (
    <LanguageProvider>
      <BrowserRouter>
        {!loaded && !isAdmin && <Preloader onComplete={handleComplete} />}
        <ScrollToTop />
        {isAdmin ? (
          <AnimatedRoutes />
        ) : (
          <Layout>
            <AnimatedRoutes />
          </Layout>
        )}
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
