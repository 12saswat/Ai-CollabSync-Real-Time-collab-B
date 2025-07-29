const { validationResult } = require("express-validator");
const {
  createUser,
  loginUser,
  getAllUser,
  findProject,
} = require("../services/user.service");
const userModel = require("../models/user.model");

exports.register = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    const user = await createUser(req.body);

    const token = user.generateJWT();

    return res.status(201).json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(error.message || { message: "Something went wrong" });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    const user = await loginUser(req.body);

    const token = user.generateJWT();

    return res
      .status(201)
      .json({ message: "login  successfully", user, token });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(error.message || { message: "Something went wrong" });
  }
};

exports.profile = async (req, res) => {
  const user = req.user;
  return res.status(200).json({ message: "user fetched", user });
};

exports.logout = async (req, res) => {
  try {
    const token =
      req.cookies.token || req.headers?.authorization?.split(" ")[1];

    await redisClient.set(token, "logout", "EX", 60 * 60 * 24);

    return res.status(200).json({ message: "logout successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(error.message || { message: "Something went wrong" });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const userId = await req.user._id;

    const users = await getAllUser({ userId });

    return res.status(200).json({ message: "users fetched", users });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(error.message || { message: "Something went wrong" });
  }
};

exports.getProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await findProject({ projectId });
    return res.status(200).json({ message: "project fetched", project });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(error.message || { message: "Something went wrong" });
  }
};
