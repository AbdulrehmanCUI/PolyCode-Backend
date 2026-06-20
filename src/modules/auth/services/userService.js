const User = require("../models/User");
const {
  syncPolycoderForEmailSafe,
  updateMainFollowerEmailSafe,
} = require("../../../services/mainUserSyncService");

function capitalizeNamePart(value = "") {
  const trimmed = String(value).trim();
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

/**
 * Register a new user
 * @param {Object} userData - User data (email, username, password, firstName, lastName)
 * @returns {Promise<Object>} User object
 */
async function registerUser(userData) {
  try {
    const { email, username, password, firstName, lastName } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      throw new Error("Email or username already in use");
    }

    const user = new User({
      email,
      username,
      password,
      firstName: capitalizeNamePart(firstName),
      lastName: capitalizeNamePart(lastName),
    });

    await user.save();
    const serializedUser = user.toJSON();
    await syncPolycoderForEmailSafe(serializedUser);
    return serializedUser;
  } catch (error) {
    throw error;
  }
}

/**
 * Login user - verify credentials
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User object
 */
async function loginUser(email, password) {
  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const serializedUser = user.toJSON();
    await syncPolycoderForEmailSafe(serializedUser);
    return serializedUser;
  } catch (error) {
    throw error;
  }
}

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User object
 */
async function getUserById(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const serializedUser = user.toJSON();
    await syncPolycoderForEmailSafe(serializedUser);
    return serializedUser;
  } catch (error) {
    throw error;
  }
}

/**
 * Get public user profile by username
 * @param {string} username - Username handle
 * @returns {Promise<Object>} User object
 */
async function getUserByUsername(username) {
  try {
    const normalizedUsername = String(username || "").trim().toLowerCase();
    if (!/^[a-z0-9_][a-z0-9_.-]{2,29}$/.test(normalizedUsername)) {
      throw new Error("User not found");
    }

    const user = await User.findOne({
      username: normalizedUsername,
      isActive: true,
    });

    if (!user) {
      throw new Error("User not found");
    }

    const serializedUser = user.toJSON();
    if (filteredData.username !== undefined) {
      await syncPolycoderForEmailSafe(serializedUser);
    }
    return serializedUser;
  } catch (error) {
    throw error;
  }
}

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Promise<Object>} User object
 */
async function getUserByEmail(email) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    return user.toJSON();
  } catch (error) {
    throw error;
  }
}

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated user object
 */
async function updateUserProfile(userId, updateData) {
  try {
    const allowedFields = [
      "username",
      "firstName",
      "lastName",
      "bio",
      "profilePicture",
      "profilePictureDriveId",
      "preferredLanguages",
    ];
    const filteredData = {};

    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    });

    if (filteredData.firstName !== undefined) {
      filteredData.firstName = capitalizeNamePart(filteredData.firstName);
    }
    if (filteredData.lastName !== undefined) {
      filteredData.lastName = capitalizeNamePart(filteredData.lastName);
    }

    if (filteredData.username !== undefined) {
      const nextUsername = String(filteredData.username).trim().toLowerCase();
      if (nextUsername.length < 3 || nextUsername.length > 30) {
        throw new Error("Username must be between 3 and 30 characters");
      }
      const taken = await User.findOne({
        username: nextUsername,
        _id: { $ne: userId },
      });
      if (taken) {
        throw new Error("Username is already taken");
      }
      filteredData.username = nextUsername;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { ...filteredData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    return user.toJSON();
  } catch (error) {
    throw error;
  }
}

async function setFollowRelationship(currentUserId, targetUsername, shouldFollow) {
  const normalizedUsername = String(targetUsername || "").trim().toLowerCase();
  if (!/^[a-z0-9_][a-z0-9_.-]{2,29}$/.test(normalizedUsername)) {
    throw new Error("User not found");
  }

  const [currentUser, targetUser] = await Promise.all([
    User.findById(currentUserId),
    User.findOne({ username: normalizedUsername, isActive: true }),
  ]);

  if (!currentUser) {
    throw new Error("Current user not found");
  }
  if (!targetUser) {
    throw new Error("User not found");
  }
  if (String(currentUser._id) === String(targetUser._id)) {
    throw new Error("You cannot follow yourself");
  }

  const alreadyFollowing = (currentUser.following || []).some(
    (id) => String(id) === String(targetUser._id),
  );

  if (shouldFollow && !alreadyFollowing) {
    currentUser.following = [...(currentUser.following || []), targetUser._id];
    targetUser.followers = [...(targetUser.followers || []), currentUser._id];
  } else if (!shouldFollow && alreadyFollowing) {
    currentUser.following = (currentUser.following || []).filter(
      (id) => String(id) !== String(targetUser._id),
    );
    targetUser.followers = (targetUser.followers || []).filter(
      (id) => String(id) !== String(currentUser._id),
    );
  }

  currentUser.followingCount = currentUser.following.length;
  targetUser.followersCount = targetUser.followers.length;
  currentUser.updatedAt = Date.now();
  targetUser.updatedAt = Date.now();

  await Promise.all([currentUser.save(), targetUser.save()]);
  await updateMainFollowerEmailSafe({
    targetEmail: targetUser.email,
    followerEmail: currentUser.email,
    follow: shouldFollow,
  });

  return {
    isFollowing: shouldFollow,
    user: currentUser.toJSON(),
    targetUser: targetUser.toJSON(),
  };
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} oldPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} User object
 */
async function changePassword(userId, oldPassword, newPassword) {
  try {
    const user = await User.findById(userId).select("+password");

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await user.comparePassword(oldPassword);

    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    return user.toJSON();
  } catch (error) {
    throw error;
  }
}

/**
 * Delete user account
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Deleted user object
 */
async function deleteUserAccount(userId) {
  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return { message: "Account deleted successfully" };
  } catch (error) {
    throw error;
  }
}

/**
 * Save profile picture URL (and optional Drive file id) after upload.
 */
async function setProfilePicture(userId, { url, driveFileId }) {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      profilePicture: url,
      profilePictureDriveId: driveFileId || null,
      updatedAt: Date.now(),
    },
    { new: true, runValidators: true },
  );

  if (!user) {
    throw new Error("User not found");
  }

  return user.toJSON();
}

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  updateUserProfile,
  setFollowRelationship,
  setProfilePicture,
  changePassword,
  deleteUserAccount,
};
