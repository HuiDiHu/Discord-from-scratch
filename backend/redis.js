const Redis = require('ioredis')
const redisClient = new Redis(process.env.IS_DEV === 'true' ? "redis://localhost:6379" : process.env.REDIS_URL);
module.exports = redisClient;