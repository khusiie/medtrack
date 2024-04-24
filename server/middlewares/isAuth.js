const Users = require("../models/User");
const jwt = require("jsonwebtoken");

const isAuth = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ success: false, errors: "No token" });
  }

  try {
    const data = jwt.decode(token, "secret_key");
    const user = await Users.findById(data.user.id);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, errors: "Invalid token" });
  }
};

module.exports = isAuth;
