const adminOnly = (req, res, next) => {
  // This middleware assumes 'protectRoute' has already run
  // and attached 'req.user'
  if (req.user && req.user.role === "admin") {
    next(); // User is an admin, allow them to proceed
  } else {
    res.status(403).json({
      message: "Forbidden: This action is reserved for administrators.",
    });
  }
};

export default adminOnly;
