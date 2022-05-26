const passwordValidator= require("password-validator")

//schema de validation:
const passwordSchema= new passwordValidator()

passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(30)                                  // Maximum length 30
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(1)                                // Must have at least 1 digit
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['1=1','OR a=a','=','OR 1=1', 'Password123','Azerty123']);     // Blacklist these values

//test du password saisit par l'utilisateur

module.exports=(req,res,next)=>{
    if (passwordSchema.validate(req.body.password)){
        next()
    }else{
        return res.status(401).json({message:"le mot de passe n'est pas conforme, il doit contenir entre 8 et 30 caractères,au moins 1 chiffre et 1 majuscule"})
    }
}