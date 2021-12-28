//Importation des packages node
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

//Importation des routes
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

//Création de la constante application express
const app = express();

//Connexion à la base de donnée MongoDB
mongoose.connect('mongodb+srv://Yunnie:OneW1514523@p6database.m9uus.mongodb.net/P6DataBase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Gestion des erreurs CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Indiquer à l'application qu'elle doit utiliser JSON
app.use(bodyParser.json());

//Création du gestionnaire de la ressource images de manière statique
app.use('/images', express.static(path.join(__dirname, 'images')));

//Création des méthodes d'utilisation des routes
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

//Exportation de l'application
module.exports = app;