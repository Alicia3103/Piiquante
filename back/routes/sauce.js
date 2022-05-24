const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const sauceCtrl = require('../controllers/sauce');

router.get('/',auth, sauceCtrl.getAllSauce);
router.post('/', auth,  sauceCtrl.createSauce);
module.exports = router;