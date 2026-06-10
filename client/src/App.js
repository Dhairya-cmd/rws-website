import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import logo from './assets/logo.png';
import { useSecretCode } from './useSecretCode';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

const NAV = ['Home','About','Services','Industries','Why RWS','Gallery','Contact'];
const WHY=[{label:'Same-Day Response',text:'Quote back in hours, not days. We respect your production timeline.'},{label:'Overflow Capacity',text:'Scale output without hiring. Tap our capacity when you need it most.'},{label:'Robotic Precision',text:'Consistent, repeatable welds across every run — no variance, no rework.'},{label:'GTA-Based',text:'Burlington-based for fast delivery across the Greater Toronto Area.'}];
const INDUSTRIES=['Industrial Equipment','Automation & Robotics','Custom Machinery','OEM Subcontracting','Fabrication & Job Shops'];

const IcoArm=()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="22" y="50" width="20" height="6" rx="1" fill="currentColor" fillOpacity=".15"/><line x1="32" y1="50" x2="32" y2="42"/><circle cx="32" cy="42" r="3" fill="currentColor" fillOpacity=".2"/><line x1="32" y1="42" x2="20" y2="26"/><circle cx="20" cy="26" r="2.5" fill="currentColor" fillOpacity=".2"/><line x1="20" y1="26" x2="36" y2="14"/><line x1="36" y1="14" x2="46" y2="18"/><path d="M46 17L50 19L48 23L44 21Z" fill="currentColor" fillOpacity=".3"/></svg>;
const IcoTorch=()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 50L26 34" strokeWidth="3"/><rect x="24" y="30" width="14" height="10" rx="2" transform="rotate(-45 31 35)" fill="currentColor" fillOpacity=".2"/><path d="M38 26L46 18" strokeWidth="2"/><circle cx="48" cy="16" r="1.5" fill="currentColor"/><path d="M50 14l3-2M52 18l3-1M50 20l3 1" strokeWidth="1.5"/></svg>;
const IcoCNC=()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="6" y="14" width="52" height="40" rx="2" fill="currentColor" fillOpacity=".08"/><line x1="10" y1="26" x2="54" y2="26"/><rect x="28" y="22" width="8" height="8" fill="currentColor" fillOpacity=".3"/><line x1="32" y1="30" x2="32" y2="38"/><path d="M28 38L36 38L34 42L30 42Z" fill="currentColor" fillOpacity=".4"/></svg>;
const IcoFab=()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="8" y="8" width="36" height="36" rx="1" fill="currentColor" fillOpacity=".08"/><line x1="8" y1="20" x2="44" y2="20"/><line x1="8" y1="32" x2="44" y2="32"/><line x1="20" y1="8" x2="20" y2="44"/><line x1="32" y1="8" x2="32" y2="44"/><circle cx="46" cy="46" r="9" fill="currentColor" fillOpacity=".15"/><circle cx="46" cy="46" r="3" fill="currentColor" fillOpacity=".3"/></svg>;
const IcoFix=()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="6" y="46" width="52" height="8" rx="1" fill="currentColor" fillOpacity=".2"/><rect x="14" y="34" width="6" height="12" fill="currentColor" fillOpacity=".25"/><rect x="44" y="34" width="6" height="12" fill="currentColor" fillOpacity=".25"/><rect x="22" y="38" width="20" height="8" fill="currentColor" fillOpacity=".4"/><line x1="17" y1="34" x2="17" y2="22"/><line x1="47" y1="34" x2="47" y2="22"/><circle cx="17" cy="20" r="2.5" fill="currentColor" fillOpacity=".3"/><circle cx="47" cy="20" r="2.5" fill="currentColor" fillOpacity=".3"/></svg>;
const IcoAsm=()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 22L32 12L54 22L54 48L32 58L10 48Z" fill="currentColor" fillOpacity=".1"/><path d="M10 22L32 32L54 22"/><line x1="32" y1="32" x2="32" y2="58"/></svg>;
const IcoTarget=()=><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="32" cy="32" r="20"/><circle cx="32" cy="32" r="12" strokeDasharray="3 3"/><circle cx="32" cy="32" r="5" fill="currentColor" fillOpacity=".35"/><line x1="32" y1="10" x2="32" y2="16"/><line x1="32" y1="48" x2="32" y2="54"/><line x1="10" y1="32" x2="16" y2="32"/><line x1="48" y1="32" x2="54" y2="32"/></svg>;

const ICONS={IconRoboticArm:IcoArm,IconWeldingTorch:IcoTorch,IconCNC:IcoCNC,IconFabrication:IcoFab,IconFixture:IcoFix,IconAssembly:IcoAsm};

