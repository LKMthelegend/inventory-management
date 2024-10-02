const Hardware = require("../models/Hardware");

const verificationUser = async (req, res) => {
     try {
    const userId = req.params.userId;
    const hardwares = await Hardware.find({ user: userId });
    res.json(hardwares);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des matériels pour cet utilisateur' });
  }
};

module.exports = {
    verificationUser,
}