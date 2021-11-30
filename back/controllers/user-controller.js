//Importation des packages de node
const bcrypt = require('bcrypt');

// Importation du model de l'utilisateur
const User = require('../models/user');

//Création méthode d'inscription d'un utilisateur
exports.signup = (req, res, next) => {
    //Hashage du mot de passe
    bcrypt.hash(req.body.password, 10)
        //Récupération du hash de mdp 
        .then(hash => {
            //Création du nouvel utlisateur
            const user = new User({
                email: req.body.email,
                passeword: hash
            });
            //Enregistrement du nouvel utilisateur
            user.save()
                //Connexion serveur réussi
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                //Gestion erreur serveur
                .catch(error => res.status(400).json({ error }));
        })
        //Festion erreur serveur
        .catch(error => res.status(500).json({ error }));
};

//Création méthode de connexion d'un utilisateur
exports.login = (req, res, next) => {
    //Utilisation de la méthode findOne pour trouver l'utilisateur qui correspond à l'adresse mail utilisé
    User.findOne({ email: req.body.email })
        //Vérification de récupération d'un utilisateur
        .then(user => {
            //Si on a pas trouvé d'utilisateur renvoyer une erreur
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            //Si trouvé, comparaison des mdp avec bcrypt
            bcrypt.compare(req.body.password, user.password)
                //Boolean pour savoir si la comparaison est bonne
                .then(valid => {
                    if (!valid) {
                        //Mauvais mdp retourne une erreur 
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    //Bon mdp, renvoi d'un json avec un id et un token 
                    res.status(200).json({
                        userId: user._id,
                        token: 'TOKEN'
                    });
                })
                //Gestion erreur serveur
                .catch(error => res.status(500).json({ error }));
        })
        //Gestion erreur serveur
        .catch(error => res.status(500).json({ error }));
};