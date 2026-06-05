import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './assets/logo.png';

const NAV = ['About', 'Services', 'Industries', 'Why RWS', 'Contact'];

/* ===== Realistic Machinery SVG Icons ===== */

const IconRoboticArm = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="22" y="50" width="20" height="6" rx="1" fill="currentColor" fillOpacity="0.15"/>
    <line x1="32" y1="50" x2="32" y2="42"/>
    <circle cx="32" cy="42" r="3.5" fill="currentColor" fillOpacity="0.2"/>
    <line x1="32" y1="42" x2="20" y2="26"/>
    <circle cx="20" cy="26" r="3" fill="currentColor" fillOpacity="0.2"/>
    <line x1="20" y1="26" x2="36" y2="14"/>
    <circle cx="36" cy="14" r="2.5" fill="currentColor" fillOpacity="0.2"/>
    <line x1="36" y1="14" x2="46" y2="18"/>
    <path d="M46 17 L50 19 L48 23 L44 21 Z" fill="currentColor" fillOpacity="0.25"/>
    <circle cx="50" cy="22" r="1.2" fill="currentColor"/>
    <path d="M50 23 q-1 4 0 6" strokeWidth="1.2" strokeDasharray="1.5 1.5"/>
  </svg>
);

const IconWeldingTorch = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 50 L26 34" strokeWidth="3.5"/>
    <rect x="24" y="30" width="14" height="10" rx="2" transform="rotate(-45 31 35)" fill="currentColor" fillOpacity="0.2"/>
    <path d="M38 26 L46 18" strokeWidth="2.5"/>
    <circle cx="48" cy="16" r="1.5" fill="currentColor"/>
    <path d="M50 14 l3 -2 M52 18 l3 -1 M50 20 l3 1" strokeWidth="1.5"/>
    <path d="M14 46 q-2 -1 -3 0 M11 52 q-2 0 -3 1" strokeWidth="1.5"/>
    <circle cx="55" cy="14" r="0.8" fill="currentColor"/>
    <circle cx="56" cy="20" r="0.8" fill="currentColor"/>
  </svg>
);

const IconCNC = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="14" width="52" height="40" rx="2" fill="currentColor" fillOpacity="0.08"/>
    <rect x="10" y="18" width="44" height="22" fill="currentColor" fillOpacity="0.12"/>
    <line x1="10" y1="26" x2="54" y2="26"/>
    <rect x="28" y="22" width="8" height="8" fill="currentColor" fillOpacity="0.3"/>
    <line x1="32" y1="30" x2="32" y2="38"/>
    <path d="M28 38 L36 38 L34 42 L30 42 Z" fill="currentColor" fillOpacity="0.4"/>
    <rect x="18" y="44" width="28" height="4" fill="currentColor" fillOpacity="0.25"/>
    <circle cx="14" cy="50" r="1.5" fill="currentColor"/>
    <circle cx="50" cy="50" r="1.5" fill="currentColor"/>
    <rect x="6" y="10" width="52" height="4" rx="1" fill="currentColor" fillOpacity="0.2"/>
  </svg>
);

const IconFabrication = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="8" width="36" height="36" rx="1" fill="currentColor" fillOpacity="0.08"/>
    <line x1="8" y1="20" x2="44" y2="20"/>
    <line x1="8" y1="32" x2="44" y2="32"/>
    <line x1="20" y1="8" x2="20" y2="44"/>
    <line x1="32" y1="8" x2="32" y2="44"/>
    <circle cx="46" cy="46" r="9" fill="currentColor" fillOpacity="0.15"/>
    <circle cx="46" cy="46" r="3" fill="currentColor" fillOpacity="0.3"/>
    <g stroke="currentColor" strokeWidth="1.8">
      <line x1="46" y1="34" x2="46" y2="38"/>
      <line x1="46" y1="54" x2="46" y2="58"/>
      <line x1="34" y1="46" x2="38" y2="46"/>
      <line x1="54" y1="46" x2="58" y2="46"/>
      <line x1="37.5" y1="37.5" x2="40.3" y2="40.3"/>
      <line x1="51.7" y1="51.7" x2="54.5" y2="54.5"/>
      <line x1="37.5" y1="54.5" x2="40.3" y2="51.7"/>
      <line x1="51.7" y1="40.3" x2="54.5" y2="37.5"/>
    </g>
  </svg>
);

