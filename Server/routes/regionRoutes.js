const express = require('express');
const router = express.Router();
const regionControllers = require('../controllers/regionControllers');

// Route pour créer une nouvelle région
router.post('/', regionControllers.createRegion);

// Route pour récupérer toutes les régions
router.get('/', regionControllers.getAllRegions);

//Supprimer une region
router.delete('/:id', regionControllers.deleteRegion);


router.get('/:id', regionControllers.getRegionById);

//mise à jour
router.put('/:id', regionControllers.updateRegion);

module.exports = router;
