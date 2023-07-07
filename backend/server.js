//Express config
const express = require("express");
const app = express();

// Socket.io config
const { Server } = require("socket.io");
const session = require("express-session");

// Server settings
require("dotenv").config();
const cors = require("cors");
const http = require("http");
const { redisStore } = require("./redisDb");
const server = http.createServer(app);
const sessionMiddleware = session({
  secret: process.env.SESSION_MDLWRE_SECRET,
  resave: true,
  saveUninitialized: true,
  credentials: true,
  store: redisStore,
  cookie: {
    secure: true,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 * 3, // 3 days
    sameSite: true,
    secret: process.env.SESSION_MDLWRE_SECRET,
  },
});

// Socket.io server initialisation
const io = new Server(server, {
  allowRequest: (req, callback) => {
    console.log("Calling allow request");
    // with HTTP long-polling, we have access to the HTTP response here, but this is not
    // the case with WebSocket, so we provide a dummy response object
    const fakeRes = {
      getHeader() {
        return [];
      },
      setHeader(key, values) {
        req.cookieHolder = values[0];
      },
      writeHead() {},
    };
    sessionMiddleware(req, fakeRes, () => {
      if (req.session) {
        // trigger the setHeader() above
        fakeRes.writeHead();
        // manually save the session
        req.session.save();
      }
      callback(null, true);
    });
  },
});

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_DOMAIN,
    credentials: true,
    methods: ["GET", "POST"],
  })
);
app.use(sessionMiddleware);
io.engine.on("initial_headers", (headers, req) => {
  if (req.cookieHolder) {
    headers["set-cookie"] = req.cookieHolder;
    delete req.cookieHolder;
  }
});

// HTTP Request Handler
app.get("/api", (req, res) => {
  const displayName = req.session.displayName;
  const roomCode = req.session.roomCode;
  res.send({ displayName: displayName, roomCode: roomCode });
});

const {
  roomHandlers,
  scoresHandlers,
  timerHandlers,
} = require("./socketEventHandlers");

const onConnection = (socket) => {
  const userId = socket.request.session.id;
  console.log("socket session ID:", userId);
  roomHandlers(io, socket, userId);
  scoresHandlers(io, socket, userId);
  timerHandlers(io, socket);
};

io.on("connection", onConnection);

// Server address
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log("Server listening on port " + port);
});
