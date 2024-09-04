const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Configuration de multer pour gérer les uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Dossier où les images seront stockées
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nom unique pour chaque fichier
  }
});

const upload = multer({ storage: storage });

exports.register = [
  upload.single('profile'), // Middleware pour gérer l'upload de l'image de profil
  async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    // Validation des champs
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Validation des mots de passe
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
    }

    try {
      // Vérification si l'utilisateur existe déjà
      let user = await User.findOne({ email: email.trim() });
      if (user) {
        return res.status(400).json({ message: 'Utilisateur déjà existant' });
      }

      // Hachage du mot de passe avant de sauvegarder l'utilisateur
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password.trim(), salt);
      console.log('Mot de passe haché:', hashedPassword); // Log du mot de passe haché

      // Création d'un nouvel utilisateur
      user = new User({
        name,
        email: email.trim(),
        password: hashedPassword, // Utilisation du mot de passe haché
        profileImage: req.file ? req.file.filename : null // Stocke le nom du fichier de l'image de profil
      });

      await user.save();
      console.log('Utilisateur créé:', user); // Log de l'utilisateur créé

      // Génération du token JWT
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });

      res.status(201).json({ token, message: 'Inscription réussie' });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error.message);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
];

exports.login = async (req, res) => {
  try {
      console.log('Données reçues pour la connexion:', req.body); // Log les données reçues

      const { email, password } = req.body;

      // Vérifier si l'utilisateur existe
      const user = await User.findOne({ email: email.trim() });
      console.log('Utilisateur trouvé:', user); // Log l'utilisateur trouvé

      if (!user) {
          return res.status(400).json({ message: "Email incorrect" });
      }

      // Vérifier si le mot de passe est correct
      const isMatch = await bcrypt.compare(password.trim(), user.password);
      console.log('Mot de passe saisi:', password); // Log du mot de passe saisi
      console.log('Mot de passe haché stocké:', user.password); // Log du mot de passe haché stocké
      console.log('Résultat de la comparaison du mot de passe:', isMatch); // Log du résultat de la comparaison

      if (!isMatch) {
          return res.status(400).json({ message: "Mot de passe incorrect" });
      }

      // Générer un token JWT pour l'utilisateur authentifié
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });

      res.status(200).json({ message: "Login réussi", token });
  } catch (err) {
      console.error('Erreur lors de la connexion:', err);
      res.status(500).json({ message: "Erreur serveur" });
  }
};

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
