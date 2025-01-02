const jsonwebtoken = require("jsonwebtoken");

const  authorizeRoles = () => {

return (req, res, next) => {
    
    
    try {
        const accessToken = req.headers.authorization.replace("Bearer ", "");

        if (!accessToken) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }
    
        const jwt_payload = jsonwebtoken.verify(accessToken, process.env.JWT_SECRET);
    
        req.user = jwt_payload;
        req.params = jwt_payload;
        // console.log(jwt_payload);

        if (jwt_payload.userType =! 'Librarian') throw new Error('Access Denied!');

      } catch (e) {
        res.status(401).json({
          status: "failed",
          message: "Unauthorized!",
        });
        return;
      }

    
    next();
  };
};

module.exports = authorizeRoles;