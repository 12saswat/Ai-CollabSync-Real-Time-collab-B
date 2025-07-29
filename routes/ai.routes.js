const express = require("express");
const { getresults } = require("../controllers/ai.controller");
const router = express.Router();

router.get("/get-result", getresults);

module.exports = router;
