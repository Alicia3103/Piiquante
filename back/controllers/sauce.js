const Sauce=require("../models/Sauce")
const fs = require('fs');


exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(sauces=> res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}))
  };

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
    console.log(sauceObject)
    console.log(req.file)
    const sauce= new Sauce({
      userId: sauceObject.userId,
      name:sauceObject.name,
      manufacturer:sauceObject.manufacturer,
      description: sauceObject.description,
      mainPepper: sauceObject.mainPepper,
      imageUrl: req.protocol+"://"+req.headers.host +"/images/"+req.file.filename,
      heat: sauceObject.heat,
      likes: 2,
      dislikes: 2,
      usersLiked: ["pouet"] ,
      usersDisliked: ["pouet"] ,
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
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
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
        .then(fs.unlink(`images/${filename}`,(err => {
          if (err) console.log(err);
          else {
            console.log("image supprimée")
          }
          })))
        .catch(error => res.status(400).json({ error }))
        
        
      })
      .catch(error => res.status(404).json({ error }))
  }

  function updateBody(req){
    if (req.file ==undefined) return req.body
    
    const modifyBody = JSON.parse(req.body.sauce)
    modifyBody.imageUrl = req.protocol+"://"+req.headers.host +"/images/"+req.file.filename
  
    return modifyBody
  }
  