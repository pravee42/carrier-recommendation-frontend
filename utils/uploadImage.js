const uploadLevel2Images = async (req, res) => {
  try {
    // Access the file information through req.file
    if (!req.file) {
      return res.status(400).json({message: 'No file uploaded'});
    }

    res.status(200).json({
      message: 'File uploaded successfully',
      file: {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
      },
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({message: 'Internal Server Error'});
  }
};

module.exports = {uploadLevel2Images};
