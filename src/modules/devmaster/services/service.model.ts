import { Schema, model } from 'mongoose';

const serviceSchema = new Schema(
  {
    name: { type: String, required: true, index: true },
    description: { type: String, default: '' },
  },
  { timestamps: true },
);

export const Service = model('Service', serviceSchema, 'jobs');
