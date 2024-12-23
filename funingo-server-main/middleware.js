import jwt from "jsonwebtoken";
import User from "./models/user.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    const json_secret_key = process.env.JWT_SECRET_KEY;
    const user_id = jwt.verify(token, json_secret_key);
    const user = await User.findById(user_id);
    if (user) {
      req.user = user;
      next();
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(401).send({ error: "User is not authenticated." });
  }
};

export const authenticateEmployee = async (req, res, next) => {
  try {
    const { token } = req.headers;
    const json_secret_key = process.env.JWT_SECRET_KEY;
    const user_id = jwt.verify(token, json_secret_key);
    const user = await User.findById(user_id);
    if (user && (user.user_type === "employee" || user.user_type === "admin")) {
      req.user = user;
      next();
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(401).send({ error: "User is not authenticated." });
  }
};

export const authenticateAdmin = async (req, res, next) => {
  try {
    const { token } = req.headers;
    const json_secret_key = process.env.JWT_SECRET_KEY;
    const user_id = jwt.verify(token, json_secret_key);
    const user = await User.findById(user_id);
    if (user && user.user_type === "admin") {
      req.user = user;
      next();
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(401).send({ error: "User is not authenticated." });
  }
};

export const authenticateWindowEmployee = async (req, res, next) => {
  try {
    const { token } = req.headers;
    const json_secret_key = process.env.JWT_SECRET_KEY;
    const user_id = jwt.verify(token, json_secret_key);
    const user = await User.findById(user_id);
    if (
      (user && user.user_type === "window_employee") ||
      user.user_type === "admin"
    ) {
      req.user = user;
      next();
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(401).send({ error: "User is not authenticated." });
  }
};
