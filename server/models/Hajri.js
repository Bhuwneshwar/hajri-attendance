const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
    {
        date: { type: String, required: true }, //Optional
        rate: { type: Number, required: true }, //Optional
        paid: { type: Number, required: true },
        due: { type: Number },
        builder: { type: String },
        location: { type: String }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Attendance", Schema);
