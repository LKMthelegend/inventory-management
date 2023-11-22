const mongoose = require('mongoose');
const Hardware = require('../models/Hardware');
const Schema = mongoose.Schema;



const softwareSchema = new mongoose.Schema({
  name: { type: String, required: true },
  version: { type: String },
  licence: { type: String },
  type: { type: String},
  expiration: {type: Number},
});
// Middleware pour intercepter la suppression d'un logiciel
softwareSchema.pre('remove', async function (next) {
  const software = this;

  try {
    await Hardware.updateMany(
      { software: software._id },
      { $pull: { software: software._id } }
    );
    next();
  } catch (error) {
    next(error);
  }
});

const Software = mongoose.model('Software', softwareSchema);

module.exports = Software;
