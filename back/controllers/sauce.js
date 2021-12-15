//Importation des packages de node
const fs = require('fs'); //filesystem

//Importation du model sauce
const Sauce = require('../models/Sauce');

//Création du POST pour créer une sauce
exports.createSauce = (req, res, next) => {
  //Analyse et tranformation de la chaine de caractère
  const sauceObject = JSON.parse(req.body.sauce);
  //Création d'une nouvelle sauce
  const sauce = new Sauce({
    //Raccourci pour récupérer tous les champs de sauces
    ...sauceObject,
    //Récupération de l'url de l'image dynamiquement 
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  //Enregistrement de la nouvelle sauce
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce créée !' }))
    .catch(error => res.status(404).json({ error }));
};

//Création du GET pour afficher toutes les sauces
exports.getAllSauce = (req, res, next) => {
  //fonction find qui permet de trouver tous les sauces
  Sauce.find()
    //récupération du tableau de toutes les sauces retournées par la base
    .then((sauces) => { res.status(200).json(sauces); })
    .catch((error) => {
      res.status(407).json({ error: error });
    });
};

//Création du GET pour afficher une sauce
exports.getOneSauce = (req, res, next) => {
  //fonction findOne qui permet de trouver une sauce en particulier
  Sauce.findOne({ _id: req.params.id })
    //récupération de la sauce via le paramètre id
    .then((sauce) => { res.status(200).json(sauce) })
    .catch((error) => {
      res.status(404).json({ error: error });
    });
};

//Création du PUT pour modifier une sauce
exports.modifySauce = (req, res, next) => {
  //Savoir si il y a ou non une nouvelle image dans la modification
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  //fonction qui permet de mettre à jour une sauce
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    //modification de la sauce via le paramètre id 
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch(error => res.status(400).json({ error }));
};

//Création du DELETE pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  //Récupération du nom et l'url du fichier
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      //récupération du nom du fichier via un split de l'url
      const filename = sauce.imageUrl.split('/images/')[1];
      //suppression du fichier
      fs.unlink(`images/${filename}`, () => {
        //fonction qui permet de supprimer une sauce
        Sauce.deleteOne({ _id: req.params.id })
          //suppression de la sauce via le paramètre id
          .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//Création du POST pour aimer une sauce
exports.likeSauce = (req, res, next) => {
  const like = req.body.like;
  const userId = req.body.userId;
  // Récupération de la sauce sélectionnée
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      //Récupération des id utilisateurs si existant dans les tableaux like / dislikes
      let userLike = sauce.usersLiked.includes(userId);
      let userDislike = sauce.usersDisliked.includes(req.body.userId);
      switch (like) {
        //Si l'utilisateur aime la sauce
        case +1:
          //Si l'utilisateur n'a jamais aimé la sauce
          if (!userLike) {
            sauce.usersLiked.push(userId)
            sauce.likes++;
            sauce.save()
              .then(() => res.status(200).json({ message: "Sauce likée" }))
              .catch((error) => res.status(400).json({ error }));
          //Si l'utilisateur à déjà aimé la sauce
          } else {
            res.status(403).json({ message: "Vous ne pouvez pas liker la sauce deux fois" })
              .catch((error) => res.status(400).json({ error }));
          }
          break;
        //Si l'utilisateur n'a aucune avis sur la sauce
        case 0:
          //Si l'utilisateur a déjà aimé la sauce
          if (userLike) {
            sauce.usersLiked.pull(userId)
            sauce.likes--
            sauce.save()
              .then(() => res.status(201).json({ message: "Sauce unlikée" }))
              .catch((error) => res.status(400).json({ error }));
          //Si l'utilisateur a déjà détesté la sauce
          } else if (userDislike) {
            sauce.usersDisliked.pull(userId)
            sauce.dislikes--;
            sauce.save()
              .then(() => res.status(201).json({ message: "Sauce undislikée" }))
              .catch((error) => res.status(400).json({ error }));
          }
          break;
        //Si l'utilisateur n'aime pas la sauce
        case -1:
          //Si l'utilisateur n'a jamais destesté la sauce
          if (!userDislike) {
            sauce.usersDisliked.push(req.body.userId)
            sauce.dislikes++;
            sauce.save()
              .then(() => res.status(201).json({ message: "Sauce dislikée" }))
              .catch((error) => res.status(400).json({ error }));
          }
          //Si l'utilisateur a déjà detesté la sauce
          else {
            res.status(403).json({ message: "Vous ne pouvais pas disliker deux fois la sauce" })
              .catch((error) => res.status(400).json({ error }));
          }
          break;
      }
    })
    //.catch(error => res.status(500).json({ error: error.message }));
};