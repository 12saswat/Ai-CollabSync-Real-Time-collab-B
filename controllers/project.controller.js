const { validationResult } = require("express-validator");
const {
  createProject,
  getProjects,
  addUserToProjects,
} = require("../services/project.service");
const userModel = require("../models/user.model");

exports.create = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    const finduserId = await userModel.findOne({ email: req.user.email });
    const userId = finduserId._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const project = await createProject({ name: req.body.name, userId });

    return res.status(201).json({ message: "Project created", project });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(error.message || { message: "Something went wrong" });
  }
};

exports.getAllProject = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  try {
    const findUserId = await userModel.findOne({ email: req.user.email });
    if (!findUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const projects = await getProjects(findUserId._id);

    return res.status(200).json({ message: "Projects fetched", projects });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(error.message || { message: "Something went wrong" });
  }
};

exports.addUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    const { projectId, users } = req.body;
    console.log(req.user);
    const findUserId = await userModel.findOne({ email: req.user.email });

    const updatedProject = await addUserToProjects({
      projectId,
      users,
      userId: findUserId._id,
    });

    return res
      .status(200)
      .json({ message: "User added to project", project: updatedProject });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(error.message || { message: "Something went wrong" });
  }
};
