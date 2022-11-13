require("dotenv").config()

const db = require("./configs/db");

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();
app.use(cors());

app.set("trust proxy", true);

app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

const auth = require("./configs/auth");
const token = require("./configs/token");

const championRoutes = require("./routes/championRoutes");
const userRoutes = require("./routes/userRoutes");
const createUserRoutes = require("./routes/createUserRoutes");
const gameRoutes = require("./routes/gameRoutes");
const guessRoutes = require("./routes/guessRoutes");
const scoreboardRoutes = require("./routes/scoreboardRoutes");

app.use("/api", createUserRoutes);
app.use("/api", scoreboardRoutes);
app.use("/api", gameRoutes);

app.use(token);

app.use("/api", userRoutes);
app.use("/api", guessRoutes);

app.use("/api", auth, championRoutes);

module.exports = app;