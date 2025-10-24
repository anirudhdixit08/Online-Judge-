import { createClient } from 'redis';

export const redisClient = createClient({
    
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Connection Established'));

const RedisConnection = async (client) => {
    try {
        console.log("Redis Connection Starting");
        await client.connect();
    } catch (error) {
        console.log("Redis Connection error " + error);
    }
    return client;
};

export default RedisConnection;

