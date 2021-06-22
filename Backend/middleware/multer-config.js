const multer = require('multer'); //import multer

const MIME_TYPES = { // un objet qui fait office de dictionnaire pour le type du fichier
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({ //creer un objet de configuration de multer (besoin de 2 éléments)
    destination: (req, file, callback) => { //dans quel dossier enregistrer les fichiers
        callback(null, 'images'); //null pour pas d'erreur et lui passer le dossier images
    },
    filename: (req, file, callback) => { //indiquer le nom du fichier utiliser
        const name = file.originalname.split(' ').join('_'); //generer le nouveau nom pour le fichier,nom original en remplaçant les ' ' par des'_'
        const extension = MIME_TYPES[file.mimetype]; //creer l'extension du fichier avec l'element du dictionnaire qui correspond au type du fichier envoyé par le frontend
        callback(null, name + Date.now() + '.' + extension); //ajoute le nom de la const + un timestamps (pour le rendre plus unique possible) + un '.' + l'extension
    }
});

module.exports = multer({storage: storage}).single('image'); //export du middleware configure