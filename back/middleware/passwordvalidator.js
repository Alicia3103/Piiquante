// import du password-validator
const passwordValidator= require("password-validator")

//schema de validation:
const passwordSchema= new passwordValidator()

passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(30)                                  // Maximum length 30
.has().uppercase()                              // Doit contenir des majuscules
.has().lowercase()                              // Doit contenir des minuscules
.has().digits(1)                                // Doit contenir 1 chiffre
.has().not().spaces()                           // Ne doit pas contenir d'espace
.is().not().oneOf(['1=1','OR a=a','=','OR 1=1', 'Password123','Azerty123']);     // Ne doit pas être une de ces valeurs

//test du password saisit par l'utilisateur

module.exports=(req,res,next)=>{
    if (passwordSchema.validate(req.body.password)){
        next()
    }else{
        return res.status(401).json({message:"le mot de passe n'est pas conforme, il doit contenir entre 8 et 30 caractères,au moins 1 chiffre et 1 majuscule"})
    }
}