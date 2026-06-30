// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Landing Page
// Public-facing page at "/" that introduces Badil and offers
// sign-in / sign-up.  Logged-in users are sent straight to /app.
// ═══════════════════════════════════════════════════════════════════

import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Cpu, Shield, BarChart3, Recycle, Handshake, Zap } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { BadilLogo } from '../components/ui/BadilLogo';
import loginHero from '../assets/login-hero.png';
import './LandingPage.css';

// ── Feature data ───────────────────────────────────────────────────

const features = [
  {
    icon: Cpu,
    title: 'AI-Powered Matching',
    desc: 'Our intelligent engine analyses material profiles and automatically pairs waste outputs with potential inputs, creating optimal symbiosis loops.',
  },
  {
    icon: Shield,
    title: 'Secure Escrow Transactions',
    desc: 'Every deal is protected by our built-in escrow system — funds are released only when both parties confirm quality and delivery.',
  },
  {
    icon: BarChart3,
    title: 'Environmental Impact Tracking',
    desc: 'Real-time dashboards show your CO₂ savings, waste diversion rates, and sustainability metrics for compliance reporting.',
  },
];

const steps = [
  {
    num: '01',
    icon: Recycle,
    title: 'List Your By-Products',
    desc: 'Describe your industrial waste or surplus materials — quantities, chemical composition, and availability schedule.',
  },
  {
    num: '02',
    icon: Handshake,
    title: 'Get Matched Instantly',
    desc: 'Our AI cross-references your listing with demand signals from factories seeking raw inputs across all sectors.',
  },
  {
    num: '03',
    icon: Zap,
    title: 'Complete the Transaction',
    desc: 'Negotiate terms, lock funds in escrow, arrange logistics, and confirm delivery — all in one seamless workflow.',
  },
];

const stats = [
  { value: '500+', label: 'Manufacturing Leaders' },
  { value: '50K+', label: 'Tons Waste Diverted' },
  { value: '98%', label: 'Transaction Success Rate' },
];

// ── Component ──────────────────────────────────────────────────────

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const navRef = useRef<HTMLElement>(null);

  // ── Smart CTA handler ────────────────────────────────────────────
  const handleGetStarted = useCallback(() => {
    navigate(isAuthenticated ? '/app' : '/login');
  }, [isAuthenticated, navigate]);

  // ── Navbar scroll effect ─────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      navRef.current?.classList.toggle('landing-nav--scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Scroll-reveal observer ───────────────────────────────────────
  useEffect(() => {
    const els = document.querySelectorAll('.landing-reveal');
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('landing-reveal--visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // ── Smooth scroll to anchor ──────────────────────────────────────
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="landing">
      {/* ── Navbar ───────────────────────────────────────────────── */}
      <nav className="landing-nav" ref={navRef}>
        <BadilLogo size="sm" />

        <ul className="landing-nav__links">
          <li>
            <button className="landing-nav__link" onClick={() => scrollTo('features')}>
              Features
            </button>
          </li>
          <li>
            <button className="landing-nav__link" onClick={() => scrollTo('how-it-works')}>
              How It Works
            </button>
          </li>
          <li>
            <button className="landing-nav__link" onClick={() => scrollTo('impact')}>
              Impact
            </button>
          </li>
        </ul>

        <button className="landing-nav__cta" onClick={handleGetStarted}>
          {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
        </button>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="landing-hero">
        <div className="landing-hero__bg">
          <img src={loginHero} alt="Industrial symbiosis facility" />
        </div>

        <div className="landing-hero__content">
          <div className="landing-hero__badge">
            <span className="landing-hero__badge-dot" />
            AI-Powered Industrial Symbiosis Marketplace
          </div>

          <h1 className="landing-hero__title">
            Transform Industrial{' '}
            <br />
            Waste into <span>Value</span>
          </h1>

          <p className="landing-hero__desc">
            Badil connects factories across sectors to trade by-products and surplus
            materials — turning waste streams into new revenue through intelligent
            matching and secure transactions.
          </p>

          <div className="landing-hero__actions">
            <button className="landing-hero__btn-primary" onClick={handleGetStarted}>
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
              <ArrowRight size={18} />
            </button>
            <button
              className="landing-hero__btn-secondary"
              onClick={() => scrollTo('features')}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="landing-features landing-reveal" id="features">
        <p className="landing-section__label">Platform Capabilities</p>
        <h2 className="landing-section__title">
          Everything You Need for
          <br />
          Circular Commerce
        </h2>
        <p className="landing-section__desc">
          From intelligent material matching to tamper-proof transactions and
          sustainability analytics — Badil is built end-to-end for industrial symbiosis.
        </p>

        <div className="landing-features__grid">
          {features.map(({ icon: Icon, title, desc }) => (
            <div className="landing-feature-card" key={title}>
              <div className="landing-feature-card__icon">
                <Icon size={22} />
              </div>
              <h3 className="landing-feature-card__title">{title}</h3>
              <p className="landing-feature-card__desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────── */}
      <section className="landing-steps landing-reveal" id="how-it-works">
        <div className="landing-steps__inner">
          <p className="landing-section__label">How It Works</p>
          <h2 className="landing-section__title">
            Three Steps to Circular
            <br />
            Industrial Commerce
          </h2>
          <p className="landing-section__desc">
            Getting started with Badil is simple. List, match, and transact — our
            platform handles the complexity so you can focus on your business.
          </p>

          <div className="landing-steps__grid">
            {steps.map(({ num, title, desc }) => (
              <div className="landing-step" key={num}>
                <div className="landing-step__number">{num}</div>
                <h3 className="landing-step__title">{title}</h3>
                <p className="landing-step__desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────── */}
      <section className="landing-stats landing-reveal" id="impact">
        <p className="landing-section__label" style={{ textAlign: 'center' }}>
          Platform Impact
        </p>
        <h2
          className="landing-section__title"
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          Trusted by Industry Leaders
        </h2>

        <div className="landing-stats__grid">
          {stats.map(({ value, label }) => (
            <div className="landing-stat" key={label}>
              <p className="landing-stat__value">{value}</p>
              <p className="landing-stat__label">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────── */}
      <section className="landing-cta landing-reveal">
        <div className="landing-cta__content">
          <h2 className="landing-cta__title">
            Ready to Join the Circular Economy?
          </h2>
          <p className="landing-cta__desc">
            Create your free account and start transforming by-products into
            revenue today. No setup fees, no hidden costs.
          </p>
          <button className="landing-hero__btn-primary" onClick={handleGetStarted}>
            {isAuthenticated ? 'Go to Dashboard' : 'Create Free Account'}
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="landing-footer">
        <BadilLogo size="sm" />
        <p className="landing-footer__copy">
          © {new Date().getFullYear()} Badil. All rights reserved.
        </p>
        <div className="landing-footer__links">
          <a href="#" className="landing-footer__link">Terms of Service</a>
          <a href="#" className="landing-footer__link">Privacy Policy</a>
          <a href="#" className="landing-footer__link">Contact</a>
        </div>
      </footer>
    </div>
  );
}
