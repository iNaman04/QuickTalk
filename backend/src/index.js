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
import { app,server } from './lib/socket.js';


const PORT = process.env.PORT;

// 🚨 Place CORS at the very top (before JSON or cookieparser)
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// 🚨 Also handle preflight requests


// 📌 Now apply parsers
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieparser());

// 📌 Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/test", (req, res) => res.send("CORS OK"));

// 📌 Start Server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log("Server is running on PORT " + PORT);
  });
});
