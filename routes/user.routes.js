const express = require("express");
const {
  register,
  login,
  profile,
  logout,
  getAllUser,
  getProject,
} = require("../controllers/user.controller");
const { checkAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/all", checkAuth, getAllUser);
router.get("/logout", checkAuth, logout);
router.get("/profile", checkAuth, profile);
router.get("/:id", checkAuth, getProject);

module.exports = router;
