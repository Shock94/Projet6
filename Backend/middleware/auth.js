const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try { //pleins d'élément qui peuvent poser problèmes donc pour mieux les gérer try/catch
        const token = req.headers.authorization.split(' ')[1]; // retourne un tableau qu'on split et on recupère le 2eme élément qui est apres le bearer
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); //decodé le token
        const userId = decodedToken.userId; //on récupère le userid
        if (req.body.userId && req.body.userId !== userId) { // si on a un userId dans la req ET si le userId est différent alors...
        throw 'Invalid user ID'; //pour renvoyer l'erreur au catch
        } else { //si tous va bien
        next(); // ce middleware est appliqué avant les controllers de nos routes donc il faut faire un next
        }
    } catch {
        res.status(401).json({ // erreur d'authentification 
        error: new Error('Invalid request!')
        });
    }
};