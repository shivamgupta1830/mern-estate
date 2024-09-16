import User from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import bcryptjs from "bcryptjs";

export const updateUser = async (req, res, next) => {
  // Check if the user is authorized to update this account

  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "Can't access this account!"));

  try {
    // Validate the incoming password  if it is being updated

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(
          errorHandler(400, "Password must have at least 6 characters")
        );
      }

      // If validation passed, hash the password
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    // Find the user by ID and update it, while running validation
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      {
        new: true, // Return the updated document
        runValidators: true, // Run validation on update (password already checked earlier, here it will check Hashed Password)
      }
    );

    //     Without $set:

    // User.findByIdAndUpdate(id, {
    //   username: req.body.username,
    //   email: req.body.email,
    //   password: req.body.password,
    // });

    // This would replace the entire document with just the fields mentioned, and any missing fields would be deleted.

    // Destructure to remove the password from the response
    const { password, ...rest } = updatedUser._doc;

    // Send a success response
    res.status(200).json({ message: "Updated Successfully!", ...rest });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your account!"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json({ message: "Deleted Successfully!" });
  } catch (error) {
    next(error);
  }
};
