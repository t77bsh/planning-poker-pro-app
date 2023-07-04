// Redis
const RedisStore = require("connect-redis").default;
const { createClient } = require("redis");

// Initialise client
let redisClient = createClient({ url: "redis://localhost:6379" });
redisClient.connect().catch(console.error);

// Initialise store
let redisStore = new RedisStore({
  client: redisClient,
});

module.exports = { redisClient, redisStore };