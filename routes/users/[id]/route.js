import express from "express";
import Users from "../../../models/users.js";

const router = express.Router({ mergeParams: true });

// ─────────────────────────────────────────────
// GET: Fetch a specific user by ID
router.get("/", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Users.findById(id).select("-password_hash"); // Exclude password

    if (!user) return res.status(404).json({ message: "User not found." });

    res.status(200).json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ─────────────────────────────────────────────
// PATCH: Update user details by ID
router.patch("/", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, preferences } = req.body;

  try {
    const updatedUser = await Users.findByIdAndUpdate(
      id,
      { name, email, phone, preferences },
      { new: true, runValidators: true }
    ).select("-password_hash"); // Exclude password

    if (!updatedUser)
      return res.status(404).json({ message: "User not found." });

    res
      .status(200)
      .json({ message: "User updated successfully.", user: updatedUser });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
