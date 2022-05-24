const Sauce=require("../models/Sauce")

exports.getAllSauce = (req, res, next) => {
    console.log("les sauces seront bientôt là!")
    Sauce.find({}).then(sauces=> res.send(sauces))
  };

exports.createSauce = (req, res, next) => {
    console.log("les sauces seront bientôt là!")
    const sauce= new Sauce({
      userId: "pouet",
      name:"pouet",
      manufacturer:"pouet",
      description: "pouet",
      mainPepper: "pouet",
      imageUrl: "pouet",
      heat: 2,
      likes: 2,
      dislikes: 2,
      usersLiked: ["pouet"] ,
      usersDisliked: ["pouet"] ,
    })
    sauce.save()
    .then((res)=>console.log("sauce enregistrée"+res))
    .catch((error)=>console.log(error))
  };