const jwt = require('jsonwebtoken');

const authMiddleware = (request, response, next) => {
  const token = request.header('Authorization')?.replace('Bearer ', '');
  // console.log("jwt token: ",token);
  if (!token) {
    return response.status(401).send('Access denied');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("decoded: ",decoded);
    request.user = decoded;
    // if (decoded.userType =! 'Librarian') throw new Error('Access Denied!');
    next();
  } catch (error) {
    response.status(400).send('Invalid token');
  }
};

module.exports = authMiddleware;