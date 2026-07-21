import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { ArrowRight, Check, Leaf, Shield, ChevronDown, Star } from 'lucide-react';

const CLEANSE_URL = 'https://kaimakana.gumroad.com/l/qdxegm';
const BUNDLE_URL = 'https://kaimakana.gumroad.com/l/xaeewz';
const BLUEPRINT_URL = 'https://kaimakana.gumroad.com/l/sbmvnn';
const BEEHIIV_FORM_ID = '0917a56b-b200-4d24-99b9-7ea5f5dd9c33';
const CLEANSE_PRICE = 39;
const BUNDLE_PRICE = 49;
const BLUEPRINT_PRICE = 14.99;

const DAYS = [
  { n: '01', title: 'Inflammation Reset', line: 'Day one quiets the background fire so energy and recovery can return.', result: 'Result: more energy, less brain fog' },
  { n: '02', title: 'Cholesterol Block', line: 'Day two targets the buildup that slows your system over time.', result: 'Result: feeling lighter, less sluggish' },
  { n: '03', title: 'Circulation Boost', line: 'Day three opens flow so nutrients and oxygen actually reach your cells.', result: 'Result: warmth and alertness returning' },
  { n: '04', title: 'Liver Support', line: 'Day four backs the filter that clears what you eat, drink, and absorb.', result: 'Result: clearer skin, better digestion' },
  { n: '05', title: 'Kidney Cleanse', line: 'Day five finishes the reset by supporting how your body flushes waste.', result: 'Result: the reset feels complete — lighter and clearer' },
];

const INCLUDED = [
  '5 HD video lessons with cinematic B-roll',
  'Exact ingredients + amounts for each day',
  'Why timing matters — not just recipes',
  'Instant digital access after purchase',
  'Watch on phone, tablet, or desktop',
  'One-time $39 — no subscription',
];

const FAQS = [
  { q: 'What exactly is the 5-Day Full Body Cleanse?', a: 'Five short video lessons — about 9 minutes total — each targeting one body system in order. You get exact ingredients, amounts, and timing. All kitchen ingredients, no supplements.' },
  { q: 'How long does each day take?', a: 'Each video is under 2 minutes. The remedy itself takes 5–15 minutes to prepare depending on the day. Designed to fit into a normal routine.' },
  { q: 'What if I miss a day or want to repeat it?', a: 'You keep the videos forever. Start when you want, repeat the protocol whenever you need a reset. No pressure, no deadlines.' },
  { q: 'Do I need special equipment or supplements?', a: 'No. Every ingredient is something you can find in a normal grocery store — lemons, cucumber, celery, oats, beets, ginger. Nothing exotic.' },
  { q: 'Is this a medical treatment?', a: 'No. This is educational wellness content based on natural remedies. It does not replace medical advice, diagnosis, or treatment from a qualified healthcare professional.' },
  { q: 'What if I\'m not satisfied?', a: 'We offer a 7-day refund window. If the lessons aren\'t what you expected, email us and we\'ll refund your purchase — no questions asked.' },
];

function track(event: string, label: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event, {
      event_category: 'engagement',
      event_label: label,
    });
  }
}

function useBeehiiv(containerId: string) {
  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (container.querySelector('script[data-beehiiv-form]')) return;

    const script = document.createElement('script');
    script.src = 'https://subscribe-forms.beehiiv.com/v3/loader.js';
    script.setAttribute('data-beehiiv-form', BEEHIIV_FORM_ID);
    script.async = true;
    container.appendChild(script);

    return () => {
      if (script.parentNode === container) container.removeChild(script);
    };
  }, [containerId]);
}

function PrimaryButton({
  href,
  children,
  className = '',
  label,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <a
      href={href}
      onClick={() => track('gumroad_click', label)}
      className={`inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-ink bg-accent hover:bg-white rounded-full transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:scale-[1.02] active:scale-[0.99] ${className}`}
    >
      {children}
    </a>
  );
}

