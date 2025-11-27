// src/models/user.model.ts

import { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  url_photo?: string;
  role: "requester" | "fixer" | "both"; // puedes usar "both" si quieres permitir los dos roles

  authProviders?: Array<{
    provider: string;
    providerId: string;
    password?: string;
  }>;

  telefono?: string;
  ubicacion?: {
    lat?: number;
    lng?: number;
    direccion?: string;
    departamento?: string;
    pais?: string;
  };

  ci?: string;
  servicios?: string[];                    // ← IDs de servicios
  vehiculo?: {
    hasVehiculo: boolean;
    tipoVehiculo?: string;
  };
  acceptTerms?: boolean;

  metodoPago?: {
    hasEfectivo: boolean;
    qr: boolean;
    tarjetaCredito: boolean;
  };

  // workLocation opcional si el fixer trabaja en otra zona
  workLocation?: {
    lat?: number;
    lng?: number;
    direccion?: string;
    departamento?: string;
    pais?: string;
  };

  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    url_photo: String,

    role: {
      type: String,
      enum: ["requester", "fixer", "both"],
      default: "requester",
    },

    authProviders: [
      {
        provider: { type: String, required: true },
        providerId: { type: String, required: true },
        password: String,
      },
    ],

    telefono: String,
    ubicacion: {
      lat: Number,
      lng: Number,
      direccion: String,
      departamento: String,
      pais: String,
    },

    ci: String,
    servicios: [String],

    vehiculo: {
      hasVehiculo: { type: Boolean, default: false },
      tipoVehiculo: String,
    },

    acceptTerms: { type: Boolean, default: false },

    metodoPago: {
      hasEfectivo: { type: Boolean, default: false },
      qr: { type: Boolean, default: false },
      tarjetaCredito: { type: Boolean, default: false },
    },

    workLocation: {
      lat: Number,
      lng: Number,
      direccion: String,
      departamento: String,
      pais: String,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

export const User = models.User || model<IUser>("User", userSchema);