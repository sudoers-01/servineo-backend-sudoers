

import userProfileModel, { IUserProfile } from '../models/userProfile.model';
import { User } from '../models/user.model'; // Importamos el modelo de la colección 'users'
import { Request, Response } from 'express';

export const createUserProfile = async (
  req: Request<{}, {}, IUserProfile>,
  res: Response<IUserProfile | { error: string }>
) => {
  try {
    const userProfile = new userProfileModel(req.body);
    await userProfile.save();
    res.status(201).json(userProfile);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getUserProfiles = async (
  _req: Request,
  res: Response<IUserProfile[] | { error: string }>
) => {
  try {
    const profiles = await userProfileModel.find();
    res.json(profiles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBio = async (
  req: Request<{ id: string }, {}, { bio: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { bio } = req.body;
    const updated = await userProfileModel.findOneAndUpdate(
      { 'user.id': id },
      { $set: { 'profile.additionalInfo.bio': bio } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getUsersByRole = async (
  req: Request<{ role: string }>,
  res: Response
) => {
  try {
    const { role } = req.params;
    const users = await userProfileModel.find({ 'user.role': role });
    res.json(users);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
export const convertToFixer = async (
  req: Request<{ id: string }, {}, { profile: any }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { profile } = req.body;

    console.log("Convirtiendo a fixer:", id);

    const updateData: any = {
      role: "fixer", // o "both" si quieres permitir ambos roles
      ci: profile.ci,
      servicios: profile.selectedServiceIds || [],
      vehiculo: profile.vehicle
        ? {
            hasVehiculo: profile.vehicle.hasVehiculo,
            tipoVehiculo: profile.vehicle.type || profile.vehicle.tipoVehiculo,
          }
        : { hasVehiculo: false },

      metodoPago: {
        hasEfectivo: profile.paymentMethods?.some((p: any) => p.type === "cash") || false,
        qr: profile.paymentMethods?.some((p: any) => p.type === "qr") || false,
        tarjetaCredito: profile.paymentMethods?.some((p: any) => p.type === "card") || false,
      },

      acceptTerms: profile.terms?.accepted || false,

      ubicacion: profile.location
        ? {
            lat: profile.location.lat,
            lng: profile.location.lng,
            direccion: profile.location.address || profile.location.direccion,
            departamento: profile.location.departamento,
            pais: profile.location.pais,
          }
        : undefined,

      workLocation: profile.workLocation
        ? {
            lat: profile.workLocation.lat,
            lng: profile.workLocation.lng,
            direccion: profile.workLocation.direccion,
            departamento: profile.workLocation.departamento,
            pais: profile.workLocation.pais,
          }
        : undefined,
    };

    // Limpiar campos undefined
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    console.log("Usuario convertido a fixer exitosamente");
    return res.json({
      message: "Ahora eres fixer!",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Error al convertir a fixer:", error);
    return res.status(500).json({ error: error.message || "Error interno" });
  }
};

