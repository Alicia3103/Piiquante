//import module node
const fs = require('fs');

//import model de sauce
const Sauce=require("../models/Sauce")


// fonction affichage de toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(sauces=> res.status(200).json(sauces))
    .catch(error => res.status(404).json({error}))
  };

  //fonction création d'une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  sauceObject.imageUrl= req.protocol+"://"+req.headers.host +"/images/"+req.file.filename
    const sauce= new Sauce({
      ...sauceObject,
    })
    sauce.save()
    .then(() => res.status(201).json({message:"Sauce enregistrée"}))
    .catch(error => res.status(400).json({error}))
  };

  //fonction affichage d'une sauce
exports.getOneSauce= (req, res, next) =>{
    Sauce.findById( req.params.id )
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }))
  }

  //fonction de suppression de la sauce
exports.deleteSauce = (req, res, next) => {
    
  //récupération de la sauce
  Sauce.findById(req.params.id)
      .then(sauce => {

        if (!sauce) {
          res.status(404).json({message:"Aucune sauce trouvée"});
        }
        //on vérifie que l'userId de la sauce correspond à l'userId de la requete
        if (sauce.userId !== req.auth.userId) {
          res.status(403).json({message: "Utilisateur non autorisé"});
        }
        const filename = sauce.imageUrl.split('/images/')[1];
        //suppression de l'image associée
        fs.unlink(`images/${filename}`, () => {
          //supression de la sauce dans la base de donnée
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Objet supprimé !"}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

  //modification de la sauce
exports.modifySauce =(req, res, next) => {

  //identifier la sauce
    Sauce.findById(req.params.id)
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        
        const newBody=  updateBody(req)
        
        //Modification des infos de la sauce
        Sauce.findByIdAndUpdate( req.params.id, newBody )
          .then(res.status(201).json({ message : "Sauce modifiée"}))
          //suppression de l'ancienne image si elle a été modifiée
          .then(deleteOldImage(req,filename))
          .catch(error => res.status(400).json({ error })) 
      })
      .catch(error => res.status(404).json({ error }))
  }

  //décodage du body, s'il contient une image
function updateBody(req){
    if (req.file ==undefined) return req.body
    
    const modifyBody = JSON.parse(req.body.sauce)
    modifyBody.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  
    return modifyBody
  }

  //suppression de l'ancienne image si elle a été remplacée par une nouvelle
function deleteOldImage(req,filename){
    //si le corps de la requete ne contient pas d'image
    if (req.file ==undefined) return

    //si le corps de la requete contient une image, alors on efface l'ancienne
    fs.unlink(`images/${filename}`,(err => {
      if (err) console.log(err);
      else {
        console.log("image supprimée")
      }
    }))
  }


//systeme de like et dislike d'une sauce
exports.likeSauce =(req, res, next) => {
  //récupération de la sauce
  Sauce.findById(req.params.id)
  .then((sauce)=>{
    let like = req.body.like
    let userId = req.body.userId

    //cas de like, dislike et annulation like/dislike
    switch (like){
      case 1:
      //ajout de l'userId dans le tableau
        sauce.usersLiked.push(userId)
      //incrémentation du nombre de like de la sauce
        sauce.likes++

        sauce.save()
        .then(res.status(201).json({ message : "vous avez liké cette sauce"}))
        .catch(error => res.status(400).json({ error }))
        break

      case -1:
        //ajout de l'userId dans le tableau
        sauce.usersDisliked.push(userId)
        //incrémentation du nombre de dislike de la sauce
        sauce.dislikes++
        sauce.save()
        .then(res.status(201).json({ message : "vous avez disliké cette sauce"}))
        .catch(error => res.status(400).json({ error }))
        break

      case 0:
        //si l'utilisateur est dans le tableau des like(il annule un like)
        if(sauce.usersLiked.includes(userId)){
          //on enleve son nom du tableau
        sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId), 1)
          //on baisse le nombre de like de 1
        sauce.likes--
        sauce.save()
        .then(res.status(201).json({ message : "votre like a été enlevé"}))
        .catch(error => res.status(400).json({ error }))
        }
        //si l'utilisateur est dans le tableau des dislike(il annule un dislike)
        else if(sauce.usersDisliked.includes(userId)){
          //on enleve son nom du tableau
          sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.body.userId), 1)
          //on baisse le nombre de dislike de 1
          sauce.dislikes--
          sauce.save()
          .then(res.status(201).json({ message : "votre dislike a été enlevé"}))
          .catch(error => res.status(400).json({ error }))
          }
        break
    }
  })
  .catch(error => res.status(404).json({error}))
}
  