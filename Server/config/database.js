const mongoose = require('mongoose');

require('dotenv').config(); // Charge les variables d'environnement à partir du fichier .env

// Récupérez l'URI de connexion à votre base de données depuis votre fichier .env
const MONGODB_URI = process.env.MONGODB_URI
// Options de configuration de Mongoose (facultatif)
// const mongooseOptions = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
// };

// Connectez-vous à la base de données
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connexion à la base de données MongoDB établie.');
  })
  .catch((error) => {
    console.error('Erreur de connexion à la base de données :', error);
  });

// Écoutez les événements de connexion, d'erreur et de déconnexion de la base de données
mongoose.connection.on('connected', () => {
  console.log('Connexion à la base de données établie.');
});

mongoose.connection.on('error', (err) => {
  console.error('Erreur de connexion à la base de données :', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Déconnexion de la base de données.');
});

module.exports = mongoose;
