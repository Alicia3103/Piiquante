const validator = require('validator');

//validation de l'email (format)
module.exports=(req,res,next)=>{
    const email= req.body.email
    if(validator.isEmail(email)===true){
    next()
    }else {
    throw 'Invalid email'}
}