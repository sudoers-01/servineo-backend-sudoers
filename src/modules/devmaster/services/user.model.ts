// src/modules/devmaster/services/user.model.ts
import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
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
    createdAt: { type: Date, require: true },
  },
);

export const User = model('User', userSchema, 'users');