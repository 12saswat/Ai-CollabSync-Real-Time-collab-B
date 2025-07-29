const { generateResult } = require("../services/ai.service");

exports.getresults = async (req, res) => {
  try {
    const { prompt } = req.query;
    const response = await generateResult(prompt);
    return res.status(200).json({ message: "results fetched", response });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(error.message || { message: "Something went wrong" });
  }
};
