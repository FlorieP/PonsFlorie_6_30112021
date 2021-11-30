//Importation des package node
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Créatiion du schéma de l'utilisateur
const userSchema = mongoose.Schema({
    //Ajout de l'attribut "unique" afin qu'un email ne puisse être utiliser qu'une seule fois
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

//Application du validateur unique au schéma 
userSchema.plugin(uniqueValidator);

//Exportation du schéma
module.exports = mongoose.model('User', userSchema);