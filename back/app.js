//Importation des packages node
const express = require('express');
const mongoose = require('mongoose');

//Création de la constante application express
const app = express();

//Connexion à la base de donnée MongoDB
mongoose.connect('"mongodb+srv://Yunnie:OneW1514523@cluster0.m9uus.mongodb.net/Cluster0?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Création de la méthode d'utilisation de l'application
app.use((req, res) => {
    res.json({ message: 'Votre requête a bien été reçue !' }); 
 });

//Exportation de l'application
module.exports = app;