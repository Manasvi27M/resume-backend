import express from "express";
import mongoose from "mongoose";
import Resume from "../../../models/resume.js";

const router = express.Router({ mergeParams: true });

// ─────────────────────────────────────────────
// GET: Get a specific resume by ID
router.get("/", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid resume ID" });
    }

    const resume = await Resume.findOne({
      _id: id,
      userId,
      isActive: true,
    });

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    res.status(200).json(resume);
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({ error: "Failed to fetch resume" });
  }
});

// ─────────────────────────────────────────────
// PATCH: Update a specific resume
router.patch("/", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid resume ID" });
    }

    const body = req.body;

    // Remove fields that shouldn't be updated directly
    delete body._id;
    delete body.userId;
    delete body.createdAt;
    delete body.updatedAt;

    const resume = await Resume.findOneAndUpdate(
      {
        _id: id,
        userId,
        isActive: true,
      },
      {
        ...body,
        lastModified: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    res.status(200).json(resume);
  } catch (error) {
    console.error("Error updating resume:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation error",
        details: error.errors,
      });
    }

    res.status(500).json({ error: "Failed to update resume" });
  }
});

// ─────────────────────────────────────────────
// DELETE: Delete a specific resume (soft delete)
router.delete("/", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid resume ID" });
    }

    const resume = await Resume.findOne({
      _id: id,
      userId,
      isActive: true,
    });

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    // Soft delete
    await resume.softDelete();

    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Error deleting resume:", error);
    res.status(500).json({ error: "Failed to delete resume" });
  }
});

export default router;
