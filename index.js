const {app, server} = require('./app');

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// server.listen(3000, () => console.log(`Socket running on port ${'3000'}`));
