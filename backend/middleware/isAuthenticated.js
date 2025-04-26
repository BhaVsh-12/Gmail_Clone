import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded;  // decoded will already contain user info
    next();
    
  } catch (error) {
    console.error("Authentication Error:", error.message);
    return res.status(401).json({ message: "Authentication failed" });
  }
};

export default isAuthenticated;
