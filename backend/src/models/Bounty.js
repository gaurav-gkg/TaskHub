const mongoose = require("mongoose");

const bountySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    reward: {
      type: String,
      required: true,
    },
    durationHours: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 0,
      max: 59,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field to calculate end time
bountySchema.virtual("endTime").get(function () {
  const totalMinutes = this.durationHours * 60 + this.durationMinutes;
  return new Date(this.createdAt.getTime() + totalMinutes * 60 * 1000);
});

// Virtual field for start time (same as createdAt)
bountySchema.virtual("startTime").get(function () {
  return this.createdAt;
});

// Method to check if bounty is expired
bountySchema.methods.isExpired = function () {
  const now = new Date();
  const endTime = this.endTime;
  return now >= endTime;
};

// Make sure virtuals are included when converting to JSON
bountySchema.set("toJSON", { virtuals: true });
bountySchema.set("toObject", { virtuals: true });

const Bounty = mongoose.model("Bounty", bountySchema);

module.exports = Bounty;
