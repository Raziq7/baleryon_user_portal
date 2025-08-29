import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import sanitizedConfig from "../config.js";

export function verifyToken(req, res, next) {
  const auth = req.headers.authorization || req.headers.Authorization;
  const token = typeof auth === "string" && auth.startsWith("Bearer ")
    ? auth.slice(7)
    : null;

  if (!token) return res.status(403).json({ message: "Token is required" });

  jwt.verify(token, sanitizedConfig.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });

    // Accept whichever key was used when signing:
    const userId = decoded.userId || decoded._id || decoded.id || decoded.sub;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id in token" });
    }
console.log(userId,"userIduserIduserIduserIduserIduserId");

    // Normalize for downstream code:
    req.user = { _id: userId };
    next();
  });
}
