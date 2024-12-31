import mongoose from "mongoose";

export interface IAddress extends mongoose.Document {
  id: mongoose.Types.ObjectId;
  coordinates: [number, number];
  address: string;
  houseDetails: string;
  street: string;
  addressType: string;
  userId: mongoose.Types.ObjectId;
}

const addressSchema = new mongoose.Schema({
  coordinates: {
    type: [Number, Number],
    required: [true, "Please provide coordinates"],
  },
  address: {
    type: String,
    required: [true, "Please provide address"],
  },
  houseDetails: {
    type: String,
    required: [true, "Please provide house details"],
  },
  street: {
    type: String,
    required: [true, "Please provide street"],
  },
  addressType: {
    type: String,
    required: [true, "Please provide address type"],
    enum: ["home", "office", "friends", "family"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide user id"],
  },
  recentlyUsed: {
    type: Date,
    default: Date.now(),
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const Address = mongoose.model<IAddress>("Address", addressSchema);
export default Address;
