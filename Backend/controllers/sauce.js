const Sauce = require('../models/Sauce'); //import model sauce
const fs = require('fs'); //donne acces a differente opération lié au systeme de fichier


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); //extraire l'objet json de la sauce dans le corps de la req
    delete sauceObject._id; //_id faux donc delete car va être généré automatiquement par MongoDB
    const sauce = new Sauce({ //creer une nouvelle sauce
        ...sauceObject, //copie ce qu'il y a dans le corps de la requete
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //generer l'url de l'image : le protocol + le nom d'hote / image + le nom du fichier
    });
    sauce.likes = 0;
    sauce.dislikes = 0;
    sauce.save() //save la sauce a la base de données
        .then(() => res.status(201).json({ message: 'Objet enregistré !'})) //201 car création d'objet
        .catch(error => res.status(400).json({ error })); //erreur 400
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? //voir si req.file existe : si il existe on recupere puis genere la nouvel image sinon on recupere le corps de la req
    {
        ...JSON.parse(req.body.sauce), //on recupere l'objet json dans le corps de la req
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //on genere la nouvel image url
    } : { ...req.body }; //sinon on recupere le corps de la req
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) //verifié que l'id de la requete soit le meme que celui du nouvel objet
        .then(() => res.status(200).json({ message: 'Objet modifié !'})) //réponse ok
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) //trouver la sauce a supprimer en cherchant l'id qui dans le corps de la req
        .then(sauce => { //recuperer la sauce dans le callback
            const filename = sauce.imageUrl.split('/images/')[1]; //recuperer le nom du fichier car le nom du fichier se trouve apres ce qu'il y a apres le '/image'
            fs.unlink(`images/${filename}`, () => { //unlink supprime un fichier
        Sauce.deleteOne({ _id: req.params.id }) //supprime la sauce avec son id dans le corps de la req
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error })); //erreur serveur
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) //recupère 1 sauce via son id
        .then(sauce => res.status(200).json(sauce)) //retourne la sauce si il est dans la base de donnée
        .catch(error => res.status(404).json({ error })); //404 objet non trouvé
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find() //récuperer la liste complete des sauces
        .then(sauces => res.status(200).json(sauces)) //dans la réponse récuperer le tableau de toutes les sauces envoyé par la base
        .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) //recupère 1 sauce via son id
        .then(sauce => {
            const { userId, like } = req.body;
            if(like < -1 || like > 1){ // si like est invalide
                return res.status(400).json({ error: 'Valeur "j\'aime" invalide' }); //erreur 400
            }
            const usersLiked = [...sauce.usersLiked]; //declare un tableau qui contient la copie du tableau userLiked
            const usersDisliked = [...sauce.usersDisliked]; //declare un tableau qui contient la copie du tableau userDisiked
            const usersLikedIndex = usersLiked.indexOf(userId); //position du userId dans le tableau userLiked
            const usersDislikedIndex = usersDisliked.indexOf(userId); //position du userId dans le tableau userDisliked
            let { likes, dislikes } = sauce; 
            const addUserLike = () => { //fonction ajoute 1 like
                if(usersLikedIndex === -1){ //Si il ne se trouve pas dans le tableau des usersLiked
                    usersLiked.push(userId); //rajoute le userId dans le tableau usersLiked
                    likes++; //incrémente les likes de 1
                }
            };
            const removeUserLike = () => { //supprime un like
                if(usersLikedIndex !== -1){ //si le users est dans le tableau usersLiked
                    usersLiked.splice(usersLikedIndex, 1); //supprime l'userId du tableau des utilisateurs qui ont likés
                    likes--; //décrémente les likes de 1
                }
            };
            const addUserDislike = () => { //fonction ajoute un dislike
                if(usersDislikedIndex === -1){ //si l'utilisteur n'est pas dans le tableau userDisliked
                    usersDisliked.push(userId); //rajoute le userId dans le tableau usersDisliked
                    dislikes++; //incrémente les dislikes de 1
                }
            };
            const removeUserDislike = () => { //fonction supprime un dislike
                if(usersDislikedIndex !== -1){ //si le users est dans le tableau usersDisliked
                    usersDisliked.splice(usersDislikedIndex, 1); //supprime l'userId du tableau des utilisateurs qui ont dislikés
                    dislikes--; //décrémente les dislikes de 1
                }
            };

            if (like === 0) {
                removeUserLike();
                removeUserDislike();
            } else if (like === 1) { 
                addUserLike();
                removeUserDislike();
            } else if (like === -1) {
                removeUserLike();
                addUserDislike();
            }
           Sauce.updateOne({ _id: sauce._id }, { likes, dislikes, usersLiked, usersDisliked }) //mise a jour des likes
                .then(() => res.status(200).json({ message: 'Like enregistré !'})) 
                .catch(error => res.status(500).json({ error }));
        }) 
        .catch(error => res.status(404).json({ error })); //404 objet non trouvé
}