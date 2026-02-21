const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
    // 1. Check for JWT in Authorization header (Primary for production)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            if (decoded.isAdmin) {
                req.admin = decoded;
                return next();
            }
        } catch (error) {
            console.error('Admin JWT verification failed:', error.message);
        }
    }

    // 2. Check for session (Backup for local development/backward compatibility)
    if (req.session && req.session.adminLoggedIn) {
        return next();
    }

    // Return 401 if not authenticated by either method
    res.status(401).json({
        success: false,
        message: 'Unauthorized: Admin session expired or token invalid'
    });
};

module.exports = adminAuth;
