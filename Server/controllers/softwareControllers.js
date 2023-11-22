const Software = require('../models/Software');
const Hardware = require('../models/Hardware');

// Méthode pour créer un nouveau logiciel
const createSoftware = async (req, res) => {
  try {
    const { name, version, licence, expiration } = req.body;
    const software = new Software({
      name,
      version,
      licence,
      expiration,
    });
    await software.save();
    res.status(201).json(software);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du logiciel' });
  }
};

// Méthode pour récupérer tous les logiciels
const getAllSoftware = async (req, res) => {
  try {
    const software = await Software.find();
    res.json(software);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des logiciels' });
  }
};

// Méthode pour récupérer un logiciel par son ID
const getSoftwareById = async (req, res) => {
  try {
    const software = await Software.findById(req.params.id);
    if (!software) {
      return res.status(404).json({ error: 'Logiciel non trouvé' });
    }
    res.json(software);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du logiciel' });
  }
};

// Méthode pour mettre à jour un logiciel
const updateSoftware = async (req, res) => {
  try {
    const { name, version, licence, expiration } = req.body;
    const software = await Software.findByIdAndUpdate(req.params.id, { name, version, licence, expiration }, { new: true });
    if (!software) {
      return res.status(404).json({ error: 'Logiciel non trouvé' });
    }
    res.json(software);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du logiciel' });
  }
};

// Méthode pour supprimer un logiciel
const deleteSoftware = async (req, res) => {
  try {
    const software = await Software.findByIdAndRemove(req.params.id);
    if (!software) {
      return res.status(404).json({ error: 'Logiciel non trouvé' });
    }
    
    // Supprimer les références du logiciel dans d'autres collections, si nécessaire
    await Hardware.updateMany(
      { software: software._id },
      { $pull: { software: software._id } }
    );

    // Supprimer le logiciel
    await software.deleteOne();
    
    res.json({ message: 'Logiciel supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du logiciel', errorMessage: error.message });
  }
};

module.exports = {
  createSoftware,
  getAllSoftware,
  getSoftwareById,
  updateSoftware,
  deleteSoftware,
};
