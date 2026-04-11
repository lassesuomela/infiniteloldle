const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const db = require("./configs/db");
const setupVersusSocket = require("./versus/socket");

const port = process.env.DOCKER_APP_PORT || 8081;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
  },
  path: "/socket.io",
});

setupVersusSocket(io);

// start the server and bind to all interfaces
server.listen(port, "0.0.0.0", () => {
    console.log(`Listening at http://localhost:${port}`);
});

// handle ctrl + c
process.on("SIGINT", function() {
    console.log("Caught interrupt signal");
    db.end(function (err) {
        // all connections in the pool have ended
        console.log("Closed all pool connections");
        process.exit();
    });
});
