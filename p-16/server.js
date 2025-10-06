// server.js
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
  res.render('contact', { message: null, error: null });
});

app.post('/send', async (req, res) => {
  const { name, email, message } = req.body;

  // Validate fields
  if (!name || !email || !message) {
    return res.render('contact', { error: 'All fields are required.', message: null });
  }

  // Validate email format (basic)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.render('contact', { error: 'Please enter a valid email address.', message: null });
  }

  // Setup transporter
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email content
  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.TO_EMAIL,
    subject: `New message from ${name}`,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    res.render('contact', { message: '✅ Message sent successfully!', error: null });
  } catch (err) {
    console.error('Email send error:', err);
    res.render('contact', { error: '❌ Failed to send message. Please try again later.', message: null });
  }
});

// Start server
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
