import dotenv from 'dotenv';
dotenv.config();  



console.log("DEBUG PORT =", process.env.PORT);
console.log("DEBUG MONGO =", process.env.MONGODB_URI);

import express from 'express';

import authRoutes from './routes/auth_route.js';
import messageRoutes from './routes/message_route.js';
import { connectDB } from './lib/db.js';
import cookieparser from 'cookie-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT;  

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on PORT " + PORT);
  });
});
