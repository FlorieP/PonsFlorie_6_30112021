//Importation des packages de node
const jwt = require('jsonwebtoken');

//Exportation d'un middleware
module.exports = (req, res, next) => {
    try {
        //Récupération du token dans le header authorization
        const token = req.headers.authorization.split(' ')[1];
        //Décodage du token 
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // Récupération de l'userId inclus dans le token
        const userId = decodedToken.userId;
        //Comparaison l'ID user du token avec le champs UderiD de la sauce 
        //req.auth = {userId};
        //Vérfication de compatibilité des userId
        if (req.body.userId && req.body.userId !== userId) {
            //si c'est pas bon renvoie d'une erreur
            throw 'Invalid user ID';
        } else {
            //si c'est bon passer la requête au prochain middleware
            next();
        }
    } catch {
        //Renvoie erreur d'authentification
        res.status(401).json({
            error: new Error('Requête non authentifiée !')
        });
    }
};