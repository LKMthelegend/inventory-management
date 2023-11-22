const Hardware = require('../models/Hardware');
const Software = require('../models/Software');
const User = require("../models/User");

// Méthode pour créer un nouveau matériel
const createHardware = async (req, res) => {
  try {
    const { name, type, serialNumber, date, software, user } = req.body;
    // Vérifiez d'abord si les logiciels existent dans la base de données
    const existingSoftware = await Software.find({ _id: { $in: software } });
    console.log("softwares:", existingSoftware);
    if (existingSoftware.length !== software.length) {
      return res.status(400).json({ message: 'Certains logiciels n\'existent pas' });
    }
    // Vérification si un utilisateur est référencé pour le matériel
    const status = !!user; // Si user est défini, status est true, sinon false
    const hardware = new Hardware({
      name,
      type,
      serialNumber,
      date,
      status,
      software,
      user,
    });
    await hardware.save();
    res.status(201).json(hardware);
  } catch (error) {
    console.error('Erreur lors de la création du matériel : ', error); // Afficher l'erreur complète dans la console
    res.status(500).json({ error: 'Erreur lors de la création du matériel', errorMessage: error.message });
  }
};

// Méthode pour récupérer tout le matériel
const getAllHardware = async (req, res) => {
  try {
    const hardware = await Hardware.find().populate('user').populate('software').sort({ date: -1 });;
    res.json(hardware);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du matériel' });
  }
};
// Méthode pour récupérer les matériels par statut
const getHardwaresByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    let hardwares;

    if (status !== undefined) {
      hardwares = await Hardware.find({ status });
    } else {
      hardwares = await Hardware.find();
    }

    res.json(hardwares);
  } catch (error) {
    console.error('Erreur lors de la récupération des matériels : ', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des matériels' });
  }
};

// Méthode pour récupérer du matériel par son ID
const getHardwareById = async (req, res) => {
  try {
    const hardware = await Hardware.findById(req.params.id).populate('user').populate('software');
    if (!hardware) {
      return res.status(404).json({ error: 'Matériel non trouvé' });
    }
    res.json(hardware);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du matériel' });
  }
};

// Méthode pour mettre à jour du matériel
const updateHardware = async (req, res) => {
  try {
    const { name, type, serialNumber, date, software, user } = req.body;
    const hardware = await Hardware.findByIdAndUpdate(req.params.id, { name, type, serialNumber, date, software, user }, { new: true });
    if (!hardware) {
      return res.status(404).json({ error: 'Matériel non trouvé' });
    }
    res.json(hardware);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du matériel' });
  }
};

// Méthode pour supprimer du matériel
const deleteHardware = async (req, res) => {
  try {
    const hardware = await Hardware.findByIdAndRemove(req.params.id);
    if (!hardware) {
      return res.status(404).json({ error: 'Matériel non trouvé' });
    }
    res.json({ message: 'Matériel supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la création du matériel : ', error)
    res.status(500).json({ error: 'Erreur lors de la suppression du matériel' });
  }
};

module.exports = {
  createHardware,
  getAllHardware,
  getHardwareById,
  updateHardware,
  deleteHardware,
  getHardwaresByStatus,
};
