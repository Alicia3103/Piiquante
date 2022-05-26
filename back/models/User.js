//import des modules necessaires
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//définition du schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true  },
  password: { type: String, required: true }
});

//utilisation du unique validator pour confirmer que l'email est unique
userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema)

module.exports = {User}