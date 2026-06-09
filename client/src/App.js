// src/App.js

import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import logo from './assets/logo.png';
import { useSecretCode } from './useSecretCode';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

// ============================================================
// SVG ICONS (Stored locally for use by Service Models)
// ============================================================
const IconRoboticArm = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="22" y="50" width="20" height="6" rx="1" fill="currentColor" fillOpacity="0.15"/><line x1="32" y1="50" x2="32" y2="42"/><circle cx="32" cy="42" r="3.5" fill="currentColor" fillOpacity="0.2"/><line x1="32" y1="42" x2="20" y2="26"/><circle cx="20" cy="26" r="3" fill="currentColor" fillOpacity="0.2"/><line x1="20" y1="26" x2="36" y2="14"/><circle cx="36" cy="14" r="2.5" fill="currentColor" fillOpacity="0.2"/><line x1="36" y1="14" x2="46" y2="18"/><path d="M46 17 L50 19 L48 23 L44 21 Z" fill="currentColor" fillOpacity="0.25"/><circle cx="50" cy="22" r="1.2" fill="currentColor"/><path d="M50 23 q-1 4 0 6" strokeWidth="1.2" strokeDasharray="1.5 1.5"/>
  </svg>
);
const IconWeldingTorch = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 50 L26 34" strokeWidth="3.5"/><rect x="24" y="30" width="14" height="10" rx="2" transform="rotate(-45 31 35)" fill="currentColor" fillOpacity="0.2"/><path d="M38 26 L46 18" strokeWidth="2.5"/><circle cx="48" cy="16" r="1.5" fill="currentColor"/><path d="M50 14 l3 -2 M52 18 l3 -1 M50 20 l3 1" strokeWidth="1.5"/><path d="M14 46 q-2 -1 -3 0 M11 52 q-2 0 -3 1" strokeWidth="1.5"/><circle cx="55" cy="14" r="0.8" fill="currentColor"/><circle cx="56" cy="20" r="0.8" fill="currentColor"/>
  </svg>
);
const IconCNC = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="14" width="52" height="40" rx="2" fill="currentColor" fillOpacity="0.08"/><rect x="10" y="18" width="44" height="22" fill="currentColor" fillOpacity="0.12"/><line x1="10" y1="26" x2="54" y2="26"/><rect x="28" y="22" width="8" height="8" fill="currentColor" fillOpacity="0.3"/><line x1="32" y1="30" x2="32" y2="38"/><path d="M28 38 L36 38 L34 42 L30 42 Z" fill="currentColor" fillOpacity="0.4"/><rect x="18" y="44" width="28" height="4" fill="currentColor" fillOpacity="0.25"/><circle cx="14" cy="50" r="1.5" fill="currentColor"/><circle cx="50" cy="50" r="1.5" fill="currentColor"/><rect x="6" y="10" width="52" height="4" rx="1" fill="currentColor" fillOpacity="0.2"/>
  </svg>
);
const IconFabrication = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="8" width="36" height="36" rx="1" fill="currentColor" fillOpacity="0.08"/><line x1="8" y1="20" x2="44" y2="20"/><line x1="8" y1="32" x2="44" y2="32"/><line x1="20" y1="8" x2="20" y2="44"/><line x1="32" y1="8" x2="32" y2="44"/><circle cx="46" cy="46" r="9" fill="currentColor" fillOpacity="0.15"/><circle cx="46" cy="46" r="3" fill="currentColor" fillOpacity="0.3"/><g stroke="currentColor" strokeWidth="1.8"><line x1="46" y1="34" x2="46" y2="38"/><line x1="46" y1="54" x2="46" y2="58"/><line x1="34" y1="46" x2="38" y2="46"/><line x1="54" y1="46" x2="58" y2="46"/><line x1="37.5" y1="37.5" x2="40.3" y2="40.3"/><line x1="51.7" y1="51.7" x2="54.5" y2="54.5"/><line x1="37.5" y1="54.5" x2="40.3" y2="51.7"/><line x1="51.7" y1="40.3" x2="54.5" y2="37.5"/></g>
  </svg>
);
const IconFixture = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="46" width="52" height="8" rx="1" fill="currentColor" fillOpacity="0.2"/><rect x="14" y="34" width="6" height="12" fill="currentColor" fillOpacity="0.25"/><rect x="44" y="34" width="6" height="12" fill="currentColor" fillOpacity="0.25"/><rect x="22" y="38" width="20" height="8" fill="currentColor" fillOpacity="0.4"/><line x1="14" y1="34" x2="20" y2="34" strokeWidth="3"/><line x1="44" y1="34" x2="50" y2="34" strokeWidth="3"/><line x1="17" y1="34" x2="17" y2="22"/><line x1="47" y1="34" x2="47" y2="22"/><circle cx="17" cy="20" r="2.5" fill="currentColor" fillOpacity="0.3"/><circle cx="47" cy="20" r="2.5" fill="currentColor" fillOpacity="0.3"/><line x1="17" y1="18" x2="17" y2="12"/><line x1="47" y1="18" x2="47" y2="12"/><rect x="13" y="8" width="8" height="4" rx="1" fill="currentColor" fillOpacity="0.3"/><rect x="43" y="8" width="8" height="4" rx="1" fill="currentColor" fillOpacity="0.3"/>
  </svg>
);
const IconAssembly = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 22 L32 12 L54 22 L54 48 L32 58 L10 48 Z" fill="currentColor" fillOpacity="0.1"/><path d="M10 22 L32 32 L54 22"/><line x1="32" y1="32" x2="32" y2="58"/><path d="M21 17 L43 27" strokeDasharray="2 2"/><circle cx="22" cy="40" r="2.5" fill="currentColor" fillOpacity="0.3"/><circle cx="42" cy="40" r="2.5" fill="currentColor" fillOpacity="0.3"/><rect x="28" y="42" width="8" height="3" fill="currentColor" fillOpacity="0.4"/>
  </svg>
);

