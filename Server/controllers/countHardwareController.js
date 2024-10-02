const Hardware = require("../models/Hardware");

// Méthode pour récupérer le nombre de matériels utilisés
const getUsedHardwareCount = async (req, res) => {
  try {
    const usedHardwareCount = await Hardware.countDocuments({ status: true });
    res.status(200).json({ usedHardwareCount });
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre de matériels utilisés : ', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du nombre de matériels utilisés' });
  }
};

module.exports = {
  getUsedHardwareCount,
};