import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import userModel from "../model/auth.model.js";





export const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token;

  // token not found
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    // verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // find user
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // attach user to request
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export const authenticateSeller = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized: No token",
    });
  }

  try {
    // verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // get user from DB
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    // check seller role
    if (user.role !== "seller") {
      return res.status(403).json({
        message: "Access denied: Sellers only",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
