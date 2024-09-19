// Signup

import Listings from "../models/listing.model.js";
import { errorHandler } from "../utils/errorHandler.js";

export const createListing = async (req, res, next) => {
  //CHAT GPT ---- which is to use to save the data for listing (.create or .save) and user  (.create or .save) in mongoose    &&     PUT vs Patch

  try {
    const listing = await Listings.create(req.body);
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listings.findById(req.params.id);

  if (!listing) return next(errorHandler(404, "Listing not found!"));

  if (req.user.id !== listing.userRef)
    return next(errorHandler(401, "You can delete only your listing!"));

  try {
    await Listings.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listings.findById(req.params.id);

  if (!listing) return next(errorHandler(404, "Listing not found!"));

  if (req.user.id !== listing.userRef)
    return next(errorHandler(401, "You can edit only your listing!"));

  try {
    const updatedListing = await Listings.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    // const editedListing = Listings.findByIdAndUpdate( req.params.id, req.body);

    // If you don't use $set, the fields in req.body will replace the entire document rather than updating only the specific fields provided.

    res
      .status(200)
      .json({ message: "Listing has been updated!", updatedListing });
  } catch (error) {
    next(error);
  }
};
