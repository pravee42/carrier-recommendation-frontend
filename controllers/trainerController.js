const User = require('../models/User');

// Controller to get all unverified users
const getUnverifiedUsers = async (req, res) => {
  try {
    // Fetch all users where isVerified is false
    const users = await User.find({ isVerified: false });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No unverified users found' });
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching unverified users:', error);
    res.status(500).json({ message: 'Error fetching unverified users' });
  }
};

// Controller to verify multiple users
const verifyUsers = async (req, res) => {
  try {
    const { userIds } = req.body; // Expecting an array of user IDs to be verified

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of user IDs to verify' });
    }

    // Verify all users in the userIds array
    const result = await User.updateMany(
      { _id: { $in: userIds }, isVerified: false }, // Ensure we're only verifying users who are not already verified
      { $set: { isVerified: true } }
    );

    if (result.nModified === 0) {
      return res.status(400).json({ message: 'No users were updated. Please check the user IDs.' });
    }

    res.status(200).json({ message: `${result.nModified} users successfully verified` });
  } catch (error) {
    console.error('Error verifying users:', error);
    res.status(500).json({ message: 'Error verifying users' });
  }
};

module.exports = { getUnverifiedUsers, verifyUsers };
