// src/models/offer.model.ts
import { Schema, model } from 'mongoose';

const offerSchema = new Schema(
  {
    fixerName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    price: { type: Number, required: true },
    city: { type: String, required: true },
    contactPhone: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const Offer = model('Offer', offerSchema, 'offers');
