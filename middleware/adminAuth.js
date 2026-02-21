const adminAuth = (req, res, next) => {
    // Check if admin is logged in via session
    if (req.session && req.session.adminLoggedIn) {
        return next();
    }

    // Return 401 if not authenticated
    res.status(401).json({
        success: false,
        message: 'Unauthorized: Admin session expired or not found'
    });
};

module.exports = adminAuth;
