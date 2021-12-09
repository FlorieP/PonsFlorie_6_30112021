//Importation des packages de node
const multer = require('multer');

//Dictionnaire objet qui permet de connaître les différentes extension possible d'un fichier
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//Création d'objet de configuration pour multer 
const storage = multer.diskStorage({
  //1er argument fonction qui explique à multer dans quel dossier enregistrer les fichiers
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  //2ème argument qui explique à multer quel nom de fichier utliser
  filename: (req, file, callback) => {
    //permet avec split de supprimé les espaces en les remplacant par l'underscore
    const name = file.originalname.split(' ').join('_');
    //permet de connaêtre l'extension du fichier
    const extension = MIME_TYPES[file.mimetype];
    //création du nom du fichier
    callback(null, name + Date.now() + '.' + extension);
  }
});

//Exportation de multer
module.exports = multer({storage: storage}).single('image');