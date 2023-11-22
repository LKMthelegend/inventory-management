const Region = require('../models/Region');

// Méthode pour créer une nouvelle région
const createRegion = async (req, res) => {
  try {
    const { name } = req.body;
    const region = new Region({ name });
    await region.save();
    res.status(201).json(region);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la région' });
  }
};

// Méthode pour récupérer toutes les régions
const getAllRegions = async (req, res) => {
  try {
    const regions = await Region.find();
    res.json(regions);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des régions' });
  }
};

//Read Region
const getRegionById = async (req, res) => {
  try {
    const region = await Region.findById(req.params.id)
    if (!region) {
      return res.status(404).json({ error: 'Région non trouvé' });
    }
    res.json(region);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du région' });
  }
};
//Update
const updateRegion = async (req, res) => {
  try {
    const { name } = req.body;
    const region = await Region.findByIdAndUpdate(req.params.id, { name }, { new: true });
    if (!region) {
      return res.status(404).json({ error: 'Région non trouvé' });
    }
    res.json(region);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du région' });
  }
};

//Suppression d'une region
const deleteRegion = async (req, res) => {
  try {
    const region = await Region.findByIdAndRemove(req.params.id);
    if (!region) {
      return res.status(404).json({ error: 'Région non trouvé' });
    }
    res.json({ message: 'Région supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du région' });
  }
};


module.exports = {
  createRegion,
  getAllRegions,
  deleteRegion,
  getRegionById,
  updateRegion,
};
