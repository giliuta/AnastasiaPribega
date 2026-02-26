import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/data/translations';
import MagneticButton from '@/components/MagneticButton';
import { LineReveal } from '@/components/TextReveal';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function QuizPage() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const questions = [
    { key: 'face_shape', ...t.quiz.q1 },
    { key: 'brow_density', ...t.quiz.q2 },
    { key: 'desired_effect', ...t.quiz.q3 },
    { key: 'experience', ...t.quiz.q4 },
  ];

  const totalSteps = questions.length;
  const currentQ = questions[step];
  const canNext = answers[currentQ?.key];
  const isLast = step === totalSteps - 1;

  const handleSelect = (value) => {
    setAnswers(prev => ({ ...prev, [currentQ.key]: value }));
  };

  const handleNext = () => {
    if (isLast) submitQuiz();
    else setStep(s => s + 1);
  };

  const submitQuiz = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/quiz`, answers);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setResult({
        recommendation: lang === 'ru'
          ? 'Мы рекомендуем записаться на консультацию для персональной рекомендации.'
          : 'We recommend booking a consultation for a personalized recommendation.',
      });
    }
    setLoading(false);
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="pt-24 md:pt-32 min-h-screen" data-testid="quiz-page">
      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24">
        <motion.p
          className="font-body text-[10px] uppercase tracking-[0.3em] text-pribega-text-secondary mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {lang === 'ru' ? 'Интерактивный подбор' : 'Interactive Selection'}
        </motion.p>
        <LineReveal>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-pribega-text leading-[0.9]" data-testid="quiz-heading">
            {t.quiz.title}
          </h1>
        </LineReveal>
        <motion.p
          className="font-body text-sm text-pribega-text-secondary mt-6 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {t.quiz.subtitle}
        </motion.p>
      </section>

      <section className="px-6 md:px-12 lg:px-24 pb-24 md:pb-36">
        <div className="max-w-2xl">
          {!result ? (
            <>
              {/* Progress */}
              <div className="flex items-center gap-3 mb-16">
                {questions.map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-[2px] flex-1 bg-pribega-border overflow-hidden"
                    data-testid={`progress-step-${i}`}
                  >
                    <motion.div
                      className="h-full bg-pribega-accent"
                      initial={{ width: '0%' }}
                      animate={{ width: i <= step ? '100%' : '0%' }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </motion.div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="font-body text-[10px] text-pribega-text-secondary mb-3 tracking-[0.2em]">
                    {String(step + 1).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
                  </p>
                  <h2 className="font-heading text-2xl md:text-3xl font-light text-pribega-text mb-10">
                    {currentQ.title}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentQ.options.map((opt, i) => (
                      <motion.button
                        key={opt.value}
                        onClick={() => handleSelect(opt.value)}
                        className={`quiz-option px-6 py-6 text-left ${answers[currentQ.key] === opt.value ? 'selected' : ''}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.5 }}
                        data-testid={`quiz-option-${opt.value}`}
                       
                      >
                        <span className="font-body text-[10px] text-pribega-text-secondary tracking-[0.15em] block mb-1">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="font-body text-sm text-pribega-text tracking-wide">
                          {opt.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>

                  <div className="flex items-center gap-6 mt-14">
                    {step > 0 && (
                      <button
                        onClick={() => setStep(s => s - 1)}
                        className="hover-line font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary"
                        data-testid="quiz-prev-button"
                       
                      >
                        {t.quiz.prev}
                      </button>
                    )}
                    <MagneticButton>
                      <button
                        onClick={handleNext}
                        disabled={!canNext || loading}
                        className="bg-pribega-text text-pribega-bg px-10 py-4 font-body text-[10px] uppercase tracking-[0.25em] hover:bg-pribega-accent transition-colors duration-500 disabled:opacity-20"
                        data-testid="quiz-next-button"
                       
                      >
                        {loading ? '...' : isLast ? t.quiz.finish : t.quiz.next}
                      </button>
                    </MagneticButton>
                  </div>
                </motion.div>
              </AnimatePresence>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              data-testid="quiz-result"
            >
              <svg viewBox="0 0 600 60" className="w-full max-w-sm mb-14" fill="none">
                <motion.path
                  d="M0 50 C80 50, 120 8, 200 8 C280 8, 340 25, 400 25 C460 25, 520 35, 600 40"
                  stroke="#A07E66"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>

              <p className="font-body text-[10px] uppercase tracking-[0.3em] text-pribega-accent mb-6">
                {t.quiz.result}
              </p>

              <p className="font-heading text-base md:text-lg font-light text-pribega-text leading-relaxed">
                {result.recommendation}
              </p>

              <div className="flex items-center gap-6 mt-14">
                <MagneticButton>
                  <Link
                    to="/contact"
                    className="bg-pribega-text text-pribega-bg px-10 py-4 font-body text-[10px] uppercase tracking-[0.25em] hover:bg-pribega-accent transition-colors duration-500"
                    data-testid="quiz-book-button"
                   
                  >
                    {t.quiz.bookNow}
                  </Link>
                </MagneticButton>
                <button
                  onClick={restart}
                  className="hover-line font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary"
                  data-testid="quiz-restart-button"
                 
                >
                  {t.quiz.restart}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
