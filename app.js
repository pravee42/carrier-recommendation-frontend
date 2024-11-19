// server.js
const express = require('express');
const http = require('http');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const examRoutes = require('./routes/examRoutes');
const level3Routes = require('./routes/level3Routes');
const channelRoutes = require('./routes/activeChannelRoutes');
const superVisorRoutes = require('./routes/supervisorRoutes');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const {initializeSocket, emitMessage} = require('./utils/socketSetup'); // Import socket functions
const {uploadLevel2Images} = require('./utils/uploadImage');
const operatorObservation = require('./routes/operatorObservationRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const adminRoutes = require('./routes/AdminUserRoutes');
const monitoringMultiSkillRoutes = require('./routes/monitoringMultiSkillRoutes');
const monitoringEffectivenessRoutes = require('./routes/monitoringEffectivenessRoutes');
const {connectToMongoDB} = require('./config/client');

const app = express();
const server = http.createServer(app);

// Initialize database connection
connectDB();

connectToMongoDB();

// Middleware and configurations
app.use(cors());
app.use(express.json());

// Initialize WebSocket server
initializeSocket(server);

// File storage and upload configurations
const dir = './level2AQuestions';
const userProfile = './userImages';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
if (!fs.existsSync(userProfile)) {
  fs.mkdirSync(userProfile);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const storage1 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, userProfile);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({storage});
const upload1 = multer({storage: storage1});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/exam', examRoutes);
// app.use("/api/verify", verifyRoutes);
app.use('/api/channel', channelRoutes);
app.use('/api/level3', level3Routes);
app.use('/api/level3b', operatorObservation);
app.use('/api/supervisor', superVisorRoutes);
app.use('/api/trainer', trainerRoutes);
app.use('/api/s', settingsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/monitoring-effectiveness', monitoringEffectivenessRoutes);
app.use('/api/monitoring-multi-skill', monitoringMultiSkillRoutes);

app.post('/upload/level2AImages', upload.single('file'), uploadLevel2Images);
app.post('/upload/userProfile', (req, res) => {
  upload1.single('file')(req, res, err => {
    if (err) {
      console.error('Multer error:', err);
      return res
        .status(500)
        .json({message: 'File upload failed', error: err.message});
    }
    if (!req.file) {
      return res.status(400).json({message: 'No file uploaded'});
    }
    res.status(200).json({
      message: 'User profile image uploaded successfully',
      file: req.file,
    });
  });
});

// Serve static files for uploaded images
app.use(
  '/level2AQuestions',
  express.static(path.join(__dirname, 'level2AQuestions')),
);
app.use('/userImages', express.static(path.join(__dirname, 'userImages')));

// Start the server
server.listen(3000, () => {
  console.log('listening on *:3000');
});

module.exports = {app, emitMessage}; // Export emitMessage for use elsewhere
