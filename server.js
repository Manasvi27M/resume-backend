import connectDB from "./config/db.js";
import express from "express";
import userRoutes from "./routes/users/route.js";
import userDetailRoutes from "./routes/users/[id]/route.js"

const app = express();
app.use(express.json());
connectDB();
app.use("/api", userRoutes);
app.use("/api/user/:id", userDetailRoutes);
// Local development: listen on a port if not in production.
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
export default app;