require('dotenv').config(); //FOR ENVIRONMENT VARIABLES

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/UserModel');

const app = express();
const PORT = process.env.PORT || 3000;
mongoose.connect('mongodb://localhost:27017/mydb');

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
const logger = (req, res, next) => {
  console.log(new Date().toTimeString());
  next();
};
app.use(logger);

// Routes
app.get('/', async (req, res) => {
  try {
    const userData = await User.find();
    res.json(userData);
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});

app.post('/add', async (req, res) => {
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    res.json({ status: 'OK' });
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send(err.message);
});

app.listen(PORT, () => console.log('Server listening on PORT ' + PORT));
