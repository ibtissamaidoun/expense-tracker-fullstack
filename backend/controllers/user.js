const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Fonction pour obtenir le profil utilisateur
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Erreur serveur:', error.message);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Middleware pour vérifier le token JWT
exports.authenticateToken = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Accès refusé, aucun token fourni' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Token invalide' });
    }
};
