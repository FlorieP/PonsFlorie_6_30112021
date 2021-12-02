//Importation des packages de node
const express = require('express');
//Création d'un routeur
const router = express.Router();

//Importation du controller pour associer les fonctions aux routes 
const userCtrl = require('../controllers/user');

//Création des routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

//Exportation du routeur de l'utilisateur
module.exports = router;