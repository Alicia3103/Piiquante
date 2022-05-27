
//import du Model
const {User}=require("../models/User")

//import des modules de node
const bcrypt= require("bcrypt")
const dotenv = require("dotenv");
dotenv.config();
const jwt = require('jsonwebtoken')

//variable d'environnement
const secretToken = process.env.SECRET_TOKEN

//fonction sign Up

exports.signup = (req, res, next) =>  {
const email= req.body.email
//hash et sallage du MDP grace a Bcrypt
bcrypt.genSalt(parseInt(process.env.SALT))
.then(salt=>{
  bcrypt.hash(req.body.password,salt)

    .then(hash => {
      
    const user =new User({email, password:hash})
    user
        .save()
        .then(() => res.status(201).send({ message: "Utilisateur enregistré !" }))
        .catch(error => res.status(409).send({ message: "Utilisateur pas enregistré :" + error }))
    })
  })

}

//fonction login
exports.login = (req, res, next) => {
    //méthode 'findOne' pour trouver 1 seul utilisateur
    User.findOne({
      //récupération de l'adresse email
        email: req.body.email
      })
      // fonction asyncrone donc Promise
      .then(user => {
        if (!user) {
          return res.status(401).json({message: 'Utilisateur non trouvé !'});
        }
        //comparaison entre le mdp tapé et celui de la base de donnée
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            //verification si le mdp est valable ou pas
            if (!valid) {
              return res.status(401).json({message: 'Mot de passe incorrect !'});
            }
            
            res.status(200).json({
              userId: user._id,
              //encodage avec la fonction 'sign'
              token: jwt.sign({userId: user._id}, secretToken,{expiresIn: '24h'})
            });
          })
          .catch(error => res.status(500).json({error}));
      })
      .catch(error => res.status(500).json({error}));
  };
