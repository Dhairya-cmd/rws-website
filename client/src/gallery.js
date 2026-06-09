// src/GalleryPage.js

import React, { useState, useEffect } from 'react';

// You can get these from a shared file or define them here
const SERVICES = [
  { title: 'Robotic MIG Welding' },
  { title: 'Manual TIG/MIG Welding' },
  { title: 'CNC Machining' },
  { title: 'Custom Fabrication' },
  { title: 'Fixture & Tooling Design' },
  { title: 'Sub-Assemblies' },
];
const GALLERY_CATEGORIES = SERVICES.map(s => s.title);
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// --- DUMMY DATA FOR DEMONSTRATION ---
// Replace this with a real API call later
const dummyItems = [
  { _id: '1', category: 'Robotic MIG Welding', type: 'image', url: 'https://placehold.co/800x600/E63946/white?text=Robotic+Weld+1', title: 'High-Volume Frame Assembly' },
  { _id: '2', category: 'Manual TIG/MIG Welding', type: 'image', url: 'https://placehold.co/800x600/2A2A28/white?text=Manual+Weld', title: 'Precision TIG on Stainless' },
  { _id: '3', category: 'CNC Machining', type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', title: 'CNC Milling Process' },
  { _id: '4', category: 'Robotic MIG Welding', type: 'image', url: 'https://placehold.co/800x600/E63946/white?text=Robotic+Weld+2', title: 'Automated Component Welding' },
  { _id: '5', category: 'Custom Fabrication', type: 'image', url: 'https://placehold.co/800x600/4A4A47/white?text=Fabrication', title: 'Custom Steel Guarding' },
  { _id: '6', category: 'Robotic MIG Welding', type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', title: 'Robotic Arm in Action' },
];
// --- END OF DUMMY DATA ---

export default function GalleryPage({ navigateTo }) {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxItem, setLightboxItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // This function will fetch data from your backend
  const fetchGallery = async () => {
    setLoading(true);
    try {
      // UNCOMMENT THIS BLOCK TO USE YOUR REAL BACKEND
      /*
      const res = await fetch(`${API_URL}/api/gallery`);
      const data = await res.json();
      if (data.success) {
        setItems(data.items);
      }
      */

      // --- This part uses dummy data for now. REMOVE when using backend. ---
      setTimeout(() => {
        setItems(dummyItems);
        setLoading(false);
      }, 800); // Simulate network delay
      // --- End of dummy data part ---

    } catch (err) {
      console.error('Failed to fetch gallery:', err);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchGallery();
  }, []);

  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  // Add ESC key support to close lightbox
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setLightboxItem(null);
    };
    if (lightboxItem) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [lightboxItem]);

  return (
    <div className="page gallery-page">
      <div className="page__inner">
        <div className="section__head">
          <span className="tag">Our Work</span>
          <h2>Gallery</h2>
          <p>Explore our portfolio of precision fabrication and welding projects.</p>
        </div>

        {/* Category Filter Tabs */}
        <div className="gallery__tabs">
          <button 
            className={`gallery__tab ${activeCategory === 'All' ? 'gallery__tab--active' : ''}`}
            onClick={() => setActiveCategory('All')}
          >
            All
          </button>
          {GALLERY_CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`gallery__tab ${activeCategory === cat ? 'gallery__tab--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <p className="gallery__loading">Loading gallery...</p>
        ) : filteredItems.length === 0 ? (
          <div className="gallery__empty">
            <p>No items in this category yet.</p>
            <button className="btn btn--ghost" onClick={() => navigateTo('Contact')}>
              Request a Quote
            </button>
          </div>
        ) : (
          <div className="gallery__grid">
            {filteredItems.map(item => (
              <div 
                key={item._id} 
                className="gallery__item"
                onClick={() => setLightboxItem(item)}
              >
                {item.type === 'image' ? (
                  <img src={item.url} alt={item.title || item.category} loading="lazy" />
                ) : (
                  <>
                    <video src={item.url} muted playsInline />
                    <span className="gallery__play-icon">▶</span>
                  </>
                )}
                <div className="gallery__item-overlay">
                  <span className="gallery__item-category">{item.category}</span>
                  {item.title && <span className="gallery__item-title">{item.title}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox for Preview */}
      {lightboxItem && (
        <div className="lightbox" onClick={() => setLightboxItem(null)}>
          <button className="lightbox__close" aria-label="Close preview">✕</button>
          <div className="lightbox__content" onClick={e => e.stopPropagation()}>
            {lightboxItem.type === 'image' ? (
              <img src={lightboxItem.url} alt={lightboxItem.title || lightboxItem.category} />
            ) : (
              <video src={lightboxItem.url} controls autoPlay playsInline />
            )}
            <div className="lightbox__info">
              <h3>{lightboxItem.category}</h3>
              {lightboxItem.title && <p>{lightboxItem.title}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}