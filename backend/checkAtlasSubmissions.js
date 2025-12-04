const mongoose = require("mongoose");
require("dotenv").config();

const BountySubmission = require("./src/models/BountySubmission");
const Bounty = require("./src/models/Bounty");
const User = require("./src/models/User");

const MONGO_URI = process.env.MONGODB_URI;

console.log("Connecting to MongoDB...");

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB Atlas");

    // Check bounties
    const bounties = await Bounty.find({});
    console.log("\n=== BOUNTIES ===");
    console.log("Total bounties:", bounties.length);
    bounties.forEach((b, i) => {
      console.log(`${i + 1}. ${b.title} - Status: ${b.status} - ID: ${b._id}`);
    });

    // Check submissions
    const submissions = await BountySubmission.find({})
      .populate("userId", "name email")
      .populate("bountyId", "title");

    console.log("\n=== BOUNTY SUBMISSIONS ===");
    console.log("Total submissions:", submissions.length);

    submissions.forEach((sub, index) => {
      console.log(`\n--- Submission ${index + 1} ---`);
      console.log("ID:", sub._id.toString());
      console.log(
        "User:",
        sub.userId ? `${sub.userId.name} (${sub.userId.email})` : "NULL"
      );
      console.log("Bounty:", sub.bountyId ? sub.bountyId.title : "NULL");
      console.log("Status:", sub.status);
      console.log("Link:", sub.submissionLink);
      console.log("Description:", sub.description);
      console.log("Created:", sub.createdAt);
    });

    process.exit(0);
  })
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
