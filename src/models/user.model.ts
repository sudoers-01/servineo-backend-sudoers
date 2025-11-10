import { Schema, model, models } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['fixer', 'requester', 'visitor'],
      required: true,
    },
    language: {
      type: String,
      enum: ['es', 'en'],
      default: 'es',
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// Evitar recompilación del modelo
export const User = models.User || model('User', userSchema, 'users');
