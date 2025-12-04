const Project = require("../models/Project");
const Task = require("../models/Task");
const TaskSubmission = require("../models/TaskSubmission");
const Bounty = require("../models/Bounty");
const BountySubmission = require("../models/BountySubmission");
const User = require("../models/User");
const { updateBountyStatuses } = require("../utils/bountyUtils");

// @desc    Get assigned projects
// @route   GET /api/user/projects
// @access  Private
const getAssignedProjects = async (req, res) => {
  const projects = await Project.find({ assignedUsers: req.user._id });
  res.json(projects);
};

// @desc    Get tasks for a project
// @route   GET /api/user/projects/:id/tasks
// @access  Private
const getProjectTasks = async (req, res) => {
  // Ensure user is assigned to this project
  const project = await Project.findOne({
    _id: req.params.id,
    assignedUsers: req.user._id,
  });

  if (!project) {
    return res
      .status(404)
      .json({ message: "Project not found or not assigned" });
  }

  const tasks = await Task.find({ projectId: req.params.id, isActive: true });

  // Also fetch user's submissions for these tasks to show status
  const submissions = await TaskSubmission.find({
    projectId: req.params.id,
    userId: req.user._id,
  });

  const tasksWithStatus = tasks.map((task) => {
    const submission = submissions.find(
      (s) => s.taskId.toString() === task._id.toString()
    );
    return {
      ...task.toObject(),
      submissionStatus: submission ? submission.status : "none",
      submission: submission || null,
    };
  });

  res.json(tasksWithStatus);
};

// @desc    Submit a task
// @route   POST /api/user/tasks/:taskId/submit
// @access  Private
const submitTask = async (req, res) => {
  const { tweetLink } = req.body;
  const taskId = req.params.taskId;

  const task = await Task.findById(taskId);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // Check if already submitted
  const existingSubmission = await TaskSubmission.findOne({
    taskId,
    userId: req.user._id,
  });

  if (existingSubmission) {
    return res.status(400).json({ message: "Task already submitted" });
  }

  const submission = new TaskSubmission({
    taskId,
    projectId: task.projectId,
    userId: req.user._id,
    tweetLink,
  });

  const createdSubmission = await submission.save();
  res.status(201).json(createdSubmission);
};

// @desc    Get user submissions
// @route   GET /api/user/submissions
// @access  Private
const getUserSubmissions = async (req, res) => {
  const submissions = await TaskSubmission.find({ userId: req.user._id })
    .populate("projectId", "name")
    .populate("taskId", "title");
  res.json(submissions);
};

// @desc    Get active bounties
// @route   GET /api/user/bounties/active
// @access  Private
const getActiveBounties = async (req, res) => {
  try {
    // Update bounty statuses first
    await updateBountyStatuses();

    const now = new Date();
    console.log("Current time (UTC):", now.toISOString());

    const bounties = await Bounty.find({
      status: "active",
    }).sort({ createdAt: -1 });

    console.log(`Found ${bounties.length} active bounties`);

    // Check if user has already submitted for each bounty
    const bountiesWithStatus = await Promise.all(
      bounties.map(async (bounty) => {
        const submission = await BountySubmission.findOne({
          bountyId: bounty._id,
          userId: req.user._id,
        });

        const bountyObj = bounty.toObject();
        // Calculate startTime and endTime
        const totalMinutes =
          bountyObj.durationHours * 60 + bountyObj.durationMinutes;
        bountyObj.startTime = bountyObj.createdAt;
        bountyObj.endTime = new Date(
          bountyObj.createdAt.getTime() + totalMinutes * 60 * 1000
        );

        console.log(
          `Bounty: ${bountyObj.title}, Status: ${bountyObj.status}, Start: ${bountyObj.startTime}, End: ${bountyObj.endTime}`
        );

        return {
          ...bountyObj,
          hasSubmitted: !!submission,
          userSubmission: submission || null,
        };
      })
    );

    res.json(bountiesWithStatus);
  } catch (error) {
    console.error("Error fetching active bounties:", error);
    res.status(500).json({ message: "Error fetching bounties" });
  }
};

