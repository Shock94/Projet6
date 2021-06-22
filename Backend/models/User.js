const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); //import fonction mangoose pour email unique pour éviter des bugs

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, //adresse électronique de l'utilisateur [unique]
    password: { type: String, required: true } //hachage du mot de passe de l'utilisateur.
});

userSchema.plugin(uniqueValidator); //on ajoute au schema uniqueValidator

module.exports = mongoose.model('User', userSchema); //export le schema User avec userSchema