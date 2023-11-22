const mongoose = require("mongoose");
module.exports = () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    try {
        mongoose.connect(process.env.MONGODB_URI, connectionParams);
        console.log("connexion réussie à la base de donnée");
    } catch (error) {
        console.log(error);
        console.log("Echec de la connexion à la base de donnée");
    }
}