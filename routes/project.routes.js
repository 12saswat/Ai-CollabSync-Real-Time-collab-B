const express = require("express");
const {
  create,
  getAllProject,
  addUser,
} = require("../controllers/project.controller");
const { checkAuth } = require("../middlewares/auth.middleware");
const app = express();

app.post("/create", checkAuth, create);
app.get("/", checkAuth, getAllProject);
app.put("/add-user", checkAuth, addUser);

module.exports = app;
