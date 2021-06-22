const express = require('express'); //import express
const app = express(); //notre application express
const bodyParser = require('body-parser'); //package pour extraire l'objet JSON de la demande
const mongoose = require('mongoose'); //import mangoose
const sauceRoutes = require('./routes/sauce'); //import des routes pour les sauces
const userRoutes = require('./routes/user'); //import des routes pour les users
const path = require('path'); //nous donne acces au systeme de chemin exact pour les fichiers 

mongoose.connect('mongodb+srv://shock:pat94@cluster0.dgchr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use((req, res, next) => { //Le header pour toutes les requetes 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json()); 

app.use('/images', express.static(path.join(__dirname, 'images'))); //middleware pour repondre au demande /images 
app.use('/api/sauces', sauceRoutes); //enregistrer les routes attendu par le frontend(la racine de la route sauce)
app.use('/api/auth', userRoutes); //enregistrer les routes attendu par le frontend(la racine de la route user)


module.exports = app; //export l'application pour y accéder depuis les autres fichier de notre projet