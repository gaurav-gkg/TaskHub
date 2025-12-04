const mongoose = require("mongoose");
const BountySubmission = require("./src/models/BountySubmission");
const Bounty = require("./src/models/Bounty");
const User = require("./src/models/User");

mongoose
  .connect("mongodb://localhost:27017/bounty-platform")
  .then(async () => {
    console.log("Connected to MongoDB");

    const submissions = await BountySubmission.find({})
      .populate("userId", "name email telegramUsername twitterUsername")
      .populate(
        "bountyId",
        "title reward durationHours durationMinutes status createdAt"
      );

    console.log("\n=== BOUNTY SUBMISSIONS ===");
    console.log("Total submissions:", submissions.length);

    submissions.forEach((sub, index) => {
      console.log(`\n--- Submission ${index + 1} ---`);
      console.log("ID:", sub._id.toString());
      console.log("User:", sub.userId ? sub.userId.name : "NULL");
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
