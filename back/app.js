const express = require("express");
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();
const user=process.env.DB_USER;
const password=process.env.DB_PASSWORD

const path = require('path');
const userRoutes = require('./routes/user');

//middleware
app.use(express.json());


//connexion mongoose

mongoose.connect(`mongodb+srv://${user}:${password}@piiquante.avnj6.mongodb.net/?retryWrites=true&w=majority`,
{ useNewUrlParser: true,
useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

//controllers


//cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
//routes
app.use('/api/auth', userRoutes);

module.exports = app;