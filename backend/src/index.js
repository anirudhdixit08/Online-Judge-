// import './config.js'; // This loads all .env variables
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import DBConnection from './config/db.js';
import cookieparser from 'cookie-parser';
import  RedisConnection,{redisClient}  from './config/redis.js';
import authRouter from './routes/userAuth.js';
import problemRouter from './routes/userProblemRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

app.use(express.json());
app.use(cookieparser());
app.use('/user/problem',problemRouter);
app.use('/user',authRouter);

async function InitializeConnection() {
    // console.log("ConnectDB called");
    // await DBConnection();

    // console.log("ConnectRedis called");
    // await RedisConnection();

    console.log('Starting Connection!');

    await Promise.all([DBConnection(),RedisConnection(redisClient)]);
    console.log("Connection to Mongo and Redis Established!");

    app.listen(process.env.PORT, ()=>{
        console.log(`Server listening on Port ${process.env.PORT}`);
    });
    
}

InitializeConnection();



app.get('/',(req,res)=>{
    res.send("Hello from Anirudh");
})