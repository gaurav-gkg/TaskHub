const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const {
  getUsers,
  updateUserStatus,
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  assignUsersToProject,
  createTask,
  getTasks,
  updateTask,
  toggleTaskActive,
  createBounty,
  getBounties,
  updateBounty,
  closeBounty,
  getSubmissions,
  updateSubmissionStatus,
  getBountySubmissions,
  updateBountySubmissionStatus,
  getExportData,
} = require("../controllers/adminController");

router.use(protect);
router.use(admin);

// Users
router.get("/users", getUsers);
router.put("/users/:id/status", updateUserStatus);

// Projects
router.post("/projects", createProject);
router.get("/projects", getProjects);
router.put("/projects/:id", updateProject);
router.delete("/projects/:id", deleteProject);
router.put("/projects/:id/assign-users", assignUsersToProject);

// Tasks
router.post("/projects/:projectId/tasks", createTask);
router.get("/projects/:projectId/tasks", getTasks);
router.put("/tasks/:taskId", updateTask);
router.put("/tasks/:taskId/toggle", toggleTaskActive);

// Bounties
router.post("/bounties", createBounty);
router.get("/bounties", getBounties);
router.put("/bounties/:id", updateBounty);
router.put("/bounties/:id/close", closeBounty);

// Submissions
router.get("/submissions", getSubmissions);
router.put("/submissions/:id", updateSubmissionStatus);

// Bounty Submissions
router.get("/bounty-submissions", getBountySubmissions);
router.put("/bounty-submissions/:id", updateBountySubmissionStatus);

// Export Data
router.get("/export-data", getExportData);

module.exports = router;
