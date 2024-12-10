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
const { initializeSocket, emitMessage } = require('./utils/socketSetup');
const { uploadLevel2Images } = require('./utils/uploadImage');
const operatorObservation = require('./routes/operatorObservationRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const adminRoutes = require('./routes/AdminUserRoutes');
const monitoringMultiSkillRoutes = require('./routes/monitoringMultiSkillRoutes');
const monitoringEffectivenessRoutes = require('./routes/monitoringEffectivenessRoutes');
const { connectToMongoDB } = require('./config/client');
const XLSX = require('xlsx');  // Add XLSX for Excel operations
var cors = require('cors')

const app = express();
const server = http.createServer(app);

// Initialize database connection
connectDB();
connectToMongoDB();

// Middleware and configurations
app.use(express.json());

// Initialize WebSocket server
initializeSocket(server);

// File storage and upload configurations
const dir = './uploads/level2AQuestions';
const userProfile = './uploads/userImages';
const dashboard_uploads_dir = './uploads/dashboard_pdf';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
if (!fs.existsSync(userProfile)) {
  fs.mkdirSync(userProfile);
}
if (!fs.existsSync(dashboard_uploads_dir)) {
  fs.mkdirSync(dashboard_uploads_dir);
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

const dashboard_uploads_storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dashboard_uploads_dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.body.uniqueId}.pdf`);
  },
});

const upload = multer({ storage });
const upload1 = multer({ storage: storage1 });
const upload_dashboard = multer({ storage: dashboard_uploads_storage });

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

// Add /update-excel route
const filePath = path.resolve(__dirname, 'uploads/xlsx', 'latest.xlsx');
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
app.post('/uploads/dashboard_pdf', upload_dashboard.single('file'), (req, res) => {
  // This handler is executed after Multer processes the file
  console.log('Received uniqueId:', req.body.uniqueId);  // Logs the uniqueId from form data
  res.status(200).json({
    message: 'File uploaded successfully',
  });
});

// Serve static files for uploaded images
app.use(
  '/level2AQuestions',
  express.static(path.join(__dirname, 'uploads/level2AQuestions')
),
);
app.use(
  '/userImages',
  express.static(path.join(__dirname, 'uploads/userImages')
),
);

app.get('/xlsx/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads/xlsx', filename);

  res.sendFile(filePath, (err) => {
      if (err) {
          console.error('Error sending file:', err);
          res.status(404).send('File not found');
      }
  });
});

app.get('/xlsx_backups', (req, res) => {
  const filePath = path.join(__dirname, 'uploads/xlsx_backups');

  fs.readdir(filePath, (err, files) => {
    if (err) {
      return res.status(200).json({ files: [] });
    }
    res.status(200).json({
      files: files.filter(file => file.endsWith('.xlsx'))
    });
  });
});

app.get('/xlsx_backups/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads/xlsx_backups', filename);

  res.sendFile(filePath, (err) => {
    if (err) {
        console.error('Error sending file:', err);
        res.status(404).send('File not found');
    }
  });
});

app.get('/dashboard_pdf/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads/dashboard_pdf', filename);

  res.sendFile(filePath, (err) => {
    if (err) {
        console.error('Error sending file:', err);
        res.status(404).send('File not found');
    }
  });
});

module.exports = { app, server, emitMessage };
