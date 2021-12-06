//Importation des package node
const mongoose = require('mongoose');

//Créatiion du schéma d'une sauce
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number },
    dislikes: { type: Number },
    userLiked: { type: ["String <userId>"] },
    userDisliked: { type: ["String <userId>"] },
});

//Exportation du schéma
module.exports = mongoose.model('Sauce', sauceSchema);