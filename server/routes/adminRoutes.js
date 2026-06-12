const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Service = require('../models/services');
const Gallery = require('../models/gallery');
const Admin = require('../models/Admin');
const SiteStatus = require('../models/SiteStatus');

const JWT_SECRET = process.env.JWT_SECRET || 'rws_dev_secret_key';

// ── Multer ────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_')),
});
const upload = multer({ storage });

// ── Auth middleware ───────────────────────────────────────
const requireAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const requireDev = (req, res, next) => {
  if (req.admin?.role !== 'developer') return res.status(403).json({ error: 'Developer access required' });
  next();
};

// ── LOGIN ─────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: '12h' }
    );
    res.json({ success: true, token, role: admin.role });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── SITE STATUS (public) ──────────────────────────────────
router.get('/site-status', async (req, res) => {
  try {
    const status = await SiteStatus.findOne({ key: 'status' });
    res.json({ isShutdown: status?.isShutdown || false, message: status?.shutdownMessage || '' });
  } catch {
    res.json({ isShutdown: false, message: '' });
  }
});

// ── SHUTDOWN / RESTORE (developer only) ──────────────────
router.post('/shutdown', requireAuth, requireDev, async (req, res) => {
  const { message } = req.body;
  await SiteStatus.findOneAndUpdate(
    { key: 'status' },
    { isShutdown: true, shutdownMessage: message || 'This website is temporarily unavailable.', shutdownBy: req.admin.username, shutdownAt: new Date() },
    { upsert: true }
  );
  res.json({ success: true });
});

router.post('/restore', requireAuth, requireDev, async (req, res) => {
  await SiteStatus.findOneAndUpdate({ key: 'status' }, { isShutdown: false }, { upsert: true });
  res.json({ success: true });
});

// ── ALL CONTENT ───────────────────────────────────────────
router.get('/all-content', async (req, res) => {
  try {
    const services = await Service.find().sort('order');
    const gallery = await Gallery.find().sort('-createdAt');
    res.json({ services, gallery });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── SERVICES ──────────────────────────────────────────────
router.post('/services', async (req, res) => {
  const { id, title, desc, detail } = req.body;
  if (id) await Service.findByIdAndUpdate(id, { title, desc, detail });
  else await new Service({ title, desc, detail: detail || '', order: 0 }).save();
  res.json({ success: true });
});
router.delete('/services/:id', async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ── GALLERY ───────────────────────────────────────────────
router.post('/gallery', upload.array('files', 15), async (req, res) => {
  const { category, mediaType } = req.body;
  const BASE = process.env.BASE_URL || 'http://localhost:5000';
  const promises = req.files.map(f =>
    new Gallery({ category, type: mediaType, mediaUrl: `${BASE}/uploads/${f.filename}`, title: '' }).save()
  );
  await Promise.all(promises);
  res.json({ success: true });
});
router.delete('/gallery/:id', async (req, res) => {
  const item = await Gallery.findByIdAndDelete(req.params.id);
  if (item?.mediaUrl) {
    const filename = item.mediaUrl.split('/uploads/')[1];
    if (filename) {
      const filepath = path.join(__dirname, '../uploads', filename);
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    }
  }
  res.json({ success: true });
});

module.exports = router;
