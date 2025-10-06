const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const Student = require('./models/student');

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// ROUTES

// Home - View all students
app.get('/', async (req, res) => {
  const students = await Student.find();
  res.render('index', { students });
});

// Show Add Student form
app.get('/add', (req, res) => {
  res.render('add');
});

// Add Student
app.post('/add', async (req, res) => {
  const { name, age, course, fees } = req.body;
  await Student.create({ name, age, course, fees });
  res.redirect('/');
});

// Show Edit form
app.get('/edit/:id', async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.render('edit', { student });
});

// Update Student
app.put('/edit/:id', async (req, res) => {
  const { name, age, course, fees } = req.body;
  await Student.findByIdAndUpdate(req.params.id, { name, age, course, fees });
  res.redirect('/');
});

// Delete Student
app.delete('/delete/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
