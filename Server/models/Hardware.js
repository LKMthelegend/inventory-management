const mongoose = require('mongoose');

const hardwareSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  serialNumber: { type: String, required: true },
  date: { type: Date, default: new Date() },
  status:{type:Boolean, default: false},
  software: [{type: mongoose.Schema.Types.ObjectId, ref: 'Software'}], //Référence aux logiciels installée dans chaque ordinateur
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Référence à l'utilisateur auquel ce matériel est affecté
});

const Hardware = mongoose.model('Hardware', hardwareSchema);

module.exports = Hardware;
