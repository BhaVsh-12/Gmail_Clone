import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(' ')[1]; 

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded; 
    next();

  } catch (error) {
    console.error("Authentication Error:", error.message);
    return res.status(401).json({ message: "Token is not valid or expired" });
  }
};

export default isAuthenticated;