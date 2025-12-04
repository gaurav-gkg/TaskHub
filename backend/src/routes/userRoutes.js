const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getAssignedProjects,
  getProjectTasks,
  submitTask,
  getUserSubmissions,
  getActiveBounties,
  submitBounty,
  getUserBountySubmissions,
  getAllBounties,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");

router.use(protect);

// Profile
router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);

// Projects and Tasks
router.get("/projects", getAssignedProjects);
router.get("/projects/:id/tasks", getProjectTasks);
router.post("/tasks/:taskId/submit", submitTask);
router.get("/submissions", getUserSubmissions);

// Bounties
router.get("/bounties/all", getAllBounties); // Debug endpoint
router.get("/bounties/active", getActiveBounties);
router.post("/bounties/:bountyId/submit", submitBounty);
router.get("/bounty-submissions", getUserBountySubmissions);

module.exports = router;
