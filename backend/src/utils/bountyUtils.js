const Bounty = require("../models/Bounty");

/**
 * Convert IST to UTC
 * IST is UTC+5:30
 */
const istToUTC = (istDateString) => {
  const istDate = new Date(istDateString);
  // Subtract 5 hours 30 minutes to convert IST to UTC
  const utcDate = new Date(istDate.getTime() - 5.5 * 60 * 60 * 1000);
  return utcDate;
};

/**
 * Convert UTC to IST
 */
const utcToIST = (utcDate) => {
  const date = new Date(utcDate);
  // Add 5 hours 30 minutes to convert UTC to IST
  const istDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
  return istDate;
};

/**
 * Update bounty statuses based on current time
 * Should be called periodically or before fetching bounties
 */
const updateBountyStatuses = async () => {
  try {
    const now = new Date();

    // Find all active bounties
    const activeBounties = await Bounty.find({ status: "active" });

    // Check each bounty if it's expired
    for (const bounty of activeBounties) {
      if (bounty.isExpired()) {
        bounty.status = "closed";
        await bounty.save();
      }
    }

    return true;
  } catch (error) {
    console.error("Error updating bounty statuses:", error);
    return false;
  }
};

/**
 * Get the current status for a bounty based on time
 */
const getBountyStatus = (
  createdAt,
  durationHours,
  durationMinutes,
  currentStatus
) => {
  const now = new Date();

  if (currentStatus === "closed") {
    return "closed";
  }

  const totalMinutes = durationHours * 60 + durationMinutes;
  const endTime = new Date(createdAt.getTime() + totalMinutes * 60 * 1000);

  if (now >= endTime) {
    return "closed";
  }

  return "active";
};

/**
 * Get time remaining for a bounty in minutes
 */
const getTimeRemaining = (createdAt, durationHours, durationMinutes) => {
  const now = new Date();
  const totalMinutes = durationHours * 60 + durationMinutes;
  const endTime = new Date(createdAt.getTime() + totalMinutes * 60 * 1000);
  const diffMs = endTime - now;

  if (diffMs <= 0) return 0;

  return Math.floor(diffMs / (1000 * 60));
};

module.exports = {
  istToUTC,
  utcToIST,
  updateBountyStatuses,
  getBountyStatus,
  getTimeRemaining,
};
