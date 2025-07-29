const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const userModel = require("../models/user.model");

exports.checkAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Not authorized" });
  }
};
