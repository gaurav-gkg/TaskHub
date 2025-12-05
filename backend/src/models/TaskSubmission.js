const mongoose = require("mongoose");

const taskSubmissionSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tweetLink: {
      type: String,
      required: true,
    },
    screenshots: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["submitted", "approved", "rejected"],
      default: "submitted",
    },
    adminComment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const TaskSubmission = mongoose.model("TaskSubmission", taskSubmissionSchema);

module.exports = TaskSubmission;
