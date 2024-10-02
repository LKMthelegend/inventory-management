require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require('./config/db');
const UtilisateurRoutes = require("./routes/utilisateurs");
const authroutes = require("./routes/auth");

//Delaration
const departmentRoutes = require('./routes/departmentRoutes');
const userRoutes = require('./routes/userRoutes');
const hardwareRoutes = require('./routes/hardwareRoutes');
const softwareRoutes = require('./routes/softwareRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const countHardwareRoutes = require("./routes/countHardwareRoutes");
const checkUserRoutes = require("./routes/checkUserRoutes");
const countUserWithHardware = require("./routes/countUserWithHardwareRoutes");

//Database connection
connection();

//Middlewares
app.use(express.json())
app.use(cors());

//Routes
app.use("/api/utilisateurs", UtilisateurRoutes);
app.use("/api/auth", authroutes);
//Routes de l'Application
app.use('/departments', departmentRoutes);
app.use('/users', userRoutes);
app.use('/hardwares', hardwareRoutes);
app.use('/softwares', softwareRoutes);
app.use('/assignments', assignmentRoutes);
app.use('/count-hardwares', countHardwareRoutes);
app.use('/check-user', checkUserRoutes);
app.use('/user-with-hardwares', countUserWithHardware);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Ecoute sur le port ${port} ...`))