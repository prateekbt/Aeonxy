const isAdmin = (req, res, next) => {
    // Check if the user is an admin or superuser
    if (req.user && (req.user.role === 'admin')) {
        next(); // Allow the request to proceed
    } else {
        return res.status(403).json({ message: 'Unauthorized' }); // User is not authorized
    }
};

export default isAdmin;