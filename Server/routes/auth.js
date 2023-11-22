const router = require("express").Router();
const {Utilisateur} = require("../models/Utilisateur");
const  Joi = require("joi");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
    try {
        const {error} = validate(req.body);
        if (error) {
            return res.status(400).send({message: error.details[0].message});
        }
        const utilisateur = await Utilisateur.findOne({email: req.body.email});
        if (!utilisateur){
            return res.status(401).send({message: "Email ou mot de passe incorrecte"});
        }

        const validPassword = await bcrypt.compare(
            req.body.password,
            utilisateur.password
        );
        if (!validPassword){
            return res.status(401).send({message: "Email ou mot de passe incorrecte"})
        }

        const token = utilisateur.generateAuthToken();
        res.status(200).send({data: token, message: "Connecté avec succès"});

    } catch (error) {
        res.status(500).send({message: "Erreur du serveur interne"});
    }
})

const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password")
    });
    return schema.validate(data);
}

module.exports = router;