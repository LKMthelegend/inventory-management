const User = require('../models/User');
const mongoose = require('mongoose');


const createUser = async (req, res) => {
  try {
    const { username, email, telephone, adress, department } = req.body;
    const user = new User({ username, email, telephone, adress, department });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('department').sort({ username: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('department');
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, email, telephone, adress, department } = req.body;
    console.log('Données reçues pour la mise à jour :', req.body);
    if (!mongoose.Types.ObjectId.isValid(department)) {
      return res.status(400).json({ error: 'Le département n\'est pas une ObjectId valide' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { username, email, telephone, adress, department }, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
  res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