// @desc    Submit a bounty
// @route   POST /api/user/bounties/:bountyId/submit
// @access  Private
const submitBounty = async (req, res) => {
  try {
    const { submissionLink, description } = req.body;
    const bountyId = req.params.bountyId;

    console.log("Bounty submission request:", {
      bountyId,
      userId: req.user._id,
      submissionLink,
      description,
    });

    // Update bounty statuses first
    await updateBountyStatuses();

    const bounty = await Bounty.findById(bountyId);
    if (!bounty) {
      console.log("Bounty not found:", bountyId);
      return res.status(404).json({ message: "Bounty not found" });
    }

    console.log("Bounty found:", {
      id: bounty._id,
      status: bounty.status,
      isExpired: bounty.isExpired(),
    });

    // Check if bounty is active and not expired
    if (bounty.status !== "active" || bounty.isExpired()) {
      console.log("Bounty not active or expired");
      return res
        .status(400)
        .json({ message: "Bounty is not active or has expired" });
    }

    // Check if already submitted
    const existingSubmission = await BountySubmission.findOne({
      bountyId,
      userId: req.user._id,
    });

    if (existingSubmission) {
      console.log("User already submitted to this bounty");
      return res
        .status(400)
        .json({ message: "You have already submitted to this bounty" });
    }

    const submission = new BountySubmission({
      bountyId,
      userId: req.user._id,
      submissionLink,
      description,
    });

    console.log("Saving submission...");
    const createdSubmission = await submission.save();
    console.log("Submission saved successfully:", createdSubmission._id);

    res.status(201).json(createdSubmission);
  } catch (error) {
    console.error("Error submitting bounty:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's bounty submissions
// @route   GET /api/user/bounty-submissions
// @access  Private
const getUserBountySubmissions = async (req, res) => {
  const submissions = await BountySubmission.find({ userId: req.user._id })
    .populate(
      "bountyId",
      "title reward status durationHours durationMinutes createdAt"
    )
    .sort({ createdAt: -1 });

  // Map submissions to include calculated fields
  const submissionsWithCalculatedFields = submissions.map((sub) => {
    const subObj = sub.toObject();
    if (subObj.bountyId && subObj.bountyId.createdAt) {
      const totalMinutes =
        subObj.bountyId.durationHours * 60 + subObj.bountyId.durationMinutes;
      subObj.bountyId.startTime = subObj.bountyId.createdAt;
      subObj.bountyId.endTime = new Date(
        new Date(subObj.bountyId.createdAt).getTime() + totalMinutes * 60 * 1000
      );
    }
    return subObj;
  });

  res.json(submissionsWithCalculatedFields);
};

// @desc    Get all bounties (for debugging)
// @route   GET /api/user/bounties/all
// @access  Private
const getAllBounties = async (req, res) => {
  try {
    await updateBountyStatuses();
    const now = new Date();

    const bounties = await Bounty.find({}).sort({ createdAt: -1 });

    const bountiesWithDebug = bounties.map((bounty) => {
      const bountyObj = bounty.toObject();

      // Calculate startTime and endTime
      const totalMinutes =
        bountyObj.durationHours * 60 + bountyObj.durationMinutes;
      bountyObj.startTime = bountyObj.createdAt;
      bountyObj.endTime = new Date(
        bountyObj.createdAt.getTime() + totalMinutes * 60 * 1000
      );

      const isExpired = now >= bountyObj.endTime;

      return {
        ...bountyObj,
        currentTime: now.toISOString(),
        isBeforeEnd: !isExpired,
        shouldBeActive: !isExpired,
      };
    });

    res.json(bountiesWithDebug);
  } catch (error) {
    console.error("Error fetching all bounties:", error);
    res.status(500).json({ message: "Error fetching bounties" });
  }
};

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    console.log("getUserProfile called, user ID:", req.user?._id);
    if (!req.user || !req.user._id) {
      console.log("No user in request");
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await User.findById(req.user._id).select("-password");
    console.log("User found:", user ? user.name : "null");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// @desc    Update user profile (wallet address only)
// @route   PUT /api/user/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only allow updating wallet address
    if (walletAddress !== undefined) {
      user.walletAddress = walletAddress;
    }

    const updatedUser = await user.save();

    res.json({
      message: "Profile updated successfully",
      walletAddress: updatedUser.walletAddress,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

module.exports = {
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
};
