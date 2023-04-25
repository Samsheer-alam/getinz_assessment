const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true },
    otp: { type: Number, required: true },
    status: { type: Boolean, required: true, default: false }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
