const activeChannel = require("../models/activeChannel");

const SetActiveChannel = async (req, res) => {
  try {
    const { userId, device } = req.body;

    // Validate request body
    if (!userId || !device) {
      return res
        .status(400)
        .json({ message: "userId and device are required." });
    }

    // Update or create the active channel
    const activechannel = await activeChannel.findOneAndUpdate(
      { device: device }, // Match by device
      {
        userId: userId,
        lastConnectedTime: new Date(),
        status: "started"
      },
      { new: true, upsert: true } // Upsert option
    );

    res.status(200).json(activechannel);
  } catch (error) {
    console.error("Error in SetActiveChannel:", error); // Log the error
    res.status(500).json({ message: error.message });
  }
};

module.exports = { SetActiveChannel };
