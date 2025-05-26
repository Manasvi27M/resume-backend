import connectDB from "./config/db.js";
import express from "express";
import userRoutes from "./routes/users/route.js";
import userDetailRoutes from "./routes/users/[id]/route.js"


const app = express();
app.use(express.json());
connectDB();
app.use("/api", userRoutes);
app.use("/api/user/:id", userDetailRoutes);
export default app;