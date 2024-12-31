import { Router } from "express";
import {
  saveAddress,
  getCurrentAddress,
  getSavedAddresses,
  getAddressDetails,
} from "../controllers/addressController";
import { protect } from "../controllers/authController";
import { updateAddress } from "../controllers/addressController";
import { deleteAddress } from "../controllers/addressController";

const router = Router();

router.post("/saveAddress", protect, saveAddress);

router.get("/getCurrentAddress", protect, getCurrentAddress);

router.get("/getSavedAddresses", protect, getSavedAddresses);

router.get("/getAddressDetails/:id", protect, getAddressDetails);

router.put("/updateAddress/:id", protect, updateAddress);

router.delete("/deleteAddress/:id", protect, deleteAddress);

export default router;
