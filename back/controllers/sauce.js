const Sauce=require("../models/Sauce")
const fs = require('fs');


exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(sauces=> res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}))
  };

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
    const sauce= new Sauce({
      userId: sauceObject.userId,
      name:sauceObject.name,
      manufacturer:sauceObject.manufacturer,
      description: sauceObject.description,
      mainPepper: sauceObject.mainPepper,
      imageUrl: req.protocol+"://"+req.headers.host +"/images/"+req.file.filename,
      heat: sauceObject.heat,
      likes: 0,
      dislikes: 0,
      usersLiked: [] ,
      usersDisliked: [] ,
    })
    sauce.save()
    .then(() => res.status(201).json({message:"Sauce enregistrée"}))
    .catch(error => res.status(400).json({error}))
  };
exports.getOneSauce= (req, res, next) =>{
    Sauce.findById( req.params.id )
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }))
  }

exports.deleteSauce = (req, res, next) => {
    Sauce.findById(req.params.id)
      .then(sauce => {

        if (!sauce) {
          res.status(404).json({message:"Aucune sauce trouvée"});
        }
        if (sauce.userId !== req.auth.userId) {
          res.status(403).json({message: "Utilisateur non autorisé"});
        }
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Objet supprimé !"}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };
exports.modifySauce =(req, res, next) => {
    Sauce.findById(req.params.id)
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        
        const newBody=  updateBody(req)
        

        Sauce.findByIdAndUpdate( req.params.id, newBody )
          .then(res.status(201).json({ message : "Sauce modifiée"}))
          .then(deleteOldImage(req,filename))
          .catch(error => res.status(400).json({ error })) 
      })
      .catch(error => res.status(404).json({ error }))
  }

function updateBody(req){
    if (req.file ==undefined) return req.body
    
    const modifyBody = JSON.parse(req.body.sauce)
    modifyBody.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  
    return modifyBody
  }
function deleteOldImage(req,filename){
    if (req.file ==undefined) return
    fs.unlink(`images/${filename}`,(err => {
      if (err) console.log(err);
      else {
        console.log("image supprimée")
      }
    }))
  }

exports.likeSauce =(req, res, next) => {
  Sauce.findById(req.params.id)
  .then((sauce)=>{
    let like = req.body.like
    let userId = req.body.userId
    switch (like){
      case 1:
        sauce.usersLiked.push(userId)
        sauce.likes++
        sauce.save()
        .then(res.status(201).json({ message : "vous avez liké cette sauce"}))
        .catch(error => res.status(400).json({ error }))
        break
      case -1:
        sauce.usersDisliked.push(userId)
        sauce.dislikes++
        sauce.save()
        .then(res.status(201).json({ message : "vous avez disliké cette sauce"}))
        .catch(error => res.status(400).json({ error }))
        break
      case 0:
        if(sauce.usersLiked.includes(userId)){
          sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId), 1)
        sauce.likes--
        sauce.save()
        .then(res.status(201).json({ message : "votre like a été enlevé"}))
        .catch(error => res.status(400).json({ error }))
        }
        else if(sauce.usersDisliked.includes(userId)){
          sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.body.userId), 1)
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
  