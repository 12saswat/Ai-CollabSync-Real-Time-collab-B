const { default: mongoose } = require("mongoose");
const userModel = require("../models/user.model");
const projectModel = require("../models/project.model");

const createUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const user = await userModel.create({ email, password });

  return user;
};

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("User does not exist");
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }
  return user;
};

const getAllUser = async ({ userId }) => {
  const users = await userModel.find({ _id: { $ne: userId } });
  return users;
};

const findProject = async ({ projectId }) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project id");
  }
  const project = await projectModel
    .findById(projectId)
    .populate("user", "name email");
  return project;
};

module.exports = {
  createUser,
  loginUser,
  getAllUser,
  findProject,
};
