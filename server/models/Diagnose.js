const mongoose = require("mongoose");

const Diagnose = mongoose.model("Diagnose", {
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  ecg_prediction: {
    type: String,
  },
  symptoms: {
    type: String,
  },
  chatHistory: [
    {
      message: {
        type: String,
      },
      llm: {
        type: Boolean,
        default: false,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Diagnose;
