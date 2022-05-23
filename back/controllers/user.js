

const {User}=require("../models/User")
const bcrypt= require("bcrypt")
const dotenv = require("dotenv");
dotenv.config();
const secretToken = process.env.SECRET_TOKEN

const jwt = require('jsonwebtoken')
exports.signup = (req, res, next) =>  {
const email= req.body.email

bcrypt.hash(req.body.password, 10)
    .then(hash => {
    const user =new User({email, password:hash})
    user
        .save()
        .then(() => res.status(201).send({ message: "Utilisateur enregistré !" }))
        .catch(error => res.status(409).send({ message: "Utilisateur pas enregistré :" + error }))
    })

}
exports.login = (req, res, next) => {
    //méthode 'findOne' pour trouver 1 seul utilisateur
    User.findOne({
      //récupération de l'adresse email
        email: req.body.email
      })
      // fonction asyncrone donc Promise
      .then(user => {
        if (!user) {
          return res.status(401).json({
            error: 'Utilisateur non trouvé !'
            //réponse d'erreur avec code 401
          });
        }
        //comparaison entre le mdp tapé et celui de la base de donnée
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            //verification si le mdp est valable ou pas
            if (!valid) {
              return res.status(401).json({
                error: 'Mot de passe incorrect !'
                //réponse d'erreur avec code 401
              });
            }
            
            res.status(200).json({
              userId: user._id,
              //encodage avec la fonction 'sign'
              token: jwt.sign({userId: user._id}, secretToken,{expiresIn: '24h'})
            });
          })
          .catch(error => res.status(500).json({
            error
            //réponse d'erreur avec code 500
          }));
      })
      .catch(error => res.status(500).json({
        error
        //réponse d'erreur avec code 500
      }));
  };
