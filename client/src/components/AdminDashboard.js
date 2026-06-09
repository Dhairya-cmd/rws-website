import React, { useState, useEffect, useRef } from 'react';
import './AdminDashboard.css';

const CATEGORIES = ['Robotic Welding', 'Manual Welding', 'CNC Machining', 'Metal Fabrication', 'Fixture & Tooling', 'Sub-Assembly'];
const MEDIA_TYPES = ['image', 'video'];

const RWS_ICONS = {
  'IconRoboticArm': () => ( <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="22" y="50" width="20" height="6" rx="1" fill="currentColor" fillOpacity="0.15"/><line x1="32" y1="42" x2="20" y2="26"/><circle cx="32" cy="42" r="3.5" fill="currentColor" fillOpacity="0.2"/><path d="M46 17 L50 19 L48 23 L44 21 Z" fill="currentColor" fillOpacity="0.25"/></svg> ),
  'IconWeldingTorch': () => ( <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M10 50 L26 34" strokeWidth="3.5"/><rect x="24" y="30" width="14" height="10" rx="2" transform="rotate(-45 31 35)" fill="currentColor" fillOpacity="0.2"/><circle cx="48" cy="16" r="1.5" fill="currentColor"/></svg> ),
  'IconCNC': () => ( <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="6" y="14" width="52" height="40" rx="2" fill="currentColor" fillOpacity="0.08"/><line x1="10" y1="26" x2="54" y2="26"/><rect x="28" y="22" width="8" height="8" fill="currentColor" fillOpacity="0.3"/></svg> ),
  'IconFabrication': () => ( <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="8" y="8" width="36" height="36" rx="1" fill="currentColor" fillOpacity="0.08"/><circle cx="46" cy="46" r="9" fill="currentColor" fillOpacity="0.15"/></svg> ),
  'IconForge': () => ( <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="12" y="32" width="40" height="24" rx="2"/><path d="M16 32 L32 10 L48 32" /><circle cx="32" cy="44" r="6" fill="#e63946" fillOpacity="0.4"/></svg> ),
  'IconAnvil': () => ( <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M10 40 L54 40 L48 56 L16 56 Z" fill="currentColor" fillOpacity="0.1"/><path d="M8 20 Q32 24 56 20 L54 40 H10 Z" /></svg> ),
  'IconGear': () => ( <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="32" cy="32" r="14" fill="currentColor" fillOpacity="0.1"/><circle cx="32" cy="32" r="4"/></svg> ),
  'IconBlueprint': () => ( <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="10" y="10" width="44" height="44"/><line x1="20" y1="22" x2="44" y2="22" strokeOpacity="0.3"/></svg> ),
  'IconSafety': () => ( <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M32 8 L54 20 V40 Q32 60 10 40 V20 Z" fill="currentColor" fillOpacity="0.1"/><path d="M22 34 L30 42 L42 22" stroke="#e63946" strokeWidth="3"/></svg> ),
};

const DynamicIcon = ({ name }) => {
  const Component = RWS_ICONS[name] || RWS_ICONS['IconFabrication'];
  return <div className="rws-svg-limiter"><Component /></div>;
};

function ThemedSelect({ options, selected, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  return (
    <div className="rws-select" ref={ref}>
      <div className={`rws-select-trigger ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <span>{selected.toUpperCase()}</span>
        <span className="arrow">{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className="rws-select-dropdown">
          {options.map(opt => (
            <div key={opt} className={`rws-opt ${selected === opt ? 'active' : ''}`} onClick={() => { onSelect(opt); setIsOpen(false); }}>
              {opt.toUpperCase()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('gallery');
  const [content, setContent] = useState({ services: [], gallery: [] });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [mediaType, setMediaType] = useState('image');
  const [loading, setLoading] = useState(false);
  const [editSvc, setEditSvc] = useState(null);
  const [svcTitle, setSvcTitle] = useState('');
  const [svcDesc, setSvcDesc] = useState('');
  const [svcIcon, setSvcIcon] = useState('IconRoboticArm');
  const [iconSearch, setIconSearch] = useState('');
  const [showIcons, setShowIcons] = useState(false);

  const fetchAll = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/all-content');
      const data = await res.json();
      setContent(data);
    } catch(err) { console.log(err); }
  };
  useEffect(() => { fetchAll(); }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleGalleryUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    selectedFiles.forEach(f => fd.append('files', f));
    fd.append('category', category);
    fd.append('mediaType', mediaType);
    await fetch('http://localhost:5000/api/admin/gallery', { method: 'POST', body: fd });
    setSelectedFiles([]); fetchAll(); setLoading(false);
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/admin/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editSvc?._id, title: svcTitle, desc: svcDesc, icon: svcIcon })
    });
    setEditSvc(null); setSvcTitle(''); setSvcDesc(''); setSvcIcon('IconRoboticArm'); fetchAll();
  };

  // This cleans up the temporary URLs when the component is unmounted to prevent memory leaks.
  useEffect(() => {
    return () => {
      selectedFiles.forEach(file => URL.revokeObjectURL(URL.createObjectURL(file)));
    }
  }, [selectedFiles]);

  return (
    <div className="rws-admin-screen">
      <header className="rws-header">
        <h2 className="rws-logo">RWS<span>PANEL</span></h2>
        <nav className="rws-tabs">
          <button className={activeTab === 'gallery' ? 'active' : ''} onClick={() => { setActiveTab('gallery'); setSelectedFiles([]); }}>Gallery</button>
          <button className={activeTab === 'services' ? 'active' : ''} onClick={() => setActiveTab('services')}>Services</button>
        </nav>
        <button className="rws-close" onClick={onLogout}>CLOSE PANEL ✕</button>
      </header>

      <main className="rws-body">
        {activeTab === 'gallery' ? (
          <div className="rws-view">
            <div className="rws-intro"><h1>Gallery Management</h1><p>Upload multi-media items to the website.</p></div>
            <form className="rws-bar" onSubmit={handleGalleryUpload}>
              <ThemedSelect options={CATEGORIES} selected={category} onSelect={setCategory} />
              <ThemedSelect options={MEDIA_TYPES} selected={mediaType} onSelect={setMediaType} />
              <div className="rws-custom-file-input">
                <input type="file" id="g-file" multiple onChange={handleFileChange} />
                <label htmlFor="g-file">+ ADD FILES</label>
              </div>
              <button type="submit" className="rws-submit" disabled={selectedFiles.length === 0 || loading}>UPLOAD ALL →</button>
            </form>

            {selectedFiles.length > 0 && (
              <div className="rws-queue-box">
                <div className="rws-queue-header">
                  <h4>New Selection Queue ({selectedFiles.length})</h4>
                  <button className="rws-clear-selection-btn" type="button" onClick={() => setSelectedFiles([])} disabled={selectedFiles.length <= 1}>CLEAR ALL SELECTION ✕</button>
                </div>
                <div className="rws-queue-row">
                  {selectedFiles.map((file, i) => (
                    <div key={`${file.name}-${file.lastModified}`} className="rws-p-item">
                      <button className="rws-p-remove" type="button" onClick={() => setSelectedFiles(selectedFiles.filter((_, idx) => idx !== i))}>✕</button>
                      <div className="rws-p-frame">
                        {file.type.startsWith('image') ? <img src={URL.createObjectURL(file)} alt={file.name} /> : <div className="rws-vid-m">VID</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rws-list">
              {content.gallery.map(item => (
                <div key={item._id} className="rws-item-row">
                  <div className="rws-list-frame"><img src={item.mediaUrl} alt="" /></div>
                  <span className="rws-badge">{item.category}</span>
                  <button className="rws-del-btn" onClick={() => fetch(`http://localhost:5000/api/admin/gallery/${item._id}`, {method:'DELETE'}).then(fetchAll)}>DELETE</button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rws-view">
            <div className="rws-intro"><h1>Services Management</h1><p>Edit or add core capabilities.</p></div>
            <form className="rws-svc-form" onSubmit={handleServiceSubmit}>
              <div className="rws-svc-row">
                <div className="rws-group flex-1">
                  <label>Service Title</label>
                  <input className="rws-input" value={svcTitle} onChange={e => setSvcTitle(e.target.value)} required placeholder="Service Name" />
                </div>
                <div className="rws-group">
                  <label>Icon</label>
                  <button type="button" className="rws-icon-sq" onClick={() => setShowIcons(true)}><DynamicIcon name={svcIcon} /></button>
                </div>
              </div>
              <div className="rws-group">
                <label>Description</label>
                <textarea className="rws-textarea" value={svcDesc} onChange={e => setSvcDesc(e.target.value)} required placeholder="Service Details..." />
              </div>
              <div className="rws-svc-actions">
                <button type="submit" className="rws-submit">{editSvc ? 'UPDATE SERVICE' : 'ADD SERVICE'} →</button>
                {editSvc && <button type="button" className="rws-cancel-btn" onClick={() => setEditSvc(null)}>CANCEL</button>}
              </div>
            </form>

            <div className="rws-list">
              {content.services.map(s => (
                <div key={s._id} className="rws-item-row">
                  <div className="rws-row-icon"><DynamicIcon name={s.icon} /></div>
                  <div className="rws-row-text"><strong>{s.title}</strong><p>{s.desc}</p></div>
                  <div className="rws-row-btns">
                    <button className="rws-edit-btn" onClick={() => { setEditSvc(s); setSvcTitle(s.title); setSvcDesc(s.desc); setSvcIcon(s.icon); window.scrollTo(0,0); }}>EDIT</button>
                    <button className="rws-del-btn" onClick={() => fetch(`http://localhost:5000/api/admin/services/${s._id}`, {method:'DELETE'}).then(fetchAll)}>DELETE</button>
                  </div>
                </div>
              ))}
            </div>

            {showIcons && (
              <div className="rws-modal">
                <div className="rws-modal-box">
                  <div className="rws-modal-head">
                    <input placeholder="Search library..." value={iconSearch} onChange={e => setIconSearch(e.target.value)} autoFocus />
                    <button className="rws-modal-x" type="button" onClick={() => setShowIcons(false)}>✕</button>
                  </div>
                  <div className="rws-modal-grid">
                    {Object.keys(RWS_ICONS).filter(n => n.toLowerCase().includes(iconSearch.toLowerCase())).map(name => (
                      <div key={name} className="rws-modal-item" onClick={() => { setSvcIcon(name); setShowIcons(false); }}>
                        <DynamicIcon name={name} />
                        <span>{name.replace('Icon','')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}