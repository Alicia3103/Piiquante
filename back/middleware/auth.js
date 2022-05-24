const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
      //Récupération du tokken contenu dans le header (split et récupération de la 2e valeur)
    const headerToken = req.headers.authorization.split(' ')[1];

    //Vérification du token
    const decodedToken = jwt.verify(headerToken, process.env.SECRET_TOKEN);
    const userId = decodedToken.userId;
    req.auth = { userId };  
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};