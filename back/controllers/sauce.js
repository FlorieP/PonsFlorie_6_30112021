//Importation des packages de node
const fs = require('fs'); //filesystem

//Importation du model sauce
const sauce = require('../models/Sauce');

//Création du POST pour créer une sauce
exports.createSauce = (req, res, next) => {
    //Analyse et tranformation de la chaine de caractère
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        //Raccourci pour récupérer tous les champs de sauces
        ...sauceObject,
        //Récupération de l'url de l'image dynamiquement 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

//Création du GET pour afficher toutes les sauces
exports.getAllSauce = (req, res, next) => {
    //fonction find qui permet de trouver tous les sauces
    sauce.find()
        //récupération du tableau de toutes les sauces retournées par la base
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

//Création du GET pour afficher une sauce
exports.getOneSauce = (req, res, next) => {
    //fonction findOne qui permet de trouver une sauce en particulier
    sauce.findOne({ _id: req.params.id })
        //récupération de la sauce via le paramètre id
        .then(sauce => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));

};

//Création du PUT pour modifier une sauce
exports.modifySauce = (req, res, next) => {
    //Savoir si il y a ou non une nouvelle image dans la modification
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body }
    //fonction qui permet de mettre à jour une sauce
    sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        //modification de la sauce via le paramètre id 
        .then(() => res.status(201).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

//Création du DELETE pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    //Récupération du nom et l'url du fichier
    sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            //récupération du nom du fichier via un split de l'url
            const filename = sauce.imageUrl.split('/images/')[1];
            //suppression du fichier
            fs.unlink(`images/${filename}`, () => {
                //fonction qui permet de supprimer une sauce
                sauce.deleteOne({ _id: req.params.id })
                    //suppression de la sauce via le paramètre id
                    .then(() => res.status(201).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
};

//Création du POST pour aimer une sauce
exports.likeSauce = (req, res, next) => {


};