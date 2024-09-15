import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";

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

    if (userExist) return next(errorHandler(400, "User already exists!"));

    // const hashedPassword = bcryptjs.hashSync(password, 10);

    // const newUser = new User({
    //   username,
    //   email,
    //   password: hashedPassword,
    // });

    // Create the new user instance without hashing the password
    const newUser = new User({
      username,
      email,
      password, // The raw password will be validated here
    });

    // Validate the user to catch validation errors (like password minlength)
    await newUser.validate();

    // Now hash the password after validation
    newUser.password = bcryptjs.hashSync(password, 10);

    await newUser.save();
    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    next(error);
  }
};

// Signin

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password || email === "" || password === "")
      return next(errorHandler(400, "All fields required"));

    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found!"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie (security measure)
        maxAge: 3600000 * 24 * 30, // 30 days in milliseconds (3600 seconds * 1000 ms)
        secure: process.env.NODE_ENV === "production", // Ensure the cookie is only sent over HTTPS in production

        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // Use lax in dev mode // Prevents CSRF attacks by only allowing the cookie to be sent from the same domain
      })
      .status(200)
      .json({ message: "Sign in successful", ...rest });
  } catch (error) {
    next(error);
  }
};

// Google

export const google = async (req, res, err) => {
  console.log("signGOOgle");
  const { email, name, photo: photoURL } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      const { password: pass, ...rest } = user._doc;

      res
        .cookie("access_token", token, {
          httpOnly: true,
          maxAge: 3600000 * 24 * 30,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        })
        .status(200)
        .json({ message: "Sign in successful", ...rest });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(36).slice(-8),
        email,
        password: hashedPassword,
        profilePicture: photoURL,
      });

      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      const { password: pass, ...rest } = newUser._doc;

      res
        .cookie("access_token", token, {
          httpOnly: true,
          maxAge: 3600000 * 24 * 30,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        })
        .status(200)
        .json({ message: "Sign in successful", ...rest });
    }
  } catch (error) {
    next(error);
  }
};
