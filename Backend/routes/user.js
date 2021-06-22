const express = require('express'); //on a besoin d'express pour créer un routeur
const router = express.Router(); //on creer le routeur

const userCtrl = require('../controllers/user'); //le controler pour associé les fonctions au différente routes

router.post('/signup', userCtrl.signup); //création des route et post car envoie login et mdp
router.post('/login', userCtrl.login); //création des route et post car envoie login et mdp

module.exports = router; //on export le routeur pour app.js