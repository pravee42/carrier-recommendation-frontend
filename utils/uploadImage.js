const uploadLevel2Images = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Correctly generate public URL
    const fileUrl = `/level2AQuestions/${req.file.filename}`;
   console.log('file',fileUrl);
   
    res.status(200).json({
      message: "File uploaded successfully",
      file: {
        filename: req.file.filename,
        url: fileUrl, // Correct public URL
        size: req.file.size,
      },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const uploadUserProfileImage = (req, res) => {
  try {
    // Handle the uploaded user profile image
    res.status(200).json({ message: "User profile image uploaded successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to upload user profile image.", error });
  }
};



module.exports = {uploadLevel2Images, uploadUserProfileImage};
