import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import logo from "./assets/logo.png";

import heroImage from "./assets/rb.jpeg";
import bgAbout1 from "./assets/rb3.jpeg";
import bgAbout2 from "./assets/rb3.jpeg";
import bgServices1 from "./assets/rb4.jpeg";
import bgServices2 from "./assets/rb4.jpeg";
import bgIndustries1 from "./assets/rb5.jpeg";
import bgIndustries2 from "./assets/rb5.jpeg";
import bgGallery1 from "./assets/rb6.jpeg";
import bgGallery2 from "./assets/rb6.jpeg";
import bgContact1 from "./assets/rb7.jpeg";
import bgContact2 from "./assets/rb7.jpeg";

import heroVideo from "./assets/homepage-video.mp4";

import { useSecretCode } from "./useSecretCode";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";

const NAV = [
  "Home",
  "About",
  "Services",
  "Industries",
  "Why RWS",
  "Gallery",
  "Contact",
];

const WHY = [
  {
    label: "Same-Day Response",
    text: "Quote back in hours, not days. We respect your production timeline.",
  },
  {
    label: "Overflow Capacity",
    text: "Scale output without hiring. Tap our capacity when you need it most.",
  },
  {
    label: "Robotic Precision",
    text: "Consistent, repeatable welds across every run — no variance, no rework.",
  },
  {
    label: "GTA-Based",
    text: "Burlington-based for fast delivery across the Greater Toronto Area.",
  },
];

const INDUSTRIES = [
  "Industrial Equipment",
  "Automation & Robotics",
  "Custom Machinery",
  "OEM Subcontracting",
  "Fabrication & Job Shops",
];

const SECTION_BACKGROUNDS = {
  about: [bgAbout1, bgAbout2],
  services: [bgServices1, bgServices2],
  industries: [bgIndustries1, bgIndustries2],
  why: [bgAbout2, bgServices1],
  gallery: [bgGallery1, bgGallery2],
  contact: [bgContact1, bgContact2],
};

const IcoTarget = () => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <circle cx="32" cy="32" r="20" />
    <circle cx="32" cy="32" r="12" strokeDasharray="3 3" />
    <circle cx="32" cy="32" r="5" fill="currentColor" fillOpacity=".35" />
    <line x1="32" y1="10" x2="32" y2="16" />
    <line x1="32" y1="48" x2="32" y2="54" />
    <line x1="10" y1="32" x2="16" y2="32" />
    <line x1="48" y1="32" x2="54" y2="32" />
  </svg>
);

