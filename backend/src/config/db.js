// import dotenv from "dotenv";
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.resolve(__dirname, '../.env') });


import mongoose from "mongoose";

 export default async function DBConnection() {
  try {
    console.log("DB Connection Starting");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connection established");
  } catch (error) {
    console.log("DB Connection error " + error);
  }
};
