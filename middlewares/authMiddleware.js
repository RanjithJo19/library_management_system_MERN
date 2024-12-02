const jwt = require('jsonwebtoken');

const authMiddleware = (request, response, next) => {

    const token = request.header('Authorization');

    if (!token) {
        return response.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token);
        request.user = decoded;
        next();
    } catch (error) {
        response.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
