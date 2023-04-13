require("dotenv").config();

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

const auth = require("./middleware/auth");
const token = require("./middleware/token");
const requestTracker = require("./middleware/requestTracker");

const championRoutes = require("./routes/championRoutes");
const itemRoutes = require("./routes/itemRoutes");
const userRoutes = require("./routes/userRoutes");
const createUserRoutes = require("./routes/createUserRoutes");
const gameRoutes = require("./routes/gameRoutes");
const guessRoutes = require("./routes/guessRoutes");
const scoreboardRoutes = require("./routes/scoreboardRoutes");
const statsRoutes = require("./routes/statsRoutes");

app.use(requestTracker);

app.use("/api", createUserRoutes);
app.use("/api", scoreboardRoutes);
app.use("/api", gameRoutes);

app.use(token);

app.use("/api", userRoutes);
app.use("/api", guessRoutes);

app.use("/api", auth, championRoutes);
app.use("/api", auth, itemRoutes);
app.use("/api", auth, statsRoutes);

module.exports = app;
