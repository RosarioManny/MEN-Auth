const mongoose = require("mongoose"); 

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
})

const User = mongoose.model("User", userSchema);

module.exports = User

// #3
// Require mongoose, make schema,
// attach schema to vairable and export that variable.
