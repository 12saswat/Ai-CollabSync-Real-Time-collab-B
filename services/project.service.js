const { default: mongoose } = require("mongoose");
const projectModel = require("../models/project.model");

const createProject = async ({ name, userId }) => {
  if (!name) {
    throw new Error("Name is required");
  }
  if (!userId) {
    throw new Error("User is required");
  }
  const project = await projectModel.create({ name, user: userId });
  return project;
};

const getProjects = async (userId) => {
  if (!userId) {
    throw new Error("User is required");
  }
  const projects = await projectModel
    .find({ user: userId })
    .populate("user", "name email"); // 👈 Only populate 'name' and 'email'

  console.log(projects);
  return projects;
};

const addUserToProjects = async ({ projectId, users, userId }) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project id");
  }
  if (
    !Array.isArray(users) ||
    users.some((userId) => !mongoose.Types.ObjectId.isValid(userId))
  ) {
    throw new Error("Invalid userId's in user array");
  }

  if (!userId) {
    throw new Error("User is required");
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user id");
  }

  console.log("userId: ", userId, "projectId: ", projectId);
  const project = await projectModel.findOne({ _id: projectId, user: userId });
  console.log(project);
  if (!project) {
    throw new Error("User not belong to this project");
  }

  const updatedProject = await projectModel.findOneAndUpdate(
    { _id: projectId },
    { $addToSet: { user: { $each: users } } },
    { new: true }
  );

  return updatedProject;
};

module.exports = {
  createProject,
  getProjects,
  addUserToProjects,
};