function Navbar({currentPage,navigateTo}){
  const[open,setOpen]=useState(false);
  useEffect(()=>{
    if(!open)return;
    const close=(e)=>{if(!e.target.closest('.nav__burger')&&!e.target.closest('.nav__links'))setOpen(false)};
    document.addEventListener('click',close);
    return()=>document.removeEventListener('click',close);
  },[open]);
  return(
    <nav className="nav">
      <div className="nav__logo" onClick={()=>navigateTo('Home')}><img src={logo} alt="RWS" className="nav__logo-img"/></div>
      <button className={`nav__burger ${open?'open':''}`} onClick={()=>setOpen(!open)} aria-label="Toggle menu"><span/><span/><span/></button>
      <ul className={`nav__links${open?' open':''}`}>
        {NAV.map(n=>(<li key={n}><button onClick={()=>{navigateTo(n);setOpen(false);}} className={currentPage===n?'nav__link--active':''}>{n}</button></li>))}
        <li><button className="btn btn--primary nav__btn" onClick={()=>{navigateTo('Contact');setOpen(false);}}>Get a Quote</button></li>
      </ul>
    </nav>
  );
}

function HomePage({navigateTo}){
  return(
    <div className="page home-page">
      <div className="home__video-wrap">
        <video className="home__video" autoPlay muted loop playsInline preload="metadata">
          <source src="/welding.mp4" type="video/mp4"/>
        </video>
        <div className="home__video-overlay"/>
      </div>
      <div className="home__content">
        <div className="home__eyebrow">
          <span className="home__eyebrow-dot"/>
          Milton, Ontario · Precision Since Day One
        </div>
        <h1 className="home__title">
          <span className="home__title-line--1">Robotic Welding.</span>
          <span className="home__title-line--2">Built for <em>Scale.</em></span>
        </h1>
        <p className="home__sub">High-precision robotic welding & custom fabrication for manufacturers across Ontario. Same-day quotes. Zero compromise on quality.</p>
        <div className="home__actions">
          <button className="btn btn--primary btn--lg" onClick={()=>navigateTo('Contact')}>Get a Quote →</button>
          <button className="btn btn--ghost btn--lg" onClick={()=>navigateTo('Services')}>Our Services</button>
        </div>
        <div className="home__stats">
          {[['Same-Day','Quote Response'],['6+','Core Capabilities'],['GTA','Fast Delivery']].map(([v,l])=>(
            <div key={l} className="stat"><span className="stat__val">{v}</span><span className="stat__lbl">{l}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutPage(){
  return(
    <div className="page about-page">
      <div className="page__inner">
        <div className="about__inner">
          <div className="about__content">
            <span className="tag">About RWS</span>
            <h2 className="about__title">Who We Are</h2>
            <p className="about__text">Robot Welding Services Inc. is a provider of high-quality robotic welding job shop services. We deliver precision products and services that match the demands of clients competing in a fast-moving, quality-driven market.</p>
            <p className="about__text">Based in Burlington, Ontario, we serve manufacturers across the GTA who need reliable capacity, consistent quality, and a partner who moves at the pace of production.</p>
          </div>
          <div className="about__mission">
            <div className="mission-card">
              <div className="mission-card__icon"><IcoTarget/></div>
              <h3>Our Mission</h3>
              <p>To be the most trusted robotic welding partner in Ontario — delivering quality products and responsive service that make our clients more competitive, every time.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServicesPage(){
  const[expanded,setExpanded]=useState(null);
  const services=[
    {_id:'1',title:'Robotic MIG Welding',desc:'High-volume production welding with robotic precision.',detail:'Consistent, repeatable robotic MIG welding for production manufacturing. Ideal for high-volume runs requiring exact repeatability and speed.',icon:'IconRoboticArm'},
    {_id:'2',title:'Manual TIG/MIG Welding',desc:'Expert manual welding for complex geometries.',detail:'Skilled TIG and MIG welding for stainless steel, aluminum, and custom fabrication. Perfect for complex parts that require a skilled human touch.',icon:'IconWeldingTorch'},
    {_id:'3',title:'CNC Machining',desc:'Tight-tolerance CNC machining services.',detail:'Advanced CNC machining for custom and production components. We hold tight tolerances across a range of materials.',icon:'IconCNC'},
    {_id:'4',title:'Custom Fabrication',desc:'Full-scope fabrication built to your spec.',detail:'Complete fabrication services tailored to customer drawings and specifications. From prototypes to production runs.',icon:'IconFabrication'},
    {_id:'5',title:'Fixture & Tooling Design',desc:'Production tooling that improves consistency.',detail:'Custom fixture design and build to improve manufacturing consistency, reduce cycle time, and enable repeatable robotic welding.',icon:'IconFixture'},
    {_id:'6',title:'Sub-Assemblies',desc:'Value-added assembly and integration.',detail:'Complete sub-assembly and integration services for finished products. We handle the complexity so you don\'t have to.',icon:'IconAssembly'},
  ];
  return(
    <div className="page services-page">
      <div className="page__inner">
        <div className="section__head">
          <span className="tag">Capabilities</span>
          <h2>What We Do</h2>
          <p>From robotic welding to complete sub-assemblies — full-spectrum fabrication under one roof.</p>
        </div>
        <div className="services__grid">
          {services.map((s,i)=>{
            const Icon=ICONS[s.icon]||IcoFab;
            const isOpen=expanded===i;
            return(
              <div className="service-card" key={s._id}>
                <span className="service-card__icon"><Icon/></span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <button className="service-card__link" onClick={()=>setExpanded(isOpen?null:i)}>
                  {isOpen?'Show Less ↑':'Learn More →'}
                </button>
                {isOpen&&<div className="service-card__detail-wrap"><p>{s.detail}</p></div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function IndustriesPage(){
  return(
    <div className="page industries-page">
      <div className="page__inner">
        <div className="industries__inner">
          <div className="section__head section__head--left">
            <span className="tag">Who We Serve</span>
            <h2>Industries We Support</h2>
            <p>Trusted by manufacturers and job shops across Ontario who need reliable capacity and repeatable precision.</p>
          </div>
          <ul className="industries__list">
            {INDUSTRIES.map((ind,i)=>(
              <li key={i} className="ind-item">
                <span className="ind-item__num">0{i+1}</span>
                <span>{ind}</span>
                <span className="ind-item__dot"/>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function WhyPage(){
  return(
    <div className="page why-page">
      <div className="page__inner">
        <div className="section__head">
          <span className="tag">The RWS Advantage</span>
          <h2>Why Work With Us</h2>
          <p>We're not just another fabrication shop — we're your on-demand manufacturing partner.</p>
        </div>
        <div className="why__grid">
          {WHY.map((w,i)=>(
            <div className="why-card" key={i}>
              <span className="why-card__num">0{i+1}</span>
              <h3>{w.label}</h3>
              <p>{w.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactPage(){
  const[form,setForm]=useState({name:'',email:'',company:'',service:'',message:''});
  const[files,setFiles]=useState(null);
  const[status,setStatus]=useState(null);
  const[loading,setLoading]=useState(false);
  const fileRef=useRef(null);
  const handle=e=>setForm({...form,[e.target.name]:e.target.value});
  const fmtSize=b=>{if(!b)return'0 B';const k=1024,s=['B','KB','MB','GB'],i=Math.floor(Math.log(b)/Math.log(k));return+(b/k**i).toFixed(1)+' '+s[i]};
  const submit=async e=>{
    e.preventDefault();setLoading(true);setStatus(null);
    const fd=new FormData();
    Object.keys(form).forEach(k=>fd.append(k,form[k]));
    if(files)for(let i=0;i<files.length;i++)fd.append('quoteFiles',files[i]);
    try{
      const res=await fetch('/api/contact',{method:'POST',body:fd});
      const data=await res.json();
      setStatus(data.success?'success':'error');
      if(data.success){setForm({name:'',email:'',company:'',service:'',message:''});setFiles(null);if(fileRef.current)fileRef.current.value='';}
    }catch{setStatus('error');}finally{setLoading(false);}
  };
  return(
    <div className="page contact-page">
      <div className="page__inner">
        <div className="contact__inner">
          <div className="contact__info">
            <span className="tag">Get In Touch</span>
            <h2>Ready to Quote?</h2>
            <p>Send your drawings (DWG, PDF, STEP) and we'll respond same-day with a competitive quote.</p>
            <div className="contact__details">
              {[['📍','483 Enfield Rd Unit 3, Burlington ON L7T 2X5'],['📞','+1 (647) 922-0496'],['✉️','sales@robotweldingservices.com'],['📐','kash@robotweldingservices.com (Quotes)']].map(([icon,val])=>(
                <div key={val} className="contact__item"><span>{icon}</span><span>{val}</span></div>
              ))}
            </div>
          </div>
          <form className="contact__form" onSubmit={submit}>
            <div className="form-row">
              <input name="name" value={form.name} onChange={handle} placeholder="Your Name *" required disabled={loading}/>
              <input name="email" type="email" value={form.email} onChange={handle} placeholder="Email Address *" required disabled={loading}/>
            </div>
            <div className="form-row">
              <div className="input-optional-wrap">
                <input name="company" value={form.company} onChange={handle} placeholder="Company Name" disabled={loading}/>
                <span className="input-optional-badge">Optional</span>
              </div>
              <select name="service" value={form.service} onChange={handle} disabled={loading}>
                <option value="">Select Service</option>
                {['Robotic MIG Welding','Manual TIG/MIG Welding','CNC Machining','Custom Fabrication','Fixture & Tooling','Sub-Assemblies'].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <textarea name="message" value={form.message} onChange={handle} placeholder="Describe your project *" rows={4} required disabled={loading}/>
            <div>
              <label htmlFor="quote-files" className="contact-form__label">Attach Files (up to 5)</label>
              <input id="quote-files" type="file" name="quoteFiles" multiple onChange={e=>setFiles(e.target.files)} disabled={loading} ref={fileRef} accept=".pdf,.dwg,.dxf,.step,.stp,.iges,.zip,image/*"/>
              {files&&files.length>0&&(
                <div className="file-list">
                  <p>{files.length} file(s) selected</p>
                  <ul>{Array.from(files).map((f,i)=><li key={i} className="file-list-item"><span className="file-name">{f.name}</span><span className="file-size">{fmtSize(f.size)}</span></li>)}</ul>
                </div>
              )}
            </div>
            <button type="submit" className="btn btn--primary btn--full" disabled={loading}>{loading?'Sending…':'Send Message & Files →'}</button>
            {status==='success'&&<p className="form__msg form__msg--ok">✅ Message sent! We'll respond same-day.</p>}
            {status==='error'&&<p className="form__msg form__msg--err">❌ Something went wrong. Please email us directly.</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

function GalleryPage(){
  const[items,setItems]=useState([]);
  const[cats,setCats]=useState([]);
  const[loading,setLoading]=useState(true);
  const[activeCat,setActiveCat]=useState('All');
  const[mediaType,setMediaType]=useState('Photos');
  const[lb,setLb]=useState(null);
  const[lbIdx,setLbIdx]=useState(null);
  const[lbList,setLbList]=useState([]);

  useEffect(()=>{
    fetch('/api/admin/all-content').then(r=>r.json()).then(d=>{
      setItems(d.gallery||[]);
      const c=[...new Set((d.gallery||[]).map(i=>i.category))];
      setCats(c);
    }).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  const filtered=activeCat==='All'?items:items.filter(i=>i.category===activeCat);
  const display=mediaType==='Photos'?filtered.filter(i=>i.type==='image'):filtered.filter(i=>i.type==='video');

  const openLb=(item,list)=>{setLb(item);setLbIdx(list.findIndex(i=>i._id===item._id));setLbList(list)};
  const navLb=d=>{let ni=(lbIdx+d+lbList.length)%lbList.length;setLbIdx(ni);setLb(lbList[ni])};
  useEffect(()=>{
    if(!lb)return;
    document.body.style.overflow='hidden';
    const k=e=>{if(e.key==='Escape')setLb(null);if(e.key==='ArrowRight')navLb(1);if(e.key==='ArrowLeft')navLb(-1)};
    document.addEventListener('keydown',k);
    return()=>{document.body.style.overflow='';document.removeEventListener('keydown',k)};
  },[lb,lbIdx,lbList]);

  return(
    <div className="page gallery-page">
      <div className="page__inner">
        <div className="section__head">
          <span className="tag">Our Work</span>
          <h2>Project Gallery</h2>
          <p>Explore our portfolio of precision fabrication and welding projects.</p>
        </div>
        <div className="gallery__tabs">
          <button className={`gallery__tab ${activeCat==='All'?'gallery__tab--active':''}`} onClick={()=>setActiveCat('All')}>All <span className="gallery__tab-count">{items.length}</span></button>
          {cats.map(c=><button key={c} className={`gallery__tab ${activeCat===c?'gallery__tab--active':''}`} onClick={()=>setActiveCat(c)}>{c}<span className="gallery__tab-count">{items.filter(i=>i.category===c).length}</span></button>)}
        </div>
        <div className="media-type-switcher">
          <button className={`type-btn ${mediaType==='Photos'?'active':''}`} onClick={()=>setMediaType('Photos')}>📷 Photos</button>
          <button className={`type-btn ${mediaType==='Videos'?'active':''}`} onClick={()=>setMediaType('Videos')}>▶ Videos</button>
        </div>
        {loading?<div className="gallery__loading"><div className="gallery__spinner"/></div>:display.length===0?
          <div className="gallery__empty"><div className="gallery__empty-icon">📷</div><p>No {mediaType.toLowerCase()} for this category yet.</p></div>:
          <div className="gallery-grid-wrapper">
            <div className="gallery__grid">
              {display.map((item)=>(
                <div key={item._id} className="gallery__item" onClick={()=>openLb(item,display)}>
                  {item.type==='image'?<img src={item.mediaUrl} alt={item.title||item.category} loading="lazy"/>:<><video src={item.mediaUrl} muted playsInline preload="metadata"/><span className="gallery__play-icon">▶</span></>}
                  <div className="gallery__item-overlay">
                    <span className="gallery__item-category">{item.category}</span>
                    {item.title&&<span className="gallery__item-title">{item.title}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      </div>
      {lb&&(
        <div className="lightbox" onClick={()=>setLb(null)}>
          <button className="lightbox__close">✕</button>
          {lbList.length>1&&<><button className="lightbox__arrow lightbox__arrow--prev" onClick={e=>{e.stopPropagation();navLb(-1)}}>‹</button><button className="lightbox__arrow lightbox__arrow--next" onClick={e=>{e.stopPropagation();navLb(1)}}>›</button></>}
          <div className="lightbox__content" onClick={e=>e.stopPropagation()}>
            {lb.type==='image'?<img src={lb.mediaUrl} alt={lb.title||lb.category}/>:<video src={lb.mediaUrl} controls autoPlay playsInline/>}
            <div className="lightbox__info">
              <div className="lightbox__info-left"><span className="lightbox__info-type">{lb.type==='video'?'🎬':'📷'}</span><div><h3>{lb.category}</h3>{lb.title&&<p>{lb.title}</p>}</div></div>
              <span className="lightbox__counter">{lbIdx+1}/{lbList.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Footer(){
  return(
    <footer className="footer">
      <div className="footer__inner">
        <div>
          <img src={logo} alt="RWS" className="footer__logo-img"/>
          <p>Robot Welding Services Inc.</p>
          <p>Precision fabrication. Built to spec.<br/>Delivered on time, every time.</p>
        </div>
        <div>
          <h4>Services</h4>
          {['Robotic MIG Welding','Manual TIG/MIG','CNC Machining','Custom Fabrication','Fixtures & Tooling','Sub-Assemblies'].map(s=><p key={s}>{s}</p>)}
        </div>
        <div>
          <h4>Location</h4>
          <p>483 Enfield Rd Unit 3<br/>Burlington, ON L7T 2X5</p>
          <p>+1 (647) 922-0496</p>
          <p>sales@robotweldingservices.com</p>
        </div>
        <div>
          <h4>Contact</h4>
          <p><strong>Kashish Jani (Kash)</strong></p>
          <p>President</p>
          <p>+1-647-922-0496</p>
          <p>kash@robotweldingservices.com</p>
        </div>
      </div>
      <div className="footer__bottom"><p>© {new Date().getFullYear()} Robot Welding Services Inc. All rights reserved.</p></div>
    </footer>
  );
}

export default function App(){
  const[currentPage,setCurrentPage]=useState('Home');
  const[showLogin,setShowLogin]=useState(false);
  const[isAdmin,setIsAdmin]=useState(()=>!!localStorage.getItem('adminToken'));

  useSecretCode('admin',()=>{
    if(localStorage.getItem('adminToken')) setIsAdmin(true);
    else setShowLogin(true);
  });

  const navigateTo=page=>{
    if(page===currentPage)return;
    setCurrentPage(page);
    window.scrollTo({top:0,behavior:'smooth'});
  };

  if(isAdmin) return <AdminDashboard onLogout={()=>{localStorage.removeItem('adminToken');setIsAdmin(false)}}/>;

  const renderPage=()=>{
    switch(currentPage){
      case 'Home':return<HomePage navigateTo={navigateTo}/>;
      case 'About':return<AboutPage/>;
      case 'Services':return<ServicesPage/>;
      case 'Industries':return<IndustriesPage/>;
      case 'Why RWS':return<WhyPage/>;
      case 'Gallery':return<GalleryPage/>;
      case 'Contact':return<ContactPage/>;
      default:return<HomePage navigateTo={navigateTo}/>;
    }
  };
  return(
    <div className="app-shell">
      <Navbar currentPage={currentPage} navigateTo={navigateTo}/>
      <main className={currentPage==='Home'?'home-page-wrap':''}>
        <div key={currentPage} className="page-enter">
          {renderPage()}
          {currentPage!=='Home'&&<Footer/>}
        </div>
      </main>
      {showLogin&&<AdminLogin onLoginSuccess={()=>{setShowLogin(false);setIsAdmin(true)}} onClose={()=>setShowLogin(false)}/>}
    </div>
  );
}