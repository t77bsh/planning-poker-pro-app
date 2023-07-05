// Redis
const RedisStore = require("connect-redis").default;
const { createClient } = require("redis");

// Initialise client
let redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});
redisClient.connect().catch(console.error);

// Initialise store
let redisStore = new RedisStore({
  client: redisClient,
});

module.exports = { redisClient, redisStore };
