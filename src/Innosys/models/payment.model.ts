import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fixerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  cardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Card' },
  amount: { type: Number, required: true }, // en centavos
  currency: { type: String, default: 'BOB' },
  status: { type: String, default: 'pending' },
  paymentIntentId: { type: String },
}, { timestamps: true });

export default mongoose.model('payments', paymentSchema);
