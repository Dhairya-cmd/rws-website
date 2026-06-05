require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Model
const contactSchema = new mongoose.Schema({
  name: String, email: String, company: String, service: String, message: String
}, { timestamps: true });
const Contact = mongoose.model('Contact', contactSchema);

// Contact Route
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, company, service, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: 'Name, email, and message are required.' });

    await Contact.create({ name, email, company, service, message });

    // Optional: send email notification
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: 'sales@robotweldingservices.com',
        subject: `New RWS Inquiry from ${name}`,
        html: `<h3>New Contact Form Submission</h3>
               <p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p>
               <p><b>Company:</b> ${company}</p><p><b>Service:</b> ${service}</p>
               <p><b>Message:</b> ${message}</p>`
      });
    }

    res.json({ success: true, message: 'Message received! We\'ll get back to you same-day.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rws')
  .then(() => app.listen(PORT, () => console.log(`RWS Server running on port ${PORT}`)))
  .catch(err => { console.error('DB connection failed:', err); process.exit(1); });
