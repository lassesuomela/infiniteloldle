require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const schedule = require("node-schedule");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 450,
  standardHeaders: false,
  legacyHeaders: false,
  validate: {
    trustProxy: false,
  },
});

const job = schedule.scheduleJob("55 23 * * *", () => {
  requestTracker.saveStats();
});

const app = express();
app.use(limiter);
app.use(cors());

app.set("trust proxy", 1);

app.use(helmet());
app.use(express.json());
app.use(morgan("combined"));

const token = require("./middleware/token");
const requestTracker = require("./middleware/requestTracker");
const waf = require("./middleware/waf");

const userRoutes = require("./routes/userRoutes");
const createUserRoutes = require("./routes/createUserRoutes");
const gameRoutes = require("./routes/gameRoutes");
const guessRoutes = require("./routes/guessRoutes");
const scoreboardRoutes = require("./routes/scoreboardRoutes");
const statsRoutes = require("./routes/statsRoutes");

app.use(waf.checkRequest);
app.use(requestTracker.trackRequests);

app.use("/api", createUserRoutes);
app.use("/api", scoreboardRoutes);
app.use("/api", gameRoutes);
app.use("/api", statsRoutes);

app.use(token);
app.use(requestTracker.trackDAU);

app.use("/api", userRoutes);
app.use("/api", guessRoutes);

module.exports = app;
