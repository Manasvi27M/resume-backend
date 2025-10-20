import connectDB from "./config/db.js";
import express from "express";
import userRoutes from "./routes/users/route.js";
import userDetailRoutes from "./routes/users/[id]/route.js";
import resumeRoutes from "./routes/resume/route.js";
import resumeDetailRoutes from "./routes/resume/[id]/route.js";
import cors from "cors";

const app = express();
app.use(express.json());
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "x-user-id"],
};
// app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

connectDB();
app.use("/api", userRoutes);
app.use("/api/user/:id", userDetailRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/resume/:id", resumeDetailRoutes);

// Local development: listen on a port if not in production.
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
export default app;
