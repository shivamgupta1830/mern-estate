import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/errorHandler.js";

// Signup

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    if (
      !username ||
      !email ||
      !password ||
      username === "" ||
      email === "" ||
      password === ""
    )
      return next(errorHandler(400, "All fields required"));

    const userExist = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });
    console.log(userExist);

    if (userExist) return next(errorHandler(400, "User already exists!"));

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    next(error);
  }
};

// Signin

export const signin = async (req, res) => {
  console.log(req.body);
};
