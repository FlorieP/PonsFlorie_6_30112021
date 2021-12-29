//Importation des packages de node
const fs = require('fs'); //filesystem
const jwt = require('jsonwebtoken');

//Importation du model sauce
const Sauce = require('../models/Sauce');

//Création du POST pour créer une sauce
exports.createSauce = (req, res, next) => {
  //Analyse et tranformation de la chaine de caractère JSON en valeur JS
  const sauceObject = JSON.parse(req.body.sauce);
  //Création d'une nouvelle sauce
  const sauce = new Sauce({
    //Raccourci pour récupérer tous les champs de sauces
    ...sauceObject,
    //Récupération de l'url de l'image dynamiquement 
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    userLiked: [],
    userDisliked: [],
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
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      //Vérification de l'userId en comparaison avec celui de la sauce
      if (req.body.userId != sauce.userId) {
        res.status(403).json({ message: "Seul l'utilisateur qui a créé la sauce peut la modifier" })
          .catch((error) => res.status(400).json({ error }));
      } else {
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
      }
    })
    .catch(error => res.status(500).json({ error }));
};

//Création du DELETE pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  //Récupération du nom et l'url du fichier
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      //Récupération du token 
      const token = req.headers.authorization.split(' ')[1];
      //Décodage du token 
      const decodedToken = jwt.verify(token, process.env.JWT_KEY_TOKEN);
      // Récupération de l'userId inclus dans le token
      const userId = decodedToken.userId;
      //Vérification de l'userId en comlparaison à l'userId de la Sauce
      if (userId != sauce.userId) {
        res.status(403).json({ message: "Seul l'utilisateur qui a créé la sauce peut la modifier" })
          .catch((error) => res.status(400).json({ error }));
      } else {
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
      }
    })
    .catch(error => res.status(500).json({ error }));
};

//Création du POST pour aimer une sauce
exports.likeSauce = (req, res, next) => {
  //Récupération des données
  const like = req.body.like;
  const userId = req.body.userId;
  const sauceId = req.params.id;
  // Récupération de la sauce sélectionnée
  Sauce.findOne({ _id: sauceId })
    .then(sauce => {
      //Récupération des id utilisateurs si existant dans les tableaux like / dislikes
      let userLike = sauce.usersLiked.includes(userId);
      let userDislike = sauce.usersDisliked.includes(userId);
      //Gestion de chaque cas de like / dislike / unlike / undislike
      switch (like) {
        //Si l'utilisateur aime la sauce
        case +1:
          //Si l'utilisateur n'a pas encore like la sauce
          if (!userLike) {
            //Pour la sauce sélectionnée incrémenté le like et envoyer l'id utilisateur dans le tableau correspondant
            Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 } })
              .then(() => res.status(201).json({ message: "Sauce likée" }))
              .catch((error) => { console.log(error); res.status(400).json({ error }) });
            //Si l'utilisateur a déjà like la sauce
          } else {
            res.status(403).json({ message: "Vous ne pouvez pas liker la sauce deux fois" })
              .catch((error) => res.status(400).json({ error }));
          }
          break;
        //Si l'utilisateur n'a aucune avis sur la sauce
        case 0:
          //Si l'utilisateur a déjà like la sauce
          if (userLike) {
            ///Pour la sauce sélectionnée décrémenté le like et retirer l'id utilisateur dans le tableau correspondant
            Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
              .then(() => res.status(201).json({ message: "Sauce unlikée" }))
              .catch((error) => res.status(400).json({ error }));
          }
          //Si l'utilisateur a déjà dislike la sauce
          if (userDislike) {
            //Pour la sauce sélectionnée décrémenté le dislike et retirer l'id utilisateur dans le tableau correspondant
            Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
              .then(() => res.status(201).json({ message: "Sauce undislikée" }))
              .catch((error) => res.status(400).json({ error }));
          }
          break;
        //Si l'utilisateur n'aime pas la sauce
        case -1:
          //Si l'utilisateur n'a jamais dislike la sauce
          if (!userDislike) {
            //Pour la sauce sélectionnée incrémenté le dislike et envoyer l'id utilisateur dans le tableau correspondant
            Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } })
              .then(() => res.status(201).json({ message: "Sauce dislikée" }))
              .catch((error) => { console.log("test3"); console.log(error); res.status(400).json({ error }) });
            //Si l'utilisateur a déjà dislike la sauce
          } else {
            res.status(403).json({ message: "Vous ne pouvais pas disliker deux fois la sauce" })
              .catch((error) => res.status(400).json({ error }));
          }
          break;
      }
    })
    .catch(error => {
      res.status(500).json({ error: error.message })
    });
};