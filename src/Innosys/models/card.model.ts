
import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  userId: String,
  stripePaymentMethodId: String,
  brand: String,
  last4: String,
  expMonth: Number,
  expYear: Number,
  isDefault: Boolean,
});

export default mongoose.model("cards", cardSchema);