const IconFixture = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="46" width="52" height="8" rx="1" fill="currentColor" fillOpacity="0.2"/>
    <rect x="14" y="34" width="6" height="12" fill="currentColor" fillOpacity="0.25"/>
    <rect x="44" y="34" width="6" height="12" fill="currentColor" fillOpacity="0.25"/>
    <rect x="22" y="38" width="20" height="8" fill="currentColor" fillOpacity="0.4"/>
    <line x1="14" y1="34" x2="20" y2="34" strokeWidth="3"/>
    <line x1="44" y1="34" x2="50" y2="34" strokeWidth="3"/>
    <line x1="17" y1="34" x2="17" y2="22"/>
    <line x1="47" y1="34" x2="47" y2="22"/>
    <circle cx="17" cy="20" r="2.5" fill="currentColor" fillOpacity="0.3"/>
    <circle cx="47" cy="20" r="2.5" fill="currentColor" fillOpacity="0.3"/>
    <line x1="17" y1="18" x2="17" y2="12"/>
    <line x1="47" y1="18" x2="47" y2="12"/>
    <rect x="13" y="8" width="8" height="4" rx="1" fill="currentColor" fillOpacity="0.3"/>
    <rect x="43" y="8" width="8" height="4" rx="1" fill="currentColor" fillOpacity="0.3"/>
  </svg>
);

const IconAssembly = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 22 L32 12 L54 22 L54 48 L32 58 L10 48 Z" fill="currentColor" fillOpacity="0.1"/>
    <path d="M10 22 L32 32 L54 22"/>
    <line x1="32" y1="32" x2="32" y2="58"/>
    <path d="M21 17 L43 27" strokeDasharray="2 2"/>
    <circle cx="22" cy="40" r="2.5" fill="currentColor" fillOpacity="0.3"/>
    <circle cx="42" cy="40" r="2.5" fill="currentColor" fillOpacity="0.3"/>
    <rect x="28" y="42" width="8" height="3" fill="currentColor" fillOpacity="0.4"/>
  </svg>
);

const IconMission = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <g fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8">
      <rect x="30" y="4" width="4" height="7" rx="0.5"/>
      <rect x="30" y="53" width="4" height="7" rx="0.5"/>
      <rect x="53" y="30" width="7" height="4" rx="0.5"/>
      <rect x="4" y="30" width="7" height="4" rx="0.5"/>
      <rect x="46" y="11" width="4" height="7" rx="0.5" transform="rotate(45 48 14.5)"/>
      <rect x="14" y="11" width="4" height="7" rx="0.5" transform="rotate(-45 16 14.5)"/>
      <rect x="46" y="46" width="4" height="7" rx="0.5" transform="rotate(-45 48 49.5)"/>
      <rect x="14" y="46" width="4" height="7" rx="0.5" transform="rotate(45 16 49.5)"/>
    </g>
    <circle cx="32" cy="32" r="18" fill="currentColor" fillOpacity="0.12"/>
    <circle cx="32" cy="32" r="18"/>
    <circle cx="32" cy="32" r="11" strokeWidth="1.8" strokeDasharray="2 2"/>
    <circle cx="32" cy="32" r="5" fill="currentColor" fillOpacity="0.35"/>
    <circle cx="32" cy="32" r="1.5" fill="currentColor"/>
    <line x1="32" y1="18" x2="32" y2="24" strokeWidth="1.8"/>
    <line x1="32" y1="40" x2="32" y2="46" strokeWidth="1.8"/>
    <line x1="18" y1="32" x2="24" y2="32" strokeWidth="1.8"/>
    <line x1="40" y1="32" x2="46" y2="32" strokeWidth="1.8"/>
  </svg>
);

