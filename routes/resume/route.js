import express from "express";
import Resume from "../../models/resume.js";

const router = express.Router();

// ─────────────────────────────────────────────
// GET: Get all resumes for the authenticated user
router.get("/", async (req, res) => {
  try {
    // Extract user ID from request headers
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { limit = 50, page = 1 } = req.query;
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const skip = (pageNum - 1) * limitNum;

    // Get user's resumes with pagination
    const resumes = await Resume.find({
      userId,
      isActive: true,
    })
      .sort({ lastModified: -1 })
      .skip(skip)
      .limit(limitNum)
      .select("title basicDetails.name lastModified createdAt");

    // Get total count for pagination
    const total = await Resume.countDocuments({
      userId,
      isActive: true,
    });

    res.status(200).json({
      resumes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({ error: "Failed to fetch resumes" });
  }
});

// ─────────────────────────────────────────────
// POST: Create a new resume
router.post("/", async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const body = req.body;

    // Validate required fields
    if (!body.title) {
      return res.status(400).json({ error: "Resume title is required" });
    }

    // Set default sections order if not provided
    const defaultSectionsOrder = [
      "basic",
      "education",
      "technicalExperience",
      "skills",
      "projects",
      "certificates",
      "achievements",
    ];

    const resumeData = {
      userId,
      title: body.title,
      basicDetails: body.basicDetails || {},
      education: body.education || [],
      technicalExperience: body.technicalExperience || [],
      skills: body.skills || [],
      projects: body.projects || [],
      certificates: body.certificates || [],
      achievements: body.achievements || [],
      sectionsOrder: body.sectionsOrder || defaultSectionsOrder,
    };

    const resume = new Resume(resumeData);
    await resume.save();

    res.status(201).json(resume);
  } catch (error) {
    console.error("Error creating resume:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation error",
        details: error.errors,
      });
    }

    res.status(500).json({ error: "Failed to create resume" });
  }
});

export default router;
