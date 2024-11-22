const User = require('../models/User');

const verifyUser = async (req, res) => {
  try {
    const { userId, verifiedBy, signaturePath } = req.body;
    const user = await User.findByIdAndUpdate(userId, {
      verified: true,
      verifiedBy,
      fingerprint: signaturePath,
    }, { new: true });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { verifyUser };
