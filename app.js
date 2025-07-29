const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const connectToDb = require("./db");
const userRoutes = require("./routes/user.routes");
const cookieParser = require("cookie-parser");
const projectRoutes = require("./routes/project.routes");
const aiRoutes = require("./routes/ai.routes");

connectToDb();

app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: "https://ai-collab-sync-real-time-collab.vercel.app", // deployed frontend
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/ai", aiRoutes);

module.exports = app;
