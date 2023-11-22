const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // Ajoutez d'autres champs spécifiques à une région si nécessaire
});

const Region = mongoose.model('Region', regionSchema);

module.exports = Region;
