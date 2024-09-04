const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 8,
    maxlength: 30
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 60 // Ajusté pour permettre le stockage du hash bcrypt
  },
  profileImage: {
    type: String, // Pour stocker le nom du fichier image
    required: false
  }
});

// Hachage du mot de passe avant de sauvegarder l'utilisateur



module.exports = mongoose.model('User', UserSchema);
