// src/components/GalleryManager.js

import React, { useState, useEffect } from 'react';
import './GalleryManager.css';

function GalleryManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'Robotic Welding',
    type: 'image',
    file: null,
  });

  const categories = [
    'Robotic Welding',
    'Manual Welding',
    'CNC Machining',
    'Metal Fabrication',
    'Fixture & Tooling',
    'Sub-Assembly',
  ];

  // Fetch gallery items
  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/gallery');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch gallery items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('type', formData.type);
    if (formData.file) {
      data.append('file', formData.file);
    }

    try {
      const url = editingItem
        ? `http://localhost:5000/api/gallery/${editingItem._id}`
        : 'http://localhost:5000/api/gallery';

      const res = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: data,
      });

      if (res.ok) {
        fetchGalleryItems();
        resetForm();
      }
    } catch (err) {
      console.error('Failed to save item:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;

    try {
      await fetch(`http://localhost:5000/api/gallery/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      fetchGalleryItems();
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      type: item.type,
      file: null,
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({ title: '', category: 'Robotic Welding', type: 'image', file: null });
    setEditingItem(null);
    setShowAddForm(false);
  };

  if (loading) {
    return <div className="admin-loading">Loading gallery...</div>;
  }

  return (
    <div className="gallery-manager">
      <div className="manager-header">
        <h2>Gallery Management</h2>
        <button
          className="btn btn--primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add New Item'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="manager-form-card">
          <h3>{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
          <form onSubmit={handleSubmit} className="manager-form">
            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Precision Weld"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Type</label>
                <select name="type" value={formData.type} onChange={handleInputChange}>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div className="form-group">
                <label>File</label>
                <input
                  type="file"
                  accept={formData.type === 'image' ? 'image/*' : 'video/*'}
                  onChange={handleFileChange}
                  required={!editingItem}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn--primary">
                {editingItem ? 'Update' : 'Add'} Item
              </button>
              <button type="button" className="btn btn--ghost" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="manager-grid">
        {items.map((item) => (
          <div key={item._id} className="manager-item-card">
            <div className="manager-item-preview">
              {item.type === 'image' ? (
                <img src={item.mediaUrl} alt={item.title} />
              ) : (
                <video src={item.mediaUrl} />
              )}
            </div>
            <div className="manager-item-info">
              <h4>{item.title}</h4>
              <span className="manager-item-category">{item.category}</span>
            </div>
            <div className="manager-item-actions">
              <button
                className="btn btn--small btn--ghost"
                onClick={() => handleEdit(item)}
              >
                Edit
              </button>
              <button
                className="btn btn--small btn--ghost"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GalleryManager;