function FaqItem({ q, a, open, toggle }: { q: string; a: string; open: boolean; toggle: () => void }) {
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-white/[0.03] transition-colors"
      >
        <span className="font-medium text-sand pr-4">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-sand-muted shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 pb-5 md:pb-6 px-5 md:px-6' : 'max-h-0'}`}
      >
        <p className="text-sand-muted font-light leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function App() {
  const [showSticky, setShowSticky] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { scrollY } = useScroll();

  useBeehiiv('beehiiv-embed');

  useMotionValueEvent(scrollY, 'change', (y) => {
    setShowSticky(y > 520);
  });

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes('beehiiv.com')) return;
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (
          data?.type === 'beehiiv-form-submit' ||
          data?.type === 'subscription-success' ||
          data?.event === 'subscribe' ||
          (data?.data?.email && event.origin.includes('beehiiv'))
        ) {
          track('beehiiv_signup', 'newsletter_signup');
        }
      } catch {
        /* ignore */
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-10%' },
    transition: { duration: 0.6, ease: 'easeOut' as const },
  };

  return (
    <div className="min-h-screen bg-ink flex flex-col font-sans text-sand">
      {/* Nav */}
      <nav className="relative z-40 w-full py-5 px-6 md:px-10 flex justify-between items-center max-w-7xl mx-auto">
        <div className="font-serif text-xl md:text-2xl font-medium tracking-wide text-sand">
          Kai Makana Health
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-sand-muted">
          <a href="#cleanse" className="hover:text-accent transition-colors">Cleanse</a>
          <a href="#bundle" className="hover:text-accent transition-colors">Bundle</a>
          <a href="#faq" className="hover:text-accent transition-colors">FAQ</a>
          <a href="#about" className="hover:text-accent transition-colors">About</a>
        </div>
        <PrimaryButton href={CLEANSE_URL} label="nav_cta" className="!px-5 !py-2.5 !text-sm hidden sm:inline-flex">
          Get the Cleanse — ${CLEANSE_PRICE}
        </PrimaryButton>
      </nav>

      <main className="flex-grow">
        {/* Hero */}
        <section className="relative min-h-[92vh] flex items-end md:items-center overflow-hidden">
          <div className="absolute inset-0">
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster={`${import.meta.env.BASE_URL}videos/hero-poster.jpg`}
              aria-hidden="true"
            >
              <source src={`${import.meta.env.BASE_URL}videos/hero-hq.mp4`} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-ink/30" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pb-20 pt-32 md:pt-24">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              className="max-w-2xl space-y-7"
            >
              <span className="inline-block py-1.5 px-3 rounded-full border border-accent/40 bg-accent/10 text-accent text-xs font-semibold tracking-[0.18em] uppercase">
                5-Day Video Protocol
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif leading-[1.05] text-sand">
                Reset your body in 5 days — without pills, juice cleanses, or extremes.
              </h1>
              <p className="text-lg md:text-xl text-sand-muted font-light leading-relaxed max-w-xl">
                One natural remedy per day. Short filmed lessons. Kitchen ingredients you already know.
              </p>
              <div className="flex flex-col gap-4 pt-2">
                <div>
                  <PrimaryButton href={CLEANSE_URL} label="hero_primary">
                    Start the 5-Day Cleanse — <span className="text-ink/70 line-through mr-2">$59</span> ${CLEANSE_PRICE} <ArrowRight className="w-4 h-4" />
                  </PrimaryButton>
                  <p className="text-xs text-sand-muted/60 mt-2">One-time payment · No subscription</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 border-t border-white/20"></div>
                  <span className="text-xs text-sand-muted/60 uppercase tracking-wider font-medium">or get free</span>
                  <div className="flex-1 border-t border-white/20"></div>
                </div>
                <div className="text-center space-y-3 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-serif text-sand">Free Liver Cleanse Guide</h3>
                  <p className="text-sand-muted text-sm font-light">
                    The 5-minute natural liver cleanse I promote in my bio — free via email.
                  </p>
                  <div id="beehiiv-embed" className="flex justify-center min-h-[120px]" />
                </div>
                <a
                  href="#bundle"
                  className="text-xs text-sand-muted hover:text-accent transition-colors underline-offset-4 hover:underline text-center"
                >
                  Save with the Cleanse + Blueprint bundle →
                </a>
              </div>
              <p className="text-xs text-sand-muted/70 tracking-wide">
                Instant access · Watch on any device · One-time payment
              </p>
            </motion.div>
          </div>
        </section>

        {/* Problem */}
        <section className="py-20 md:py-28 px-6 md:px-10 border-t border-white/5">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div {...fadeUp} className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-serif">
                Your body isn&apos;t broken.{' '}
                <span className="text-accent italic">It&apos;s inflamed.</span>
              </h2>
              <p className="text-sand-muted text-lg max-w-2xl mx-auto font-light">
                Most people chase symptoms. This protocol goes after the root — in order — over five focused days.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                {['Fatigue', 'Joint pain', 'Brain fog', 'Stubborn weight'].map((chip) => (
                  <span
                    key={chip}
                    className="px-4 py-2 rounded-full bg-ink-2 border border-white/10 text-sm text-sand-muted"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* 5 Days */}
        <section id="cleanse" className="py-20 md:py-28 px-6 md:px-10 bg-ink-2">
          <div className="max-w-6xl mx-auto">
            <motion.div {...fadeUp} className="text-center mb-14 space-y-4">
              <h2 className="text-3xl md:text-5xl font-serif">
                Five days. Five systems. One clear path.
              </h2>
              <p className="text-sand-muted text-lg font-light">
                ~9 minutes of video total. Built to finish.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {DAYS.map((day, i) => (
                <motion.div
                  key={day.n}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="bg-ink-3 border border-white/8 rounded-2xl p-6 hover:border-accent/40 transition-colors flex flex-col"
                >
                  <div className="text-accent font-semibold text-sm tracking-widest mb-3">DAY {day.n}</div>
                  <h3 className="font-serif text-xl text-sand mb-2">{day.title}</h3>
                  <p className="text-sm text-sand-muted font-light leading-relaxed mb-3 flex-grow">{day.line}</p>
                  <p className="text-xs text-accent font-medium">{day.result}</p>
                </motion.div>
              ))}
            </div>

            <motion.div {...fadeUp} className="flex justify-center mt-12">
              <PrimaryButton href={CLEANSE_URL} label="days_cta">
                Get the 5-Day Full Body Cleanse — ${CLEANSE_PRICE} <ArrowRight className="w-4 h-4" />
              </PrimaryButton>
            </motion.div>
          </div>
        </section>

        {/* Bundle */}
        <section id="bundle" className="py-20 md:py-28 px-6 md:px-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div {...fadeUp} className="text-center mb-10 space-y-3">
              <span className="inline-block py-1 px-3 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-semibold tracking-widest uppercase">
                Best value
              </span>
              <h2 className="text-3xl md:text-5xl font-serif">Get the complete system &amp; save</h2>
              <p className="text-sand-muted text-lg font-light">
                The 5-day protocol plus the everyday guide — together.
              </p>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="rounded-3xl border border-accent/30 bg-ink-2 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
                {/* Cleanse card */}
                <div className="p-8 md:p-10 text-center space-y-3">
                  <p className="text-xs uppercase tracking-widest text-sand-muted font-medium">5-Day Cleanse</p>
                  <p className="text-3xl font-serif">${CLEANSE_PRICE}</p>
                  <p className="text-sm text-sand-muted font-light">5 video lessons</p>
                </div>

                {/* Blueprint card */}
                <div className="p-8 md:p-10 text-center space-y-3">
                  <p className="text-xs uppercase tracking-widest text-sand-muted font-medium">Blueprint</p>
                  <p className="text-3xl font-serif">${BLUEPRINT_PRICE}</p>
                  <p className="text-sm text-sand-muted font-light">PDF guide · 20+ remedies</p>
                </div>

                {/* Bundle total */}
                <div className="p-8 md:p-10 text-center space-y-4 bg-accent/5 flex flex-col justify-center">
                  <p className="text-xs uppercase tracking-widest text-accent font-semibold">Bundle</p>
                  <div>
                    <span className="text-4xl font-serif font-bold">${BUNDLE_PRICE}</span>
                    <span className="text-sand-muted text-sm ml-2 line-through">${(CLEANSE_PRICE + BLUEPRINT_PRICE).toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-accent font-medium">Save ${((CLEANSE_PRICE + BLUEPRINT_PRICE) - BUNDLE_PRICE).toFixed(2)}</p>
                  <a
                    href={BUNDLE_URL}
                    onClick={() => track('gumroad_click', 'bundle_strip')}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-accent text-ink font-semibold text-sm hover:bg-white transition-all"
                  >
                    Get the Bundle — ${BUNDLE_PRICE} <ArrowRight className="w-4 h-4" />
                  </a>
                  <p className="text-xs text-sand-muted/60">Clean + Blueprint · Instant access</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Included */}
        <section className="py-20 md:py-28 px-6 md:px-10 bg-ink-2">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div {...fadeUp} className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif">What&apos;s inside the Cleanse</h2>
              <p className="text-sand-muted font-light text-lg leading-relaxed">
                A short, complete video protocol — not a 40-hour course you&apos;ll never finish.
              </p>
              <ul className="space-y-4">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sand/90 font-light">
                    <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="rounded-3xl border border-white/10 bg-ink p-8 md:p-10 space-y-6"
            >
              <div className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Free bonus</div>
              <h3 className="text-xl font-serif text-sand">Liver Cleanse guide included</h3>
              <p className="text-sand-muted font-light leading-relaxed">
                Buy the 5-Day Cleanse and get the free liver cleanse guide when you join the email list. Two protocols, one price.
              </p>
              <div className="h-px bg-white/10" />
              <div className="text-xs uppercase tracking-[0.2em] text-sand-muted font-semibold">For you if</div>
              <p className="text-sand font-light leading-relaxed">
                You want natural, kitchen-first remedies and a short structured reset you can actually complete this week.
              </p>
              <div className="h-px bg-white/10" />
              <div className="text-xs uppercase tracking-[0.2em] text-sand-muted font-semibold">Not for</div>
              <p className="text-sand-muted font-light leading-relaxed">
                Medical treatment, emergencies, or people looking for 10 hours of fluff. Educational wellness — not a substitute for professional care.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Guarantee */}
        <section className="py-20 md:py-28 px-6 md:px-10">
          <motion.div {...fadeUp} className="max-w-2xl mx-auto text-center space-y-6">
            <Shield className="w-12 h-12 text-accent mx-auto" strokeWidth={1.5} />
            <h2 className="text-3xl md:text-4xl font-serif">7-Day Risk-Free Guarantee</h2>
            <p className="text-sand-muted text-lg font-light leading-relaxed">
              Try the 5-Day Cleanse for a full week. If the lessons aren&apos;t what you expected, or the protocol doesn&apos;t feel right for you — email us and we&apos;ll refund your purchase. No questions asked.
            </p>
            <p className="text-xs text-sand-muted/60">Refunds processed within 48 hours. One refund per product lifetime.</p>
          </motion.div>
        </section>

        {/* Blueprint secondary */}
        <section id="blueprint" className="py-20 md:py-28 px-6 md:px-10 bg-ink-2">
          <div className="max-w-5xl mx-auto">
            <motion.div
              {...fadeUp}
              className="rounded-3xl border border-white/10 bg-ink overflow-hidden grid grid-cols-1 lg:grid-cols-5"
            >
              <div className="lg:col-span-3 p-10 md:p-14 space-y-6">
                <span className="text-accent text-xs font-semibold tracking-[0.18em] uppercase">
                  Also available separately
                </span>
                <h2 className="text-3xl md:text-4xl font-serif">The Everyday Wellness Blueprint</h2>
                <p className="text-sand-muted font-light text-lg leading-relaxed">
                  A practical digital guide for lasting habits — morning and night routines, 20+ natural remedies, sleep, stress, and energy without the overwhelm.
                </p>
                <ul className="space-y-3 text-sand/80 font-light">
                  {[
                    '20+ simple natural remedies',
                    'Clear morning + nighttime routines',
                    'Grounded stress and sleep strategies',
                  ].map((t) => (
                    <li key={t} className="flex gap-2 items-start">
                      <Check className="w-4 h-4 text-accent mt-1 shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={BLUEPRINT_URL}
                    onClick={() => track('gumroad_click', 'blueprint_cta')}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/20 text-sand hover:border-accent hover:text-accent transition-all text-sm font-medium"
                  >
                    Get the Blueprint — ${BLUEPRINT_PRICE} <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href={BUNDLE_URL}
                    onClick={() => track('gumroad_click', 'bundle_from_blueprint')}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent/15 text-accent hover:bg-accent/25 transition-all text-sm font-medium"
                  >
                    Or save with the Bundle — ${BUNDLE_PRICE}
                  </a>
                </div>
              </div>
              <div className="lg:col-span-2 relative overflow-hidden">
                <img
                  src={`${import.meta.env.BASE_URL}blueprint-cover.png`}
                  alt="The Everyday Wellness Blueprint"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-ink/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-center space-y-2">
                    <Leaf className="w-8 h-8 text-accent mx-auto" strokeWidth={1.25} />
                    <p className="font-serif text-xl text-sand">Everyday Wellness</p>
                    <p className="text-sand-muted text-sm">Digital guide · Instant download</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 md:py-28 px-6 md:px-10">
          <div className="max-w-5xl mx-auto">
            <motion.div {...fadeUp} className="text-center mb-12 space-y-3">
              <h2 className="text-3xl md:text-4xl font-serif">What people are saying</h2>
              <p className="text-sand-muted text-lg font-light">
                Real feedback from early readers of the Everyday Wellness Blueprint and Cleanse protocol.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { stars: 5, quote: 'The Blueprint is the most practical health guide I\'ve read. Not overwhelming — just clear, doable routines that actually stuck.', name: 'Sarah K.' },
                { stars: 5, quote: 'I finished the 5-Day Cleanse in a week. Day 3 was the turning point — I woke up feeling genuinely lighter and clearer than I had in months.', name: 'James M.' },
                { stars: 4, quote: 'Love that every ingredient was already in my kitchen. No expensive supplements. The liver day was my favorite — simple but effective.', name: 'Dana R.' },
              ].map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-ink-2 border border-white/10 rounded-2xl p-6 md:p-8 space-y-4"
                >
                  <div className="flex gap-1">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-sand/80 font-light leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                  <p className="text-sm text-sand-muted font-medium">{t.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-20 md:py-28 px-6 md:px-10 bg-ink-2">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div {...fadeUp} className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40">
                <img
                  src={`${import.meta.env.BASE_URL}about-kai.jpg`}
                  alt="Kai Makana"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
            <motion.div {...fadeUp} className="space-y-6">
              <Leaf className="w-8 h-8 text-accent" strokeWidth={1.5} />
              <h2 className="text-3xl md:text-4xl font-serif leading-tight">
                Practical natural health. No extremes.
              </h2>
              <div className="space-y-5 text-lg text-sand-muted font-light leading-relaxed">
                <p>
                  Kai Makana Health is built for people who want clear, kitchen-first remedies — not another complicated wellness system.
                </p>
                <p>
                  Short protocols. Real ingredients. Guidance you can actually finish. Rooted in a calm, grounded approach to feeling better day by day.
                </p>
                <div className="pt-2">
                  <p className="font-serif italic text-sand text-xl">— Kai Makana</p>
                  <p className="text-xs text-sand-muted uppercase tracking-widest mt-1">Founder, Kai Makana Health</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 md:py-28 px-6 md:px-10">
          <div className="max-w-3xl mx-auto">
            <motion.div {...fadeUp} className="text-center mb-12 space-y-3">
              <h2 className="text-3xl md:text-4xl font-serif">Frequently asked questions</h2>
              <p className="text-sand-muted text-lg font-light">
                Everything you need to know about the Cleanse and Bundle.
              </p>
            </motion.div>

            <motion.div {...fadeUp} className="space-y-3">
              {FAQS.map((faq, i) => (
                <FaqItem
                  key={i}
                  q={faq.q}
                  a={faq.a}
                  open={openFaq === i}
                  toggle={() => setOpenFaq(openFaq === i ? null : i)}
                />
              ))}
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 md:py-28 px-6 md:px-10 bg-ink-2">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-serif">Start your 5-day reset today</h2>
            <p className="text-sand-muted text-lg font-light">
              Five short lessons. One clear protocol. <span className="line-through text-sand-muted/50">$59</span> ${CLEANSE_PRICE} once.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PrimaryButton href={CLEANSE_URL} label="final_cta">
                Get the Cleanse — ${CLEANSE_PRICE} <ArrowRight className="w-4 h-4" />
              </PrimaryButton>
              <a
                href={BUNDLE_URL}
                onClick={() => track('gumroad_click', 'final_bundle')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-accent border border-accent/40 hover:border-accent hover:bg-accent/10 rounded-full transition-all"
              >
                Bundle &amp; save — ${BUNDLE_PRICE}
              </a>
            </div>
            <p className="text-xs text-sand-muted/70">Instant access · One-time payment · 7-day guarantee</p>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-serif text-xl text-sand">Kai Makana Health</div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-sand-muted">
            <a href="#cleanse" className="hover:text-accent transition-colors">Cleanse</a>
            <a href="#bundle" className="hover:text-accent transition-colors">Bundle</a>
            <a href="#faq" className="hover:text-accent transition-colors">FAQ</a>
            <a href={`${import.meta.env.BASE_URL}privacy.html`} className="hover:text-accent transition-colors">Privacy</a>
            <a href="mailto:hello@kaimakanahealth.com" className="hover:text-accent transition-colors">Contact</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-white/5 text-center text-xs text-sand-muted/50 space-y-2">
          <p>Educational wellness information only. Not a substitute for medical advice.</p>
          <p>&copy; {new Date().getFullYear()} Kai Makana Health. All rights reserved.</p>
        </div>
      </footer>

      {/* Sticky mobile CTA */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t border-white/10 bg-ink/95 backdrop-blur-md px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          >
            <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
              <div className="min-w-0">
                <div className="text-sm font-medium text-sand truncate">5-Day Full Body Cleanse</div>
                <div className="text-xs text-sand-muted">${CLEANSE_PRICE} · Instant access</div>
              </div>
              <a
                href={CLEANSE_URL}
                onClick={() => track('gumroad_click', 'sticky_mobile')}
                className="shrink-0 px-5 py-2.5 rounded-full bg-accent text-ink text-sm font-semibold"
              >
                Get access
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