const ICONS = { IconRoboticArm, IconWeldingTorch, IconCNC, IconFabrication, IconFixture, IconAssembly };

// ============================================================
// COMPONENTS
// ============================================================

const NAV = ['Home', 'About', 'Services', 'Industries', 'Why RWS', 'Gallery', 'Contact'];

function Navbar({ currentPage, navigateTo }) {
  const [open, setOpen] = useState(false);
  return (
    <nav className="nav nav--scrolled">
      <div className="nav__logo" onClick={() => navigateTo('Home')}><img src={logo} alt="RWS" className="nav__logo-img" /></div>
      <button className={`nav__burger ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}><span /><span /><span /></button>
      <ul className={`nav__links${open ? ' open' : ''}`}>
        {NAV.map(n => (<li key={n}><button onClick={() => { navigateTo(n); setOpen(false); }} className={currentPage === n ? 'nav__link--active' : ''}>{n}</button></li>))}
        <li><button className="btn btn--primary nav__btn" onClick={() => { navigateTo('Contact'); setOpen(false); }}>Get a Quote</button></li>
      </ul>
    </nav>
  );
}

function Footer({ services }) {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div><img src={logo} alt="RWS" className="footer__logo-img" /><p>Robot Welding Services Inc.<br/>Custom Fabrication. Built to spec.</p></div>
        <div><h4>Services</h4><ul>{services.map(s => <li key={s._id}>{s.title}</li>)}</ul></div>
        <div><h4>Location</h4><p>483 Enfield Rd Unit 3, Burlington, ON L7T 2X5</p></div>
        <div><h4>Contact</h4><p>Kashish Jani (Kash)<br/>+1 (647) 922-0496</p></div>
      </div>
      <div className="footer__bottom"><p>© {new Date().getFullYear()} Robot Welding Services Inc.</p></div>
    </footer>
  );
}

// ============================================================
// PAGES
// ============================================================

function HomePage({ navigateTo }) {
  return (
    <div className="page home-page">
      <div className="home__video-wrap">
        <video className="home__video" autoPlay muted loop playsInline><source src="/welding.mp4" type="video/mp4" /></video>
        <div className="home__video-overlay" />
      </div>
      <div className="home__content">
        <h1 className="home__title">Elite Fabrication.<br/>Built For <em>Production.</em></h1>
        <p className="home__sub">High-precision robotic welding & custom fabrication in Milton, Ontario.</p>
        <div className="home__actions">
          <button className="btn btn--primary btn--lg" onClick={() => navigateTo('Contact')}>Get a Quote →</button>
          <button className="btn btn--ghost btn--lg" onClick={() => navigateTo('Services')}>Our Services</button>
        </div>
      </div>
    </div>
  );
}

function ServicesPage({ services }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  return (
    <div className="page services-page">
      <div className="page__inner">
        <div className="section__head"><span className="tag">Capabilities</span><h2>What We Do</h2></div>
        <div className="services__grid">
          {services.map((s, i) => {
            const Icon = ICONS[s.icon] || IconFabrication;
            const isOpen = expandedIndex === i;
            return (
              <div className={`service-card ${isOpen ? 'service-card--expanded' : ''}`} key={s._id}>
                <span className="service-card__icon"><Icon /></span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <button className="service-card__link" onClick={() => setExpandedIndex(isOpen ? null : i)}>
                  {isOpen ? 'Show Less ↑' : 'Learn More →'}
                </button>
                {isOpen && <div className="service-card__detail-wrap"><p>{s.detail}</p></div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function GalleryPage({ items }) {
  const [activeTab, setActiveTab] = useState('All');
  const categories = ['All', ...new Set(items.map(i => i.category))];
  const filtered = activeTab === 'All' ? items : items.filter(i => i.category === activeTab);

  return (
    <div className="page gallery-page">
      <div className="page__inner">
        <div className="section__head"><h2>Gallery</h2></div>
        <div className="gallery__tabs">
          {categories.map(cat => (
            <button key={cat} className={`gallery__tab ${activeTab === cat ? 'gallery__tab--active' : ''}`} onClick={() => setActiveTab(cat)}>
              {cat}
            </button>
          ))}
        </div>
        <div className="gallery__grid">
          {filtered.map(item => (
            <div key={item._id} className="gallery__item">
              {item.mediaType === 'image' ? <img src={item.mediaUrl} alt={item.title} /> : <video src={item.mediaUrl} controls />}
              <div className="gallery__item-overlay"><span>{item.category}</span><h4>{item.title}</h4></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP COMPONENT
// ============================================================

export default function App() {
  const [currentPage, setCurrentPage] = useState('Home');
  const [services, setServices] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(!!localStorage.getItem('adminToken'));

  // FETCH ALL CONTENT FROM MERN BACKEND
  const fetchContent = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/all-content');
      const data = await res.json();
      setServices(data.services || []);
      setGalleryItems(data.gallery || []);
    } catch (err) {
      console.error("Failed to fetch database content:", err);
    }
  };

  useEffect(() => { fetchContent(); }, []);

  // SECRET CODE LOGIC
  useSecretCode('admin', () => {
    if (isAdminLoggedIn) {
      setCurrentPage('AdminPanel');
    } else {
      setShowLogin(true);
    }
  });

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setShowLogin(false);
    setCurrentPage('AdminPanel');
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    if (currentPage === 'AdminPanel' && isAdminLoggedIn) {
      return <AdminDashboard onLogout={() => { setIsAdminLoggedIn(false); localStorage.removeItem('adminToken'); setCurrentPage('Home'); }} />;
    }

    switch (currentPage) {
      case 'Home': return <HomePage navigateTo={navigateTo} />;
      case 'Services': return <ServicesPage services={services} />;
      case 'Gallery': return <GalleryPage items={galleryItems} />;
      case 'About': return <div className="page"><h2>About Us</h2></div>; // Placeholder
      case 'Industries': return <div className="page"><h2>Industries</h2></div>; // Placeholder
      case 'Why RWS': return <div className="page"><h2>Why RWS</h2></div>; // Placeholder
      case 'Contact': return <div className="page"><h2>Contact Us</h2></div>; // Placeholder
      default: return <HomePage navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="app-shell">
      <Navbar currentPage={currentPage} navigateTo={navigateTo} />
      
      <main className="main-content">
        <div key={currentPage} className="page-enter">
          {renderPage()}
          {currentPage !== 'Home' && currentPage !== 'AdminPanel' && <Footer services={services} />}
        </div>
      </main>

      {showLogin && (
        <AdminLogin onLoginSuccess={handleLoginSuccess} onClose={() => setShowLogin(false)} />
      )}
    </div>
  );
}