const mongoose = require("mongoose");

const bountySubmissionSchema = new mongoose.Schema(
  {
    bountyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bounty",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    submissionLink: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["submitted", "approved", "rejected"],
      default: "submitted",
    },
    adminComment: {
      type: String,
    },
    reward: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate submissions
bountySubmissionSchema.index({ bountyId: 1, userId: 1 }, { unique: true });

const BountySubmission = mongoose.model(
  "BountySubmission",
  bountySubmissionSchema
);

module.exports = BountySubmission;
