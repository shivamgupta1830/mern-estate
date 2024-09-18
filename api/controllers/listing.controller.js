// Signup

import Listings from "../models/listing.model.js";

export const createListing = async (req, res, next) => {
  //CHAT GPT ---- which is to use to save the data for listing (.create or .save) and user  (.create or .save) in mongoose

  try {
    const listing = await Listings.create(req.body);
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
