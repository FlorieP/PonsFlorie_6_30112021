//Importation des packages node
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Importation des routes
const userRoutes = require('./routes/user');

//Création de la constante application express
const app = express();

//Connexion à la base de donnée MongoDB
mongoose.connect('"mongodb+srv://Yunnie:OneW1514523@cluster0.m9uus.mongodb.net/Cluster0?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//Gestion des erreurs CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

//Création de la méthode d'utilisation de l'application
app.use((req, res) => {
    res.json({ message: 'Votre requête a bien été reçue !' });
});

//Création des méthodes d'utilisation des routes
app.use('/api/auth', userRoutes);

//Exportation de l'application
module.exports = app;