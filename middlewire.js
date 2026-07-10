// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = "MY_REST_API_SUPER_SECRET_KEY_123"; // Must match your authRoutes key!

const protect = (req, res, next) => {
    let token;

    // Check if the request header contains a Bearer token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Split "Bearer <token_string>" to isolate the token
            token = req.headers.authorization.split(' ')[1];

            // Decode and verify the token signature
            const decoded = jwt.verify(token, JWT_SECRET);

            // Attach the logged-in user's ID and role directly to the request object
            req.user = decoded;

            // Let the request proceed to the route handler!
            return next();
        } catch (error) {
            return res.status(401).json({ success: false, error: "Not authorized, token failed" });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, error: "Not authorized, no security token found" });
    }
};

// Add this at the bottom of middleware/authMiddleware.js

const authorize = (...roles) => {
    return (req, res, next) => {
        // req.user was attached by our 'protect' guard right above!
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                error: `Role '${req.user.role}' is not authorized to access this resource` 
            });
        }
        next();
    };
};

// Update your exports to include authorize
module.exports = { protect, authorize };