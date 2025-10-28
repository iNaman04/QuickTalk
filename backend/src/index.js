import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth_route.js';
import { connectDB } from './lib/db.js';
import cookieparser from 'cookie-parser';
dotenv.config();
const app = express();
const PORT = process.env.PORT;  

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log("Server is running on PORT " + PORT);
  connectDB();
});