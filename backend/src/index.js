import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import DBConnection from './db.js';
import cookieparser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

app.use(express.json());
app.use(cookieparser());


async function ConnectDB() {
    await DBConnection();
}
ConnectDB();

app.listen(process.env.PORT, ()=>{
    console.log(`Server listening on Port ${process.env.PORT}`);
});