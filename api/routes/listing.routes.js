import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getAllListings,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.put("/update/:id", verifyToken, updateListing);
router.get("/get/:id", getListing);
router.get("/get", getAllListings);

export default router;
