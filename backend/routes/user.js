const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');  // Assurez-vous d'utiliser authController ici
const { getProfile, authenticateToken } = require('../controllers/user');  // Utiliser user.js pour les fonctions spécifiques au profil

// Route pour l'inscription
router.post('/register', register);

// Route pour la connexion
router.post('/login', login);

// Route pour obtenir le profil utilisateur (avec authentification JWT)
router.get('/profile', authenticateToken, getProfile);

module.exports = router;