const SERVICES = [
  {
    Icon: IconRoboticArm,
    title: 'Robotic MIG Welding',
    desc: 'Steel, stainless, aluminum & galvanized. Consistent repeatability at scale.',
    detail: 'Our state-of-the-art robotic MIG welding systems deliver unmatched consistency across high-volume production runs. Whether you need steel, stainless steel, aluminum, or galvanized materials, our robotic cells maintain tight tolerances and superior weld quality — run after run, shift after shift. Ideal for OEM manufacturers and job shops needing overflow capacity without sacrificing precision.'
  },
  {
    Icon: IconWeldingTorch,
    title: 'Manual TIG/MIG Welding',
    desc: 'Precision hand-welded components and small assemblies with expert finesse.',
    detail: 'Not every weld can be automated — and that\'s where our certified manual welders shine. From intricate TIG work on thin-gauge stainless to heavy MIG passes on structural fabrications, our team brings years of hands-on expertise to every joint. Perfect for prototypes, custom one-offs, and small batch runs that demand the human touch.'
  },
  {
    Icon: IconCNC,
    title: 'CNC Machining',
    desc: 'Small and medium batch production with tight tolerances.',
    detail: 'Complement your welded assemblies with precision CNC machining services. We handle milling, turning, and drilling on small-to-medium batch runs with tolerances to ±0.001". Our CNC capabilities integrate seamlessly with our welding and fabrication workflows, giving you a single-source solution for complex multi-process parts.'
  },
  {
    Icon: IconFabrication,
    title: 'Custom Fabrication',
    desc: 'Frames, guards, brackets, panels, and enclosures — built to your spec.',
    detail: 'From simple brackets to complex multi-component weldments, our custom fabrication services cover the full spectrum. Frames, machine guards, access panels, electrical enclosures, structural supports — if it can be cut, bent, and welded, we can build it. We work directly from your drawings (DWG, DXF, PDF, or 3D STEP/IGES) and deliver parts that fit right the first time.'
  },
  {
    Icon: IconFixture,
    title: 'Fixture & Tooling Design',
    desc: 'In-house engineering and support for welding setups and fixtures.',
    detail: 'Quality welds start with quality fixturing. Our in-house engineering team designs and builds custom welding fixtures and jigs that ensure dimensional repeatability across every part. Whether you need a simple tack fixture or a complex multi-stage welding setup, we engineer solutions that reduce cycle time and eliminate costly rework downstream.'
  },
  {
    Icon: IconAssembly,
    title: 'Sub-Assemblies',
    desc: 'Welded + machined assemblies delivered complete and ready to install.',
    detail: 'Reduce your assembly burden and supplier count by leveraging our complete sub-assembly capabilities. We combine welding, machining, and finishing into a single streamlined workflow — delivering fully assembled, inspected, and ready-to-install components directly to your production line. Fewer touch points, tighter lead times, and one point of contact for accountability.'
  },
];

const INDUSTRIES = ['Industrial Equipment', 'Automation & Robotics', 'Custom Machinery', 'OEM Subcontracting', 'Fabrication & Job Shops'];

const WHY = [
  { label: 'Fast Turnaround', text: 'Same-week response and rapid fulfillment — no waiting in queue.' },
  { label: 'Overflow Capacity', text: 'Scale with us without hiring, retooling, or capital investment.' },
  { label: 'Repeatable Quality', text: 'Robotic precision matched with skilled manual finesse.' },
  { label: 'GTA Proximity', text: 'Milton-based for quick delivery across the Greater Toronto Area.' },
];

