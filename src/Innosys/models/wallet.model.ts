import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    users_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userpay", // o "User", según tu referencia
      required: true,
      unique: true, // cada usuario solo puede tener una wallet
    },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: "BOB" },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    minimumBalance: { type: Number, default: 0 },
    lowBalanceThreshold: { type: Number, default: 50 },
    lastLowBalanceNotification: { type: Date },
  },
  { timestamps: true } // agrega createdAt y updatedAt
);

// ⚙️ Usa exactamente la colección 'wallet'
export default mongoose.model("wallets", walletSchema, "wallets");
