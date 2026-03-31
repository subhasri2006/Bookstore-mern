const ADMIN_EMAIL = "subhasri4844@gmail.com"; // 🔥 your admin email

const adminMiddleware = (req, res, next) => {
  if (req.user.email !== ADMIN_EMAIL) {
    return res.status(403).json({ message: "Admin only access" });
  }
  next();
};

module.exports = adminMiddleware;