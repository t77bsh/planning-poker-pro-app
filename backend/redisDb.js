// Redis
const RedisStore = require("connect-redis").default;
const { createClient } = require("redis");

// Initialise client
let redisClient = createClient({
  // username: "default",
  password:
    process.env.NODE_ENV === "production"
      ? process.env.REDIS_PASS
      : process.env.REDIS_LOCAL_PASS,
  socket: {
    host:
      process.env.NODE_ENV === "production"
        ? process.env.REDIS_HOST
        : process.env.REDIS_LOCAL_HOST,
    port:
      process.env.NODE_ENV === "production"
        ? process.env.REDIS_PORT
        : process.env.REDIS_LOCAL_PORT,
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
