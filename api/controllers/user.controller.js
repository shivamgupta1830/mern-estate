import User from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import bcryptjs from "bcryptjs";

export const updateUser = async (req, res, next) => {
  // Check if the user is authorized to update this account

  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "Can't access this account!"));

  try {
    // If a password is being updated, hash it before saving
    if (req.body.password) {
      req.body.password = await bcryptjs.hashSync(req.body.password, 10);
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
        runValidators: true, // Run validation on update
      }
    );

    //     Without $set:

    // User.findByIdAndUpdate(id, {
    //   username: req.body.username,
    //   email: req.body.email,
    //   password: req.body.password,
    // });

    // This would replace the entire document with just the fields mentioned, and any missing fields would be deleted.

    // If the user is not found ######################################################

    if (!updatedUser) {
      return next(errorHandler(404, "User not found!"));
    }

    // Destructure to remove the password from the response
    const { password, ...rest } = updatedUser._doc;

    // Send a success response
    res.status(200).json({ message: "Updated Successfully!", ...rest });
  } catch (error) {
    next(error);
  }
};
