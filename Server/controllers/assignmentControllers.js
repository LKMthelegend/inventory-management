const Assignment = require('../models/Assignment');
const Hardware = require('../models/Hardware');
const User = require('../models/User');
const moment = require('moment');
// Méthode pour créer une nouvelle affectation
const createAssignment = async (req, res) => {
  try {
    const { userId, hardwareId } = req.body;
    const assignment = new Assignment({
      user: userId,
      hardware: hardwareId,
    });
    // Mise à jour de la référence dans le modèle Hardware
    const updatedHardware = await Hardware.findByIdAndUpdate(
      hardwareId,
      { user: userId, status: true }, // Mettre à jour le statut du matériel à true
      { new: true }
    );

    if (!updatedHardware) {
      return res.status(404).json({ error: 'Matériel non trouvé' });
    }
    // Mise à jour de la référence dans le modèle User
    await User.findByIdAndUpdate(userId, { $push: { hardware: hardwareId } });
    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'affectation' });
  }
};

// Contrôleur pour libérer le matériel
const releaseHardware = async (req, res) => {
  try {
    const { assignmentId } = req.params; // Utilisation de assignmentId pour récupérer l'identifiant de l'assignation

    // Trouver l'assignation correspondante
    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ error: 'Assignation non trouvée' });
    }

    // Récupérer les références de l'utilisateur et du matériel
    const { user: userId, hardware: hardwareId } = assignment;

    // Mise à jour du modèle Hardware pour libérer le matériel
  await Hardware.findByIdAndUpdate(hardwareId, { status: false, user: null });
    // Mise à jour du modèle User pour libérer l'utilisateur
    await User.findByIdAndUpdate(userId, { $pull: { hardware: hardwareId } });

    // Supprimer l'assignation
    await Assignment.findByIdAndRemove(assignmentId);

    res.json({ message: 'Matériel libéré avec succès' });
  } catch (error) {
    console.error('Erreur lors de la libération du matériel : ', error);
    res.status(500).json({ error: 'Erreur lors de la libération du matériel', errorMessage: error.message });
  }
};


// Méthode pour récupérer toutes les affectations
const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().populate('user hardware').sort({ assignmentDate: -1 });

    // Fonction pour formater la date au format spécifié
    const formatAssignmentDate = (dateString) => {
      return moment.utc(dateString).format('HH:mm DD/MM/YY');
    };

    // Formater les dates de chaque affectation dans le tableau
    const formattedAssignments = assignments.map((assignment) => {
      return {
        ...assignment.toObject(),
        assignmentDate: formatAssignmentDate(assignment.assignmentDate)
      };
    });

    res.json(formattedAssignments);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des affectations' });
  }
};
// Méthode pour récupérer une affectation par son ID
const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate('user hardware');
    if (!assignment) {
      return res.status(404).json({ error: 'Affectation non trouvée' });
    }
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'affectation' });
  }
};




module.exports = {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  releaseHardware,
};
