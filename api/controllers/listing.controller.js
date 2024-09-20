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

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listings.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing not found!"));
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getAllListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.limit) || 0;

    let offer = req.query.offer;
    if (offer === undefined || "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking === undefined || "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === undefined || "all") {
      type = { $in: ["sale", "rent"] };
    }

    let searchTerm = req.query.searchTerm || "";
    let sort = req.query.sort || "createdAt";
    let order = req.query.sort || "desc";

    const listings = await Listings.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

// export const getAllListings = async (req, res, next) => {
//   try {
//     const limit = parseInt(req.query.limit) || 9;
//     const page = parseInt(req.query.page) || 1;
//     const startIndex = (page - 1) * limit;

//     let offer = req.query.offer === "true" ? true : req.query.offer === "false" ? false : { $in: [false, true] };
//     let furnished = req.query.furnished === "true" ? true : req.query.furnished === "false" ? false : { $in: [false, true] };
//     let parking = req.query.parking === "true" ? true : req.query.parking === "false" ? false : { $in: [false, true] };
//     let type = req.query.type && req.query.type !== "all" ? req.query.type : { $in: ["sale", "rent"] };

//     let searchTerm = req.query.searchTerm || "";
//     let sort = req.query.sort || "createdAt";
//     let order = req.query.order === "asc" ? 1 : -1;

//     const listings = await Listings.find({
//       name: { $regex: searchTerm, $options: "i" },
//       offer,
//       furnished,
//       parking,
//       type,
//     })
//
//       .sort({ [sort]: order })
//       .limit(limit)
//       .skip(startIndex);

//     return res.status(200).json(listings);
//   } catch (error) {
//     next(error);
//   }
// };
