const jwt = require('jsonwebtoken');

const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "Admin123";

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });
  }

  const token = jwt.sign(
    { email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return res.status(200).json({
    success: true,
    token,
    message: "Login successful"
  });
};