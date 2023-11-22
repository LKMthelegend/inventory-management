const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'//reférence à l'utilisateur qui gère ce département
    },
});

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;