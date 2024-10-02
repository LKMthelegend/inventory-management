const { configDotenv } = require('dotenv');
const Department = require('../models/Department');

//Méthode pour créer un nouveau département
const createDepartment = async (req, res) => {
    try {
        const { name, manager } = req.body;
        const department = new Department({
            name,
            manager,
        });
        await department.save();
        res.status(201).json(department);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du département'});
    }
};

//Méthode pour récupérer tous les départements
const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find().populate('manager').sort({ name: 1 });
        res.json(departments);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des départements'});
    }
};

//Méthode pour récupérer un département par son ID
const getDepartmentById = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id).populate('manager');
        if (!department) {
            return res.status(404).json({ error: 'Département non trouvé'});
        }
        res.json(department);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du département'});
    }
};


//Méthode pour mettre à jour un département
const updateDepartment = async (req, res) => {
    try{
        const { name, manager} = req.body;
        const department = await Department.findByIdAndUpdate(req.params.id, { name, manager}, { new: true});
        if (!department) {
            return res.status(404).json({ error: 'Département non trouvé'});
        }
        res.json(department);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors la mise à jour du département'});
    }
};

//Méthode pour supprimer du département
const deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndRemove(req.params.id);
        if (!department) {
            return res.status(404).json({ error: 'Département non trouvé'});
        }
        res.json({ message: 'Département supprimé avec succès'});
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression du département'});
    }
};


module.exports = {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
};