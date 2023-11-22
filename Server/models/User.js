const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  telephone: { type: String, required: true },
  adress: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' }, // Référence au département auquel cet utilisateur est associé
});

const User = mongoose.model('User', userSchema);

module.exports = User;
