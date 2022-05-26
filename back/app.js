
//appels des différents packages node 
const express = require("express");
const rateLimit = require('express-rate-limit')
const helmet = require("helmet");
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();

//appel des variables d'environnement
const user=process.env.DB_USER;
const password=process.env.DB_PASSWORD


//définition des routes
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');




//connexion mongoose

mongoose.connect(`mongodb+srv://${user}:${password}@piiquante.avnj6.mongodb.net/?retryWrites=true&w=majority`,
{ useNewUrlParser: true,
useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


//cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// rate limiter
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 70, // Limite a 70 requet sur 15min
	standardHeaders: true, // Retourne le rate limit dans le header `RateLimit-*` headers
	legacyHeaders: false, // désactive le `X-RateLimit-*` des headers
})

//middleware
app.use(limiter)

// utilisationde helmet et desactivation des option cross origin pour permettre l'appel des images 
app.use(
  helmet({
    crossOriginResourcePolicy:false,
    crossOriginOpenerPolicy:false,
  })
)

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')))

//utilisation des routes
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);



module.exports = app;