// Redis
const RedisStore = require("connect-redis").default;
const { createClient } = require("redis");

// Initialise client
let redisClient = createClient({
  // username: "default",
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

redisClient
  .connect()
  .then(() => console.log("Redis connected successfully."))
  .catch((err) => {
    console.log("Redis connection failed. Error:", err.message);
    console.error;
  });


// Initialise store
let redisStore = new RedisStore({
  client: redisClient,
});

module.exports = { redisClient, redisStore };
