const bcrypt = require('bcrypt'); //import de bcrypt
const jwt = require('jsonwebtoken'); //import token d'authentificationcon
const User = require('../models/User'); //import du model user


exports.signup = (req, res, next) => { // methode asynchrone
    bcrypt.hash(req.body.password, 10) //fonction pour crypté un mdp, donne le mdp dans le corp de la req et hash 10 fois
        .then(hash => { //on récupère le hash du mdp
        const user = new User({ //création nouvel utilisateur
            email: req.body.email, //on donne l'adresse qui est dans le corps de la req
            password: hash //on donne le hash récupéré juste avant
        });
        user.save() //on enregistre dans la base de donnée
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) //201 pour création de ressource
            .catch(error => res.status(400).json({ error })); //400 pour différencié l'erreur 
        })
        .catch(error => res.status(500).json({ error })); //erreur serveur et envoir l'erreur dans un objet
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) //trouver 1 utilisateur avec mail unique
        .then(user => {
            if (!user) { //si on ne trouve pas de user alors ...
            return res.status(401).json({ error: 'Utilisateur non trouvé !' }); //pas trouvé le user dans la base de donnée
        }
            bcrypt.compare(req.body.password, user.password) //comparer le mdp de la req avec le hash dans le document user
                .then(valid => { //voir si la comparaison est bonne
                    if (!valid) { //si la comparaison est mauvaise alors...
                    return res.status(401).json({ error: 'Mot de passe incorrect !' }); //erreur 401
            }
            res.status(200).json({ // si on trouve le user et le comparaison bonne alors on renvoie un objet avec un id et token
                userId: user._id, //l'identifiant de l'utilisateur dans la base
                token: jwt.sign( //fonction sign de jsonwebtoken
                    { userId: user._id }, //les données qu'on veut encoder a l'interieur du token; objet avec le user de l'utilisateur
                    'RANDOM_TOKEN_SECRET', //la cle secrete de l'encodage
                    { expiresIn: '24h' } //expiration de 24 du token
                )
            });
        })
        .catch(error => res.status(500).json({ error })); //erreur serveur
    })
    .catch(error => res.status(500).json({ error })); //erreur serveur
};