const jwt = require('jsonwebtoken');

const JWT_SECRET = 'japan';

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Token format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Access denied: no token provided' });
  }

  try {
    // Verify the token and decode it
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach the decoded token data (e.g., id, role) to `req.user`
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = authenticate;
