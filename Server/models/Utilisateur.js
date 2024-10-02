const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const utilisateurSchema = new mongoose.Schema({
    email: {type:String, required:true},
    password: {type:String, required:true}
});

utilisateurSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id:this._id}, process.env.JWTPRIVATEKEY,{expiresIn:"7d"});
    return token;
};

const Utilisateur = mongoose.model("utilisateur", utilisateurSchema);

const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password")
    });
    return schema.validate(data);
}

module.exports = {Utilisateur, validate};