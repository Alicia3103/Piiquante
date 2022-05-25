const passwordValidator= require("password-validator")

//schema de validation:
const passwordSchema= new passwordValidator()

passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(25)                                  // Maximum length 25
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(1)                                // Must have at least 1 digit
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

//test du password saisit par l'utilisateur

module.exports=(req,res,next)=>{
    if (passwordSchema.validate(req.body.password)){
        next()
    }else{
        return res.status(401).json({message:"le mot de passe n'est pas conforme, il doit contenir entre 8 et 25 caractères,au moins 1 chiffre et 1 majuscule"})
    }
}