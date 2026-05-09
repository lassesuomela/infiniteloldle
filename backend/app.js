require("dotenv").config();

const Sentry = require("@sentry/node");
Sentry.init({
  dsn: "https://27311a3db6fbf33bb814ef51f4050731@o4506107190575104.ingest.us.sentry.io/4510851880648704",
  sendDefaultPii: true,
  enableLogs: true,
  tracesSampleRate: 0.3,
  integrations: [
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],
});

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const schedule = require("node-schedule");
const ipParser = require("./middleware/ipParser");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 900,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: (req) => rateLimit.ipKeyGenerator(req.clientIp, 56),
});

const job = schedule.scheduleJob("55 23 * * *", () => {
  requestTracker.saveStats();
});

const app = express();

app.set("trust proxy", 1);

app.use(ipParser);
app.use(limiter);

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(
  morgan(
    ':remote-addr - [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms',
  ),
);

const token = require("./middleware/token");
const requestTracker = require("./middleware/requestTracker");
const waf = require("./middleware/waf");

const userRoutes = require("./routes/userRoutes");
const createUserRoutes = require("./routes/createUserRoutes");
const gameRoutes = require("./routes/gameRoutes");
const guessRoutes = require("./routes/guessRoutes");
const scoreboardRoutes = require("./routes/scoreboardRoutes");
const statsRoutes = require("./routes/statsRoutes");
const versusRoutes = require("./routes/versusRoutes");

app.use(waf.checkRequest);
app.use(requestTracker.trackRequests);

app.use("/api", createUserRoutes);
app.use("/api", scoreboardRoutes);
app.use("/api", gameRoutes);
app.use("/api", statsRoutes);
app.use("/api", versusRoutes);

app.use(token);
app.use(requestTracker.trackDAU);

app.use("/api", userRoutes);
app.use("/api", guessRoutes);

Sentry.setupExpressErrorHandler(app);

app.use(function onError(err, req, res, next) {
  res.status(500).json({ status: "error", message: "Internal server error" });
});

module.exports = app;
