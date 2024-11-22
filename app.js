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
const { initializeSocket, emitMessage } = require('./utils/socketSetup');
const { uploadLevel2Images } = require('./utils/uploadImage');
const operatorObservation = require('./routes/operatorObservationRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const adminRoutes = require('./routes/AdminUserRoutes');
const monitoringMultiSkillRoutes = require('./routes/monitoringMultiSkillRoutes');
const monitoringEffectivenessRoutes = require('./routes/monitoringEffectivenessRoutes');
const { connectToMongoDB } = require('./config/client');
const { addThemeData, getThemeData } = require('./controllers/dashboardController');
const XLSX = require('xlsx');  // Add XLSX for Excel operations

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
const dir = './uploads/level2AQuestions';
const userProfile = './uploads/userImages';
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

const upload = multer({ storage });
const upload1 = multer({ storage: storage1 });

// Routes
app.use('/api/users', userRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/channel', channelRoutes);
app.use('/api/level3', level3Routes);
app.use('/api/level3b', operatorObservation);
app.use('/api/supervisor', superVisorRoutes);
app.use('/api/trainer', trainerRoutes);
app.use('/api/s', settingsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/monitoring-effectiveness', monitoringEffectivenessRoutes);
app.use('/api/monitoring-multi-skill', monitoringMultiSkillRoutes);
app.post('dashboard/theme', addThemeData);
app.post('dashboard/theme', getThemeData);

// Add /update-excel route
const filePath = path.resolve(__dirname, 'public', 'Dojo Dash Board(2).xlsx');
app.post('/update-excel', (req, res) => {
  const { editedData, sheetNames } = req.body;

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({ error: `File does not exist at path: ${filePath}` });
    }

    try {
      fs.accessSync(filePath, fs.constants.R_OK | fs.constants.W_OK);
    } catch (err) {
      return res.status(500).json({ error: `No read/write permissions for file: ${filePath}` });
    }

    const workbook = XLSX.readFile(filePath);

    for (const [key, originalSheetName] of Object.entries(sheetNames)) {
      if (editedData[key]) {
        const sheet = workbook.Sheets[originalSheetName];
        if (!sheet) {
          return res.status(404).json({ error: `Sheet ${originalSheetName} not found in the Excel file` });
        }

        let existingData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        editedData[key].forEach((row) => {
          const rowIndex = existingData.findIndex((existingRow) => existingRow[1] === row.Contents);
          if (rowIndex > -1) {
            existingData[rowIndex] = [
              '',
              row.Contents,
              row.Switch,
              row.Wiper,
              row.Total,
              row.April, row.May, row.June, row.July, row.August,
              row.September, row.October, row.November, row.December,
              row.January, row.February, row.March
            ];
          }
        });

        const updatedWorksheet = XLSX.utils.aoa_to_sheet(existingData);
        workbook.Sheets[originalSheetName] = updatedWorksheet;
      }
    }

    XLSX.writeFile(workbook, filePath);
    res.json({ message: 'Excel file updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update Excel file', details: error.message });
  }
});

app.post('/uploads/level2AImages', upload.single('file'), uploadLevel2Images);
app.post('/uploads/userProfile', (req, res) => {
  upload1.single('file')(req, res, err => {
    if (err) {
      return res.status(500).json({ message: 'File upload failed', error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
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
  express.static(path.join(__dirname, 'level2AQuestions'), {
    setHeaders: res => res.set('Access-Control-Allow-Origin', '*'),
  }),
);
app.use(
  '/userImages',
  express.static(path.join(__dirname, 'userImages'), {
    setHeaders: res => res.set('Access-Control-Allow-Origin', '*'),
  }),
);


module.exports = { app, server, emitMessage };
