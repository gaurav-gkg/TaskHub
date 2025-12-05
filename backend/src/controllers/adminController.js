const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");
const Bounty = require("../models/Bounty");
const TaskSubmission = require("../models/TaskSubmission");
const BountySubmission = require("../models/BountySubmission");
const { updateBountyStatuses } = require("../utils/bountyUtils");
const mongoose = require("mongoose");

// --- User Management ---

// @desc    Get all users (with optional status filter)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  const status = req.query.status;
  const filter = status ? { status } : {};
  const users = await User.find(filter).select("-password");
  res.json(users);
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    console.log(`Updating user ${req.params.id} status to ${status}`);

    const user = await User.findById(req.params.id);

    if (user) {
      user.status = status;
      const updatedUser = await user.save();
      console.log("User updated:", updatedUser);
      res.json(updatedUser);
    } else {
      console.log("User not found");
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: error.message });
  }
};

// --- Project Management ---

// @desc    Create a project
// @route   POST /api/admin/projects
// @access  Private/Admin
const createProject = async (req, res) => {
  const { name, description, imageUrl } = req.body;

  const project = new Project({
    name,
    description,
    imageUrl,
    createdBy: req.user._id,
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
};

// @desc    Get all projects
// @route   GET /api/admin/projects
// @access  Private/Admin
const getProjects = async (req, res) => {
  const projects = await Project.find({});
  res.json(projects);
};

// @desc    Update a project
// @route   PUT /api/admin/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
  const { name, description, imageUrl } = req.body;
  const project = await Project.findById(req.params.id);

  if (project) {
    project.name = name || project.name;
    project.description = description || project.description;
    project.imageUrl = imageUrl || project.imageUrl;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } else {
    res.status(404).json({ message: "Project not found" });
  }
};

// @desc    Delete a project
// @route   DELETE /api/admin/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    await project.deleteOne();
    res.json({ message: "Project removed" });
  } else {
    res.status(404).json({ message: "Project not found" });
  }
};

// @desc    Assign users to a project
// @route   PUT /api/admin/projects/:id/assign-users
// @access  Private/Admin
const assignUsersToProject = async (req, res) => {
  const { userIds } = req.body;
  const project = await Project.findById(req.params.id);

  if (project) {
    project.assignedUsers = userIds;
    const updatedProject = await project.save();
    res.json(updatedProject);
  } else {
    res.status(404).json({ message: "Project not found" });
  }
};

// --- Task Management ---

