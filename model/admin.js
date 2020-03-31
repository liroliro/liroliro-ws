const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({

    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;