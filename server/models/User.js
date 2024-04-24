const mongoose = require("mongoose");

const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

module.exports = Users;
