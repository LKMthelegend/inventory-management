const Hardware = require("../models/Hardware");

const countUserWithHardware = async (req, res) => {
  try {
    const hardwaresWithUsers = await Hardware.find({ user: { $exists: true } }).populate('user');
    
    // Fonction pour compter les utilisateurs uniques en utilisant leur ID
    const countUniqueUsersByID = (hardwares) => {
      const uniqueUserIDs = new Set();
      
      hardwares.forEach((hardware) => {
        if (hardware.user) {
          uniqueUserIDs.add(hardware.user._id.toString()); // Ajouter l'ID de l'utilisateur au set
        }
      });

      return uniqueUserIDs.size; // Retourner la taille du set qui correspond au nombre d'utilisateurs uniques
    };

    // Compter les utilisateurs uniques
    const uniqueUsersCount = countUniqueUsersByID(hardwaresWithUsers);
    res.json({ uniqueUsersCount });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs avec matériel' });
  }
};

module.exports = {
  countUserWithHardware,
};