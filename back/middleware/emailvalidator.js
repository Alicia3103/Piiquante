const validator = require('validator');


module.exports=(req,res,next)=>{
    const email= req.body.email
    if(validator.isEmail(email)===true){
    next()
    }else {
    throw 'Invalid email'}
}