// @desc    Create a task
// @route   POST /api/admin/projects/:projectId/tasks
// @access  Private/Admin
const createTask = async (req, res) => {
  try {
    const { title, description, type, deadline, requiresScreenshots } =
      req.body;
    const projectId = req.params.projectId;

    const task = new Task({
      projectId,
      title,
      description,
      type,
      deadline,
      requiresScreenshots: requiresScreenshots === true, // Explicit boolean conversion
    });

    const createdTask = await task.save();
    console.log("Task created:", {
      id: createdTask._id,
      requiresScreenshots: createdTask.requiresScreenshots,
    });
    res.status(201).json(createdTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get tasks for a project
// @route   GET /api/admin/projects/:projectId/tasks
// @access  Private/Admin
const getTasks = async (req, res) => {
  const tasks = await Task.find({ projectId: req.params.projectId });
  res.json(tasks);
};

// @desc    Update a task
// @route   PUT /api/admin/tasks/:taskId
// @access  Private/Admin
const updateTask = async (req, res) => {
  try {
    const { title, description, type, deadline, requiresScreenshots } =
      req.body;
    const task = await Task.findById(req.params.taskId);

    if (task) {
      task.title = title || task.title;
      task.description = description || task.description;
      task.type = type || task.type;

      // Explicitly handle deadline (can be null/empty)
      if (deadline !== undefined) {
        task.deadline = deadline || null;
      }

      // Explicitly handle requiresScreenshots boolean
      if (requiresScreenshots !== undefined) {
        task.requiresScreenshots = Boolean(requiresScreenshots);
      }

      const updatedTask = await task.save();
      console.log("Task updated:", {
        id: updatedTask._id,
        requiresScreenshots: updatedTask.requiresScreenshots,
      });
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle task active status
// @route   PUT /api/admin/tasks/:taskId/toggle
// @access  Private/Admin
const toggleTaskActive = async (req, res) => {
  const task = await Task.findById(req.params.taskId);

  if (task) {
    task.isActive = !task.isActive;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404).json({ message: "Task not found" });
  }
};

// --- Bounty Management ---

// @desc    Create a bounty
// @route   POST /api/admin/bounties
// @access  Private/Admin
const createBounty = async (req, res) => {
  try {
    const { title, description, reward, durationHours, durationMinutes } =
      req.body;

    const bounty = new Bounty({
      title,
      description,
      reward,
      durationHours: parseInt(durationHours) || 0,
      durationMinutes: parseInt(durationMinutes) || 0,
      status: "active",
      createdBy: req.user._id,
    });

    const createdBounty = await bounty.save();
    res.status(201).json(createdBounty);
  } catch (error) {
    console.error("Error creating bounty:", error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all bounties
// @route   GET /api/admin/bounties
// @access  Private/Admin
const getBounties = async (req, res) => {
  // Update bounty statuses before fetching
  await updateBountyStatuses();

  const bounties = await Bounty.find({}).sort({ createdAt: -1 });

  // Get submission counts for each bounty
  const bountiesWithCounts = await Promise.all(
    bounties.map(async (bounty) => {
      const submissionCount = await BountySubmission.countDocuments({
        bountyId: bounty._id,
      });
      const bountyObj = bounty.toObject();

      // Calculate startTime and endTime with safety checks
      try {
        const durationHours = bountyObj.durationHours || 0;
        const durationMinutes = bountyObj.durationMinutes || 0;
        const totalMinutes = durationHours * 60 + durationMinutes;
        bountyObj.startTime = bountyObj.createdAt;
        bountyObj.endTime = new Date(
          bountyObj.createdAt.getTime() + totalMinutes * 60 * 1000
        );
      } catch (error) {
        console.error(
          "Error calculating bounty times for bounty:",
          bountyObj._id,
          error
        );
        bountyObj.startTime = bountyObj.createdAt;
        bountyObj.endTime = bountyObj.createdAt;
      }

      return {
        ...bountyObj,
        submissionCount,
      };
    })
  );

  console.log("Returning bounties with counts:", bountiesWithCounts.length);
  res.json(bountiesWithCounts);
};

// @desc    Update a bounty
// @route   PUT /api/admin/bounties/:id
// @access  Private/Admin
const updateBounty = async (req, res) => {
  try {
    const { title, description, reward, durationHours, durationMinutes } =
      req.body;
    const bounty = await Bounty.findById(req.params.id);

    if (bounty) {
      bounty.title = title || bounty.title;
      bounty.description = description || bounty.description;
      bounty.reward = reward || bounty.reward;

      // If duration is updated, the pre-save hook will recalculate endTime
      if (durationHours !== undefined) {
        bounty.durationHours = parseInt(durationHours);
      }
      if (durationMinutes !== undefined) {
        bounty.durationMinutes = parseInt(durationMinutes);
      }

      const updatedBounty = await bounty.save();
      res.json(updatedBounty);
    } else {
      res.status(404).json({ message: "Bounty not found" });
    }
  } catch (error) {
    console.error("Error updating bounty:", error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Close a bounty early
// @route   PUT /api/admin/bounties/:id/close
// @access  Private/Admin
const closeBounty = async (req, res) => {
  const bounty = await Bounty.findById(req.params.id);

  if (bounty) {
    bounty.status = "closed";
    const updatedBounty = await bounty.save();
    res.json(updatedBounty);
  } else {
    res.status(404).json({ message: "Bounty not found" });
  }
};

// --- Submission Management ---

// @desc    Get all submissions
// @route   GET /api/admin/submissions
// @access  Private/Admin
const getSubmissions = async (req, res) => {
  const { status, projectId, userId } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (projectId) filter.projectId = projectId;
  if (userId) filter.userId = userId;

  const submissions = await TaskSubmission.find(filter)
    .populate("userId", "name telegramUsername")
    .populate("projectId", "name")
    .populate("taskId", "title");
  res.json(submissions);
};

// @desc    Approve/Reject submission
// @route   PUT /api/admin/submissions/:id
// @access  Private/Admin
const updateSubmissionStatus = async (req, res) => {
  const { status, adminComment } = req.body;
  const submission = await TaskSubmission.findById(req.params.id);

  if (submission) {
    submission.status = status;
    if (adminComment) submission.adminComment = adminComment;
    const updatedSubmission = await submission.save();
    res.json(updatedSubmission);
  } else {
    res.status(404).json({ message: "Submission not found" });
  }
};

// --- Bounty Submission Management ---

// @desc    Get all bounty submissions
// @route   GET /api/admin/bounty-submissions
// @access  Private/Admin
const getBountySubmissions = async (req, res) => {
  try {
    const { status, bountyId, userId } = req.query;
    console.log("=== getBountySubmissions called ===");
    console.log("Query params:", { status, bountyId, userId });

    const filter = {};
    if (status) filter.status = status;
    if (bountyId) filter.bountyId = bountyId;
    if (userId) filter.userId = userId;

    console.log("Filter object:", filter);

    const submissions = await BountySubmission.find(filter)
      .populate("userId", "name telegramUsername twitterUsername")
      .populate(
        "bountyId",
        "title reward durationHours durationMinutes status createdAt"
      )
      .sort({ createdAt: -1 });

    console.log(`Found ${submissions.length} submissions`);
    if (submissions.length > 0) {
      console.log("First submission:", {
        id: submissions[0]._id,
        userId: submissions[0].userId?._id,
        bountyId: submissions[0].bountyId?._id,
      });
    }

    // Map submissions to include calculated fields instead of virtuals
    const submissionsWithCalculatedFields = submissions.map((sub) => {
      const subObj = sub.toObject();
      // Only calculate times if bountyId exists and has required fields
      if (subObj.bountyId && subObj.bountyId.createdAt) {
        try {
          const durationHours = subObj.bountyId.durationHours || 0;
          const durationMinutes = subObj.bountyId.durationMinutes || 0;
          const totalMinutes = durationHours * 60 + durationMinutes;

          // Make sure createdAt is a valid date
          const startTime = new Date(subObj.bountyId.createdAt);
          if (!isNaN(startTime.getTime())) {
            subObj.bountyId.startTime = startTime;
            subObj.bountyId.endTime = new Date(
              startTime.getTime() + totalMinutes * 60 * 1000
            );
          }
        } catch (error) {
          console.error(
            "Error calculating bounty times for submission:",
            subObj._id,
            error
          );
        }
      }
      return subObj;
    });

    console.log(
      "Returning submissions:",
      submissionsWithCalculatedFields.length
    );
    res.json(submissionsWithCalculatedFields);
  } catch (error) {
    console.error("Error fetching bounty submissions:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update bounty submission status
// @route   PUT /api/admin/bounty-submissions/:id
// @access  Private/Admin
const updateBountySubmissionStatus = async (req, res) => {
  const { status, adminComment, reward } = req.body;
  const submission = await BountySubmission.findById(req.params.id);

  if (submission) {
    submission.status = status;
    if (adminComment) submission.adminComment = adminComment;
    if (reward) submission.reward = reward;
    const updatedSubmission = await submission.save();
    res.json(updatedSubmission);
  } else {
    res.status(404).json({ message: "Bounty submission not found" });
  }
};

// @desc    Get export data with filters
// @route   GET /api/admin/export-data
// @access  Private/Admin
const getExportData = async (req, res) => {
  try {
    const { userId, projectId, startDate, endDate } = req.query;

    // Build filter
    const filter = {};
    if (userId) filter.userId = userId;
    if (projectId) filter.projectId = projectId;

    // Date filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    console.log("Export data filter:", filter);

    // Fetch submissions with populated data
    const submissions = await TaskSubmission.find(filter)
      .populate("userId", "name email telegramUsername twitterUsername")
      .populate("projectId", "name")
      .populate("taskId", "title type deadline")
      .sort({ createdAt: -1 });

    console.log(`Found ${submissions.length} submissions for export`);

    // Format data for export
    const exportData = submissions.map((sub) => ({
      userName: sub.userId?.name || "Unknown",
      email: sub.userId?.email || "N/A",
      telegram: sub.userId?.telegramUsername || "N/A",
      twitter: sub.userId?.twitterUsername || "N/A",
      projectName: sub.projectId?.name || "Unknown",
      taskTitle: sub.taskId?.title || "Unknown",
      taskType: sub.taskId?.type || "N/A",
      taskDeadline: sub.taskId?.deadline
        ? new Date(sub.taskId.deadline).toLocaleString()
        : null,
      submissionLink: sub.tweetLink,
      status: sub.status,
      submittedAt: new Date(sub.createdAt).toLocaleString(),
      adminComment: sub.adminComment || "",
    }));

    res.json(exportData);
  } catch (error) {
    console.error("Error fetching export data:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
