const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
<<<<<<< HEAD
  {
    date: { type: String, required: true }, //Optional
    rate: { type: Number, required: true }, //Optional
    paid: { type: Number, required: true },
    due: { type: Number },
    builder: { type: String },
    userId: { type: String, uniqed: true },
    contact: { type: String },
    location: { type: String },
  },
  { timestamps: true }
=======
    {
        date: { type: String, required: true }, //Optional
        rate: { type: Number, required: true }, //Optional
        paid: { type: Number, required: true },
        due: { type: Number },
        builder: { type: String },
        location: { type: String }
    },
    { timestamps: true }
>>>>>>> 52a7827ccf9d49d7ff815adbfda8df13bf67db9f
);

module.exports = mongoose.model("Attendance", Schema);
