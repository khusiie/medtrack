const mongoose = require("mongoose");

const PersonalDetails = mongoose.model("PersonalDetails", {
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  contactNumber: {
    type: String,
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
});

module.exports = PersonalDetails;