function Navbar({ currentPage, navigateTo }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (!e.target.closest(".nav__burger") && !e.target.closest(".nav__links"))
        setOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);

  return (
    <nav className="nav">
      <div className="nav__logo" onClick={() => navigateTo("Home")}>
        <img src={logo} alt="RWS" className="nav__logo-img" />
      </div>

      <button
        className={`nav__burger ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      <ul className={`nav__links${open ? " open" : ""}`}>
        {NAV.map((n) => (
          <li key={n}>
            <button
              onClick={() => {
                navigateTo(n);
                setOpen(false);
              }}
              className={currentPage === n ? "nav__link--active" : ""}
            >
              {n}
            </button>
          </li>
        ))}
        <li>
          <button
            className="btn btn--primary nav__btn"
            onClick={() => {
              navigateTo("Contact");
              setOpen(false);
            }}
          >
            Get a Quote
          </button>
        </li>
      </ul>
    </nav>
  );
}

function SectionBg({ images }) {
  return (
    <div className="section-bg" aria-hidden="true">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className={`section-bg__img section-bg__img--${i + 1}`}
        />
      ))}
      <div className="section-bg__overlay" />
    </div>
  );
}

function HomePage({ navigateTo }) {
  return (
    <div className="page home-page">
      <div className="home__hero-wrap" aria-hidden="true">
  <video
  className="home__hero-video"
  autoPlay
  muted
  loop
  playsInline
  poster={heroImage}
>
  <source src={heroVideo} type="video/mp4" />
  <img className="home__hero-image" src={heroImage} alt="" />
</video>
  <div className="home__hero-overlay" />
  <div className="home__hero-grain" />
</div>

      <div className="home__content">
        <div className="home__eyebrow">
          <span className="home__eyebrow-dot" />
          Burlington, Ontario · Precision Since Day One
        </div>

        <h1 className="home__title">
          <span className="home__title-line--1">Elite Fabrication.</span>
          <span className="home__title-line--2">
            Built For <em>Production.</em>
          </span>
        </h1>

        <p className="home__sub">
          High-precision robotic welding & custom fabrication for manufacturers
          across Ontario. Same-day quotes. Zero compromise on quality.
        </p>

        <div className="home__actions">
          <button
            className="btn btn--primary btn--lg"
            onClick={() => navigateTo("Contact")}
          >
            Get a Quote →
          </button>
          <button
            className="btn btn--ghost btn--lg"
            onClick={() => navigateTo("Services")}
          >
            Our Services
          </button>
        </div>

        <div className="home__stats">
          {[
            ["Same-Day", "Quote Response"],
            ["6+", "Core Capabilities"],
            ["GTA", "Fast Delivery"],
          ].map(([v, l]) => (
            <div key={l} className="stat">
              <span className="stat__val">{v}</span>
              <span className="stat__lbl">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="page page--bg about-page">
      <SectionBg images={SECTION_BACKGROUNDS.about} />
      <div className="page__inner page__inner--wide">
        <div className="section__head section__head--left section__head--light">
          <span className="tag">About RWS</span>
          <h2>Who We Are</h2>
          <p>
            Robot Welding Services Inc. is a provider of high-quality robotic
            welding job shop services. We deliver precision products and
            services that match the demands of clients competing in a
            fast-moving, quality-driven market.
          </p>
        </div>

        <div className="feature-split">
          <div className="feature-panel">
            <h3>Built for production teams</h3>
            <p>
              Based in Burlington, Ontario, we serve manufacturers across the
              GTA who need reliable capacity, consistent quality, and a partner
              who moves at the pace of production.
            </p>
            <div className="feature-list">
              <div>
                <strong>Precision</strong>
                <span>Repeatable weld quality across every run.</span>
              </div>
              <div>
                <strong>Speed</strong>
                <span>Fast turnaround without sacrificing fit or finish.</span>
              </div>
              <div>
                <strong>Capacity</strong>
                <span>Support for overflow work and scaling demand.</span>
              </div>
            </div>
          </div>

          <div className="mission-card mission-card--glass">
            <div className="mission-card__icon">
              <IcoTarget />
            </div>
            <h3>Our Mission</h3>
            <p>
              To be the most trusted robotic welding partner in Ontario —
              delivering quality products and responsive service that make our
              clients more competitive, every time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServicesPage() {
  const [expanded, setExpanded] = useState(null);
  const [services, setServices] = useState([
    {
      _id: "1",
      title: "Robotic MIG Welding",
      desc: "High-volume, repeatable production welding with FANUC-class robotic cells engineered for cycle-time and consistency.",
      detail:
        "Ideal for production runs requiring exact repeatability and speed. We program, fixture, and run cells in-house — including weld parameter optimization for carbon steel, stainless and aluminum.",
    },
    {
      _id: "2",
      title: "Manual TIG / MIG Welding",
      desc: "Certified welders for low-volume, precision, and complex geometries across carbon, stainless and aluminum.",
      detail:
        "Skilled TIG and MIG welding for prototypes, repair work, and complex parts that require a craftsman's eye. Pressure-vessel, structural and decorative finishes available.",
    },
    {
      _id: "3",
      title: "CNC Machining",
      desc: "Tight-tolerance milling and turning for production parts, prototypes and post-weld finishing.",
      detail:
        "Advanced CNC machining for custom and production components across a wide range of materials. We hold tight tolerances and integrate machining with our welding workflow for seamless lead times.",
    },
    {
      _id: "4",
      title: "Custom Fabrication",
      desc: "From laser-cut blanks to fully finished assemblies — built to print, on schedule.",
      detail:
        "Complete fabrication services tailored to customer drawings and specifications. From prototypes to production runs, with in-house finishing and inspection.",
    },
    {
      _id: "5",
      title: "Fixture & Tooling Design",
      desc: "In-house design of welding fixtures and tooling that lock in repeatability across every run.",
      detail:
        "Custom fixture design and build to improve manufacturing consistency, reduce cycle time, and enable repeatable robotic welding for your specific parts.",
    },
    {
      _id: "6",
      title: "Sub-Assemblies",
      desc: "Turn-key sub-assembly programs that reduce your vendor count and shorten lead times.",
      detail:
        "Complete sub-assembly and integration services for finished products. We handle the complexity so your line gets parts that fit, work, and ship — every time.",
    },
  ]);

  useEffect(() => {
    fetch("/api/admin/all-content")
      .then((r) => r.json())
      .then((d) => {
        if (d.services && d.services.length > 0) setServices(d.services);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="page page--bg services-page">
      <SectionBg images={SECTION_BACKGROUNDS.services} />
      <div className="page__inner page__inner--wide">
        <div className="section__head section__head--light">
          <span className="tag">Capabilities</span>
          <h2>Precision Manufacturing Services</h2>
          <p>
            From robotic welding to complete sub-assemblies — full-spectrum
            fabrication under one roof, trusted by OEMs across the GTA.
          </p>
        </div>

        <div className="services__grid services__grid--wide">
          {services.map((s, i) => {
            const isOpen = expanded === i;
            return (
              <div className="service-card service-card--glass" key={s._id}>
                <div className="service-card__num">0{i + 1}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <button
                  className="service-card__link"
                  onClick={() => setExpanded(isOpen ? null : i)}
                >
                  {isOpen ? "Show Less ↑" : "Learn More →"}
                </button>
                {isOpen && (
                  <div className="service-card__detail-wrap">
                    <p>{s.detail}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function IndustriesPage() {
  return (
    <div className="page page--bg industries-page">
      <SectionBg images={SECTION_BACKGROUNDS.industries} />
      <div className="page__inner page__inner--wide">
        <div className="industries__inner">
          <div className="section__head section__head--left section__head--light">
            <span className="tag">Who We Serve</span>
            <h2>Industries We Support</h2>
            <p>
              Trusted by manufacturers and job shops across Ontario who need
              reliable capacity and repeatable precision.
            </p>
          </div>

          <div className="industries-layout">
            <ul className="industries__list industries__list--glass">
              {INDUSTRIES.map((ind, i) => (
                <li key={i} className="ind-item">
                  <span className="ind-item__num">0{i + 1}</span>
                  <span>{ind}</span>
                  <span className="ind-item__dot" />
                </li>
              ))}
            </ul>

            <div className="industries-copy card-glass">
              <h3>Built for demanding environments</h3>
              <p>
                We support businesses where uptime, precision, and reliability
                matter. Our work is designed to fit into supply chains that
                expect professional communication, dependable execution, and
                consistent output.
              </p>
              <p>
                That means every project is handled with the same standards —
                from prototypes to repeat production runs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WhyPage() {
  return (
    <div className="page page--bg why-page">
      <SectionBg images={SECTION_BACKGROUNDS.why} />
      <div className="page__inner page__inner--wide">
        <div className="section__head section__head--light">
          <span className="tag">The RWS Advantage</span>
          <h2>Why Work With Us</h2>
          <p>
            We're not just another fabrication shop — we're your on-demand
            manufacturing partner.
          </p>
        </div>

        <div className="why__grid why__grid--wide">
          {WHY.map((w, i) => (
            <div className="why-card why-card--glass" key={i}>
              <span className="why-card__num">0{i + 1}</span>
              <h3>{w.label}</h3>
              <p>{w.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });
  const [files, setFiles] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [serviceFocus, setServiceFocus] = useState(-1);
  const fileRef = useRef(null);
  const serviceWrapRef = useRef(null);

  const [serviceOptions, setServiceOptions] = useState([
  "Robotic MIG Welding",
  "Manual TIG/MIG Welding",
  "CNC Machining",
  "Custom Fabrication",
  "Fixture & Tooling",
  "Sub-Assemblies",
]);

useEffect(() => {
  fetch("/api/admin/all-content")
    .then((r) => r.json())
    .then((d) => {
      if (d.services && d.services.length > 0)
        setServiceOptions(d.services.map((s) => s.title));
    })
    .catch(() => {});
}, []);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const fmtSize = (b) => {
    if (!b) return "0 B";
    const k = 1024;
    const s = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(b) / Math.log(k));
    return +(b / k ** i).toFixed(1) + " " + s[i];
  };

  useEffect(() => {
    const onDocClick = (e) => {
      if (
        serviceWrapRef.current &&
        !serviceWrapRef.current.contains(e.target)
      ) {
        setServiceOpen(false);
        setServiceFocus(-1);
      }
    };

    const onKeyDown = (e) => {
      if (!serviceOpen) return;

      if (e.key === "Escape") {
        setServiceOpen(false);
        setServiceFocus(-1);
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setServiceFocus((prev) => (prev + 1) % serviceOptions.length);
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setServiceFocus((prev) =>
          prev <= 0 ? serviceOptions.length - 1 : prev - 1,
        );
      }

      if (e.key === "Enter" && serviceFocus >= 0) {
        e.preventDefault();
        setForm((prev) => ({ ...prev, service: serviceOptions[serviceFocus] }));
        setServiceOpen(false);
        setServiceFocus(-1);
      }
    };

    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [serviceOpen, serviceFocus]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const fd = new FormData();
    Object.keys(form).forEach((k) => fd.append(k, form[k]));
    if (files)
      for (let i = 0; i < files.length; i++) fd.append("quoteFiles", files[i]);

    try {
      const res = await fetch("/api/contact", { method: "POST", body: fd });
      const data = await res.json();
      setStatus(data.success ? "success" : "error");

      if (data.success) {
        setForm({ name: "", email: "", company: "", service: "", message: "" });
        setFiles(null);
        setServiceOpen(false);
        setServiceFocus(-1);
        if (fileRef.current) fileRef.current.value = "";
      }
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const selectedLabel = form.service || "Select Service";

  return (
    <div className="page page--bg contact-page">
      <SectionBg images={SECTION_BACKGROUNDS.contact} />
      <div className="page__inner page__inner--wide">
        <div className="contact__inner contact__inner--wide">
          <div className="contact__info card-glass">
            <span className="tag">Get In Touch</span>
            <h2>Ready to Quote?</h2>
            <p>
              Send your drawings (DWG, PDF, STEP) and we'll respond same-day
              with a competitive quote.
            </p>

            <div className="contact__details">
              {[
                ["📍", "483 Enfield Rd Unit 3, Burlington ON L7T 2X5"],
                ["📞", "+1 (647) 922-0496"],
                ["✉️", "sales@robotweldingservices.com"],
                ["📐", "kash@robotweldingservices.com (Quotes)"],
              ].map(([icon, val]) => (
                <div key={val} className="contact__item">
                  <span>{icon}</span>
                  <span>{val}</span>
                </div>
              ))}
            </div>
          </div>

          <form
            className="contact__form contact__form--glass"
            onSubmit={submit}
          >
            <div className="form-row">
              <input
                name="name"
                value={form.name}
                onChange={handle}
                placeholder="Your Name *"
                required
                disabled={loading}
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handle}
                placeholder="Email Address *"
                required
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="input-optional-wrap">
                <input
                  name="company"
                  value={form.company}
                  onChange={handle}
                  placeholder="Company Name"
                  disabled={loading}
                />
                <span className="input-optional-badge">Optional</span>
              </div>

              <div className="custom-select" ref={serviceWrapRef}>
                <button
                  type="button"
                  className={`custom-select__control ${serviceOpen ? "open" : ""} ${form.service ? "has-value" : ""}`}
                  onClick={() => {
                    if (!loading) {
                      setServiceOpen((v) => !v);
                      setServiceFocus(
                        form.service ? serviceOptions.indexOf(form.service) : 0,
                      );
                    }
                  }}
                  disabled={loading}
                  aria-haspopup="listbox"
                  aria-expanded={serviceOpen}
                >
                  <span className="custom-select__value">{selectedLabel}</span>
                  <span className="custom-select__chev">⌄</span>
                </button>

                {serviceOpen && (
                  <div className="custom-select__menu" role="listbox">
                    {serviceOptions.map((opt, idx) => {
                      const active = form.service === opt;
                      const focused = serviceFocus === idx;

                      return (
                        <button
                          key={opt}
                          type="button"
                          className={`custom-select__option ${active ? "active" : ""} ${focused ? "focused" : ""}`}
                          onMouseEnter={() => setServiceFocus(idx)}
                          onClick={() => {
                            setForm((prev) => ({ ...prev, service: opt }));
                            setServiceOpen(false);
                            setServiceFocus(-1);
                          }}
                          role="option"
                          aria-selected={active}
                        >
                          <span>{opt}</span>
                          {active && (
                            <span className="custom-select__check">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                <input type="hidden" name="service" value={form.service} />
              </div>
            </div>

            <textarea
              name="message"
              value={form.message}
              onChange={handle}
              placeholder="Describe your project *"
              rows={4}
              required
              disabled={loading}
            />

            <div>
              <label htmlFor="quote-files" className="contact-form__label">
                Attach Files (up to 5)
              </label>
              <input
                id="quote-files"
                type="file"
                name="quoteFiles"
                multiple
                onChange={(e) => setFiles(e.target.files)}
                disabled={loading}
                ref={fileRef}
                accept=".pdf,.dwg,.dxf,.step,.stp,.iges,.zip,image/*"
              />
              {files && files.length > 0 && (
                <div className="file-list">
                  <p>{files.length} file(s) selected</p>
                  <ul>
                    {Array.from(files).map((f, i) => (
                      <li key={i} className="file-list-item">
                        <span className="file-name">{f.name}</span>
                        <span className="file-size">{fmtSize(f.size)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn--primary btn--full"
              disabled={loading}
            >
              {loading ? "Sending…" : "Send Message & Files →"}
            </button>

            {status === "success" && (
              <p className="form__msg form__msg--ok">
                ✅ Message sent! We'll respond same-day.
              </p>
            )}
            {status === "error" && (
              <p className="form__msg form__msg--err">
                ❌ Something went wrong. Please email us directly.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

function GalleryPage() {
  const [items, setItems] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState("All");
  const [mediaType, setMediaType] = useState("Photos");
  const [lb, setLb] = useState(null);
  const [lbIdx, setLbIdx] = useState(null);
  const [lbList, setLbList] = useState([]);

  useEffect(() => {
    fetch("/api/admin/all-content")
      .then((r) => r.json())
      .then((d) => {
        setItems(d.gallery || []);
        const c = [...new Set((d.gallery || []).map((i) => i.category))];
        setCats(c);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeCat === "All" ? items : items.filter((i) => i.category === activeCat);
  const display =
    mediaType === "Photos"
      ? filtered.filter((i) => i.type === "image")
      : filtered.filter((i) => i.type === "video");

  const openLb = (item, list) => {
    setLb(item);
    setLbIdx(list.findIndex((i) => i._id === item._id));
    setLbList(list);
  };

  const navLb = (d) => {
    const ni = (lbIdx + d + lbList.length) % lbList.length;
    setLbIdx(ni);
    setLb(lbList[ni]);
  };

  useEffect(() => {
    if (!lb) return;
    document.body.style.overflow = "hidden";
    const k = (e) => {
      if (e.key === "Escape") setLb(null);
      if (e.key === "ArrowRight") navLb(1);
      if (e.key === "ArrowLeft") navLb(-1);
    };
    document.addEventListener("keydown", k);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", k);
    };
  }, [lb, lbIdx, lbList]);

  return (
    <div className="page page--bg gallery-page">
      <SectionBg images={SECTION_BACKGROUNDS.gallery} />
      <div className="page__inner page__inner--wide">
        <div className="section__head section__head--light">
          <span className="tag">Our Work</span>
          <h2>Gallery</h2>
          <p>
            Explore our portfolio of precision fabrication and welding projects.
          </p>
        </div>

        <div className="gallery-toolbar">
          <div className="gallery__tabs">
            <button
              className={`gallery__tab ${activeCat === "All" ? "gallery__tab--active" : ""}`}
              onClick={() => setActiveCat("All")}
            >
              All
            </button>
            {cats.map((c) => (
              <button
                key={c}
                className={`gallery__tab ${activeCat === c ? "gallery__tab--active" : ""}`}
                onClick={() => setActiveCat(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="media-type-switcher">
            <button
              className={`type-btn ${mediaType === "Photos" ? "active" : ""}`}
              onClick={() => setMediaType("Photos")}
            >
              📷 Photos
            </button>
            <button
              className={`type-btn ${mediaType === "Videos" ? "active" : ""}`}
              onClick={() => setMediaType("Videos")}
            >
              ▶ Videos
            </button>
          </div>
        </div>

        {loading ? (
          <div className="gallery__loading">
            <div className="gallery__spinner" />
          </div>
        ) : display.length === 0 ? (
          <div className="gallery__empty">
            <div className="gallery__empty-icon">📷</div>
            <p>No {mediaType.toLowerCase()} for this category yet.</p>
          </div>
        ) : (
          <div className="gallery-grid-wrapper">
            <div className="gallery__grid">
              {display.map((item) => (
                <div
                  key={item._id}
                  className="gallery__item"
                  onClick={() => openLb(item, display)}
                >
                  {item.type === "image" ? (
                    <img
                      src={item.mediaUrl}
                      alt={item.title || item.category}
                      loading="lazy"
                    />
                  ) : (
                    <>
                      <video
                        src={item.mediaUrl}
                        muted
                        playsInline
                        preload="metadata"
                      />
                      <span className="gallery__play-icon">▶</span>
                    </>
                  )}
                  <div className="gallery__item-overlay">
                    <span className="gallery__item-category">
                      {item.category}
                    </span>
                    {item.title && (
                      <span className="gallery__item-title">{item.title}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {lb && (
        <div className="lightbox" onClick={() => setLb(null)}>
          <button className="lightbox__close">✕</button>
          {lbList.length > 1 && (
            <>
              <button
                className="lightbox__arrow lightbox__arrow--prev"
                onClick={(e) => {
                  e.stopPropagation();
                  navLb(-1);
                }}
              >
                ‹
              </button>
              <button
                className="lightbox__arrow lightbox__arrow--next"
                onClick={(e) => {
                  e.stopPropagation();
                  navLb(1);
                }}
              >
                ›
              </button>
            </>
          )}
          <div
            className="lightbox__content"
            onClick={(e) => e.stopPropagation()}
          >
            {lb.type === "image" ? (
              <img src={lb.mediaUrl} alt={lb.title || lb.category} />
            ) : (
              <video
  src={lb.mediaUrl}
  controls
  autoPlay
  playsInline
  style={{
    width:'100%',
    minWidth:'min(1280px,90vw)',
    maxWidth:'90vw',
    maxHeight:'76vh',
    borderRadius:'14px',
    background:'#000'
  }}
/>
            )}
            <div className="lightbox__info">
              <div className="lightbox__info-left">
                <span className="lightbox__info-type">
                  {lb.type === "video" ? "🎬" : "📷"}
                </span>
                <div>
                  <h3>{lb.category}</h3>
                  {lb.title && <p>{lb.title}</p>}
                </div>
              </div>
              <span className="lightbox__counter">
                {lbIdx + 1}/{lbList.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div>
          <img src={logo} alt="RWS" className="footer__logo-img" />
          <p>Robot Welding Services Inc.</p>
          <p>
            Precision fabrication. Built to spec.
            <br />
            Delivered on time, every time.
          </p>
        </div>
        <div>
          <h4>Services</h4>
          {[
            "Robotic MIG Welding",
            "Manual TIG/MIG",
            "CNC Machining",
            "Custom Fabrication",
            "Fixtures & Tooling",
            "Sub-Assemblies",
          ].map((s) => (
            <p key={s}>{s}</p>
          ))}
        </div>
        <div>
          <h4>Location</h4>
          <p>
            483 Enfield Rd Unit 3<br />
            Burlington, ON L7T 2X5
          </p>
          <p>+1 (647) 922-0496</p>
          <p>sales@robotweldingservices.com</p>
        </div>
        <div>
          <h4>Contact</h4>
          <p>
            <strong>Kashish Jani (Kash)</strong>
          </p>
          <p>President</p>
          <p>+1-647-922-0496</p>
          <p>kash@robotweldingservices.com</p>
        </div>
      </div>
      <div className="footer__bottom">
        <p>
          © {new Date().getFullYear()} Robot Welding Services Inc. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("Home");
  const [showLogin, setShowLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(
    () => !!localStorage.getItem("adminToken"),
  );

  useSecretCode("admin", () => {
    if (localStorage.getItem("adminToken")) setIsAdmin(true);
    else setShowLogin(true);
  });

  const navigateTo = (page) => {
    if (page === currentPage) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isAdmin)
    return (
      <AdminDashboard
        onLogout={() => {
          localStorage.removeItem("adminToken");
          setIsAdmin(false);
        }}
      />
    );

  const renderPage = () => {
    switch (currentPage) {
      case "Home":
        return <HomePage navigateTo={navigateTo} />;
      case "About":
        return <AboutPage />;
      case "Services":
        return <ServicesPage />;
      case "Industries":
        return <IndustriesPage />;
      case "Why RWS":
        return <WhyPage />;
      case "Gallery":
        return <GalleryPage />;
      case "Contact":
        return <ContactPage />;
      default:
        return <HomePage navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="app-shell">
      <Navbar currentPage={currentPage} navigateTo={navigateTo} />
      <main className={currentPage === "Home" ? "home-page-wrap" : ""}>
        <div key={currentPage} className="page-enter">
          {renderPage()}
          <Footer />
        </div>
      </main>
      {showLogin && (
        <AdminLogin
          onLoginSuccess={() => {
            setShowLogin(false);
            setIsAdmin(true);
          }}
          onClose={() => setShowLogin(false)}
        />
      )}
    </div>
  );
}
