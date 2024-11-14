const jwt = require('jsonwebtoken');

// Middleware to authenticate users
const authenticate = (req, res, next) => {
  // Access the token from the cookies
  const token = req.cookies.auth_token;
  
  // If token is invalid, return unauthorized access
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized Access' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    
    // If valid, attach the decoded user information to the request
    req.user = decoded;
    next();
  });
};

module.exports = authenticate;
