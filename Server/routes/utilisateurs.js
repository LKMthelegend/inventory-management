const router = require("express").Router();
const {Utilsateur, validate, Utilisateur} = require("../models/Utilisateur");
const bcrypt = require("bcrypt");

router.post("/", async (req, res)=> {
    try {
        const {error} = validate(req.body);
        if (error) {
            return res.status(400).send({message: error.details[0].message});
        }
        const utilisateur = await Utilisateur.findOne({email: req.body.email}); 
        if (utilisateur) {
            return res.status(409).send({message: "L'utilisateur avec cet email existe déjà!"});
        }
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword  = await bcrypt.hash(req.body.password, salt);

        await new Utilisateur({...req.body, password: hashPassword}).save();
        res.status(201).send({message:"Utilisateur créé avec succès"})
    } catch (utilisateur) {
        return res.status(500).send({message: "Erreur du serveur interne"});
    }
});
module.exports = router;