const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const examRoutes = require('./routes/examRoutes');
const verifyRoutes = require('./routes/verifyRoutes');
const channelRoutes = require('./routes/activeChannelRoutes');
const {initSocket} = require('./controllers/examController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); // Import cors

const {uploadLevel2Images} = require('./utils/uploadImage');

const dir = './level2AQuestions';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Add timestamp to filename
  },
});
const upload = multer({storage});
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

connectDB();
initSocket(io);

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/channel', channelRoutes);
app.post('/upload/level2AImages', upload.single('file'), uploadLevel2Images);

module.exports = app;
