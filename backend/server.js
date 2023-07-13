//Express config
const express = require("express");
const app = express();

// Trust proxy
app.set("trust proxy", true);

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
  resave: false,
  saveUninitialized: true,
  store: redisStore,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 * 3, // 3 days
    sameSite: process.env.NODE_ENV === "production" ? "none" : true,
    // domain: ".planningpokerpro.com", // remove this line in development
  },
});

const corsOptions = {
  origin: [
    `https://${process.env.CLIENT_DOMAIN}`,
    `https://www.${process.env.CLIENT_DOMAIN}`,
    `https://server.${process.env.CLIENT_DOMAIN}`,
    `https://www.server.${process.env.CLIENT_DOMAIN}`,
    "http://localhost:3000",
    "localhost:3000",
  ],
  credentials:true
};

// Socket.io server initialisation
const io = new Server(server, {
  cors: corsOptions,
  cookie: true,
});
io.engine.use(sessionMiddleware);

const {
  roomHandlers,
  scoresHandlers,
  timerHandlers,
} = require("./socketEventHandlers");

const onConnection = (socket) => {
  const req = socket.request;
  const userId = req.session.id;
  console.log("socket session ID:", userId);
  roomHandlers(io, socket, userId, req);
  scoresHandlers(io, socket, userId);
  timerHandlers(io, socket);
};
console.log("Starting the socket io connection...");

io.on("connection", onConnection);

// Middlewares
app.use(sessionMiddleware);
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send(
    "<html><head>Server Response</head><body><h1>Server is running for Planning Poker Pro.</h1></body></html>"
  );
});

app.get("/cookie", (req, res) => {
  //Get cookie
  console.log(req.headers.cookie)

  res.setHeader("set-cookie", req.headers.cookie);
  res.send("Cookie set")
});

// Server address
const PORT = parseInt(process.env.PORT) || 8080;

server.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});
