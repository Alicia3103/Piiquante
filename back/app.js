const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require('mongoose');
dotenv.config();
const user=process.env.DB_USER;
const password=process.env.DB_PASSWORD

const path = require('path');
app.use(express.json());




mongoose.connect(`mongodb+srv://${user}:${password}@piiquante.avnj6.mongodb.net/?retryWrites=true&w=majority`,
{ useNewUrlParser: true,
useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


module.exports = app;