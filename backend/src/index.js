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
import submitRouter from './routes/submitRoutes.js';

import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials : true,
    // optionsSuccessStatus: 200 // For legacy browser support
};
  
  app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieparser());
app.use('/problem',problemRouter);
app.use('/user',authRouter);
app.use('/submission',submitRouter);

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