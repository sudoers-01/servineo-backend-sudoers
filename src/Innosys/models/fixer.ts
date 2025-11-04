// ============================================
// ARCHIVO: src/Innosys/models/Fixer.ts (EJEMPLO - PENDIENTE)
// ============================================

/*
import mongoose, { Schema, Document } from 'mongoose';

export interface IWallet {
  currentBalance: number;
  totalEarnings: number;
  totalDeductions: number;
}

export interface IStats {
  completedJobs: number;
  cancelledJobs: number;
  rating: number;
}

export interface IFixer extends Document {
  fixerId: string;
  name: string;
  email: string;
  wallet: IWallet;
  stats: IStats;
  createdAt: Date;
}

const fixerSchema: Schema = new Schema({
  fixerId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  wallet: {
    currentBalance: {
      type: Number,
      default: 0
    },
    totalEarnings: {
      type: Number,
      default: 0
    },
    totalDeductions: {
      type: Number,
      default: 0
    }
  },
  stats: {
    completedJobs: {
      type: Number,
      default: 0
    },
    cancelledJobs: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Fixer = mongoose.model<IFixer>('Fixer', fixerSchema);
*/