function Navbar({ scrolled }) {
  const [open, setOpen] = useState(false);
  const scroll = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };
  return (
    <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="nav__logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <img src={logo} alt="RWS - Robot Welding Services" className="nav__logo-img" />
      </div>
      <button className="nav__burger" onClick={() => setOpen(!open)} aria-label="menu">
        <span /><span /><span />
      </button>
      <ul className={`nav__links${open ? ' open' : ''}`}>
        {NAV.map(n => (
          <li key={n}>
            <button onClick={() => scroll(n.toLowerCase().replace(' ', '-'))}>{n}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__noise" />
      <span className="hero__accent" />
      <span className="hero__accent" />
      <span className="hero__accent" />
      <div className="hero__content">
        <p className="hero__eyebrow">Milton, Ontario · Est. Manufacturing Excellence</p>
        <h1 className="hero__title">Built to Spec.<br /><span>Delivered on Time.</span></h1>
        <p className="hero__sub">
          High-precision robotic welding & custom fabrication for manufacturers across Ontario.
          Fast turnaround. Zero compromise.
        </p>
        <div className="hero__stats">
          {[['Same-Day', 'Quote Response'], ['6+', 'Core Services'], ['GTA', 'Quick Delivery']].map(([v, l]) => (
            <div key={l} className="stat">
              <span className="stat__val">{v}</span>
              <span className="stat__lbl">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section about" id="about">
      <div className="container">
        <div className="about__inner">
          <div className="about__content">
            <span className="tag">About Us</span>
            <h2 className="about__title">Who We Are</h2>
            <p className="about__text">
              Robot Welding Services Inc. is a provider of high quality robotic welding job shop services.
              We provide quality products and services to match the needs of our clients who compete in a
              demanding and competitive market place for a return that reflects our commitment to be a
              recognized leader.
            </p>
          </div>
          <div className="about__mission">
            <div className="mission-card">
              <div className="mission-card__icon"><IconMission /></div>
              <h3>Our Mission</h3>
              <p>
                Robot Welding Services Inc. is a provider of high quality robotic welding job shop services.
                We provide quality products to demanding and competitive clients for a return that reflects
                our commitment to be a recognized leader in the market.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="section services" id="services">
      <div className="container">
        <div className="section__head">
          <span className="tag">Core Capabilities</span>
          <h2>What We Do</h2>
          <p>From robotic welding to complete sub-assemblies — we cover the full fabrication spectrum.</p>
        </div>
        <div className="services__grid">
          {SERVICES.map((s, i) => {
            const Icon = s.Icon;
            return (
              <div className="service-card" key={i} style={{ '--delay': `${i * 0.08}s` }}>
                <span className="service-card__icon"><Icon /></span>
                <h3>{s.title}</h3>
                <p className="service-card__desc">{s.desc}</p>
                <p className="service-card__detail">{s.detail}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Industries() {
  return (
    <section className="section industries" id="industries">
      <div className="container">
        <div className="industries__inner">
          <div className="section__head section__head--left">
            <span className="tag">Who We Serve</span>
            <h2>Industries We Support</h2>
            <p>Trusted by manufacturers and job shops across Ontario who need reliable capacity and precision.</p>
          </div>
          <ul className="industries__list">
            {INDUSTRIES.map((ind, i) => (
              <li key={i} className="ind-item">
                <span className="ind-item__num">0{i + 1}</span>
                <span>{ind}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  return (
    <section className="section why" id="why-rws">
      <div className="container">
        <div className="section__head">
          <span className="tag">The RWS Advantage</span>
          <h2>Why Work With Us</h2>
          <p>We're not just another fabrication shop — we're your on-demand manufacturing partner.</p>
        </div>
        <div className="why__grid">
          {WHY.map((w, i) => (
            <div className="why-card" key={i}>
              <span className="why-card__num">0{i + 1}</span>
              <h3>{w.label}</h3>
              <p>{w.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', service: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setStatus(data.success ? 'success' : 'error');
      if (data.success) setForm({ name: '', email: '', company: '', service: '', message: '' });
    } catch {
      setStatus('error');
    }
    setLoading(false);
  };

  return (
    <section className="section contact" id="contact">
      <div className="container">
        <div className="contact__inner">
          <div className="contact__info">
            <span className="tag">Get In Touch</span>
            <h2>Ready to Quote?</h2>
            <p>Send your drawings (DWG, PDF, or 3D) and we'll respond same-day with a competitive quote.</p>
            <div className="contact__details">
              {[
                ['📍', '483 Enfield Rd Unit 3, Burlington ON L7T 2X5'],
                ['📞', '+1 (647) 922-0496'],
                ['✉️', 'sales@robotweldingservices.com'],
                ['📐', 'kash@robotweldingservices.com (Quotes)'],
              ].map(([icon, val]) => (
                <div key={val} className="contact__item">
                  <span>{icon}</span>
                  <span>{val}</span>
                </div>
              ))}
            </div>
          </div>
          <form className="contact__form" onSubmit={submit}>
            <div className="form-row">
              <input name="name" value={form.name} onChange={handle} placeholder="Your Name *" required />
              <input name="email" type="email" value={form.email} onChange={handle} placeholder="Email Address *" required />
            </div>
            <div className="form-row">
              <div className="input-optional-wrap">
                <input name="company" value={form.company} onChange={handle} placeholder="Company Name" />
                <span className="input-optional-badge">Optional</span>
              </div>
              <select name="service" value={form.service} onChange={handle}>
                <option value="">Select Service</option>
                {SERVICES.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
              </select>
            </div>
            <textarea
              name="message"
              value={form.message}
              onChange={handle}
              placeholder="Describe your project or attach drawing details *"
              rows={5}
              required
            />
            <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message →'}
            </button>
            {status === 'success' && <p className="form__msg form__msg--ok">✅ Message sent! We'll respond same-day.</p>}
            {status === 'error' && <p className="form__msg form__msg--err">❌ Something went wrong. Please email us directly.</p>}
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <div>
            <img src={logo} alt="RWS - Robot Welding Services" className="footer__logo-img" />
            <p>Robot Welding Services Inc.</p>
            <p>Custom Fabrication. Built to spec.<br />Delivered on time — Every time.</p>
          </div>
          <div>
            <h4>Services</h4>
            {SERVICES.map(s => <p key={s.title}>{s.title}</p>)}
          </div>
          <div>
            <h4>Location</h4>
            <p>483 Enfield Rd Unit 3<br />Burlington, ON L7T 2X5</p>
            <p>+1 (647) 922-0496</p>
            <p>sales@robotweldingservices.com</p>
          </div>
          <div>
            <h4>Get in Touch</h4>
            <p><strong>Kashish Jani (Kash)</strong></p>
            <p>President</p>
            <p>483 Enfield Rd Unit 3,<br />Burlington ON L7T 2X5</p>
            <p>Phone: +1-647-922-0496</p>
            <p>Email: kash@robotweldingservices.com</p>
          </div>
        </div>
        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} Robot Welding Services Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <>
      <Navbar scrolled={scrolled} />
      <Hero />
      <About />
      <Services />
      <Industries />
      <WhyUs />
      <Contact />
      <Footer />
    </>
  );
}