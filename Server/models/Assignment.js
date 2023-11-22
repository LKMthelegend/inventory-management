const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Référence à l'utilisateur auquel le matériel ou le logiciel est affecté
  hardware: { type: mongoose.Schema.Types.ObjectId, ref: 'Hardware' }, // Référence au matériel affecté
  assignmentDate: { type: Date, default: Date.now },
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
