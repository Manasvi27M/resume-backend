import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    // User association
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Resume metadata
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    // Basic details
    basicDetails: {
      name: { type: String, trim: true, maxlength: 100 },
      phone: { type: String, trim: true, maxlength: 20 },
      city: { type: String, trim: true, maxlength: 50 },
      state: { type: String, trim: true, maxlength: 50 },
      gmail: { type: String, trim: true, lowercase: true, maxlength: 100 },
      github: { type: String, trim: true, maxlength: 200 },
      linkedIn: { type: String, trim: true, maxlength: 200 },
    },

    // Education
    education: [
      {
        name: { type: String, trim: true, maxlength: 200 }, // Institution name
        course: { type: String, trim: true, maxlength: 200 }, // Degree/Course
        score: { type: String, trim: true, maxlength: 50 }, // GPA/Score
        duration: { type: String, trim: true, maxlength: 50 }, // Time period
      },
    ],

    // Technical Experience
    technicalExperience: [
      {
        companyName: { type: String, trim: true, maxlength: 200 },
        role: { type: String, trim: true, maxlength: 200 },
        duration: { type: String, trim: true, maxlength: 50 },
        description: { type: String, trim: true, maxlength: 2000 },
      },
    ],

    // Skills
    skills: [
      {
        type: String,
        trim: true,
        maxlength: 50,
      },
    ],

    // Projects
    projects: [
      {
        name: { type: String, trim: true, maxlength: 200 },
        techstack: { type: String, trim: true, maxlength: 500 },
        gitlink: { type: String, trim: true, maxlength: 300 },
        year: { type: String, trim: true, maxlength: 20 },
        description: { type: String, trim: true, maxlength: 2000 },
      },
    ],

    // Certificates
    certificates: [
      {
        title: { type: String, trim: true, maxlength: 200 },
        tag: { type: String, trim: true, maxlength: 200 }, // Issuer/Organization
      },
    ],

    // Achievements
    achievements: [
      {
        type: String,
        trim: true,
        maxlength: 500,
      },
    ],

    // Section order for customization
    sectionsOrder: [
      {
        type: String,
        enum: [
          "basic",
          "education",
          "experience",
          "skills",
          "projects",
          "certificates",
          "achievements",
        ],
      },
    ],

    // Metadata
    isActive: {
      type: Boolean,
      default: true,
    },

    lastModified: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better performance
resumeSchema.index({ userId: 1, createdAt: -1 });
resumeSchema.index({ userId: 1, title: 1 });
resumeSchema.index({ userId: 1, isActive: 1 });

// Virtual for resume summary
resumeSchema.virtual("summary").get(function () {
  return {
    id: this._id,
    title: this.title,
    name: this.basicDetails?.name || "Untitled Resume",
    lastModified: this.lastModified,
    createdAt: this.createdAt,
  };
});

// Pre-save middleware to update lastModified
resumeSchema.pre("save", function (next) {
  this.lastModified = new Date();
  next();
});

// Static method to find user's resumes
resumeSchema.statics.findByUserId = function (userId, options = {}) {
  const query = { userId, isActive: true };
  return this.find(query)
    .sort({ lastModified: -1 })
    .limit(options.limit || 50)
    .select(options.select || "");
};

// Instance method to soft delete
resumeSchema.methods.softDelete = function () {
  this.isActive = false;
  return this.save();
};

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
