const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauce'); //import du controller
const auth = require('../middleware/auth'); //import des authentification
const multer = require('../middleware/multer-config'); //import multer-configure


router.post('/', auth, multer, sauceCtrl.createSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces);


module.exports = router;