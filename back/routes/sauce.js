//Importation des packages de node
const express = require('express');
const router = express.Router();

//Importation des middleware
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//Importation du controller de sauce
const stuffCtrl = require('../controllers/sauce');

//Création des routes
router.get('/', auth, stuffCtrl.getAllSauce);
router.post('/', auth, multer, stuffCtrl.createSauce);
router.get('/:id', auth, stuffCtrl.getOneSauce);
router.put('/:id', auth, multer, stuffCtrl.modifySauce);
router.delete('/:id', auth, stuffCtrl.deleteSauce);
//router.post('/:id/like', auth, stuffCtrl.likeSauce);

//Exportation de la route Sauce
module.exports = router;