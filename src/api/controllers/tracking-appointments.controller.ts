import { Request, Response } from 'express';
// ⚠️ Verifica que estas rutas a tus modelos sean correctas
import Appointment from '../../models/appointment.model';
import { User } from '../../models/user.model'; 

// --- ENDPOINT 1: MAPA ---
export const getMapLocations = async (req: Request, res: Response) => {
  try {
    // 1. Buscar Citas con coordenadas válidas
    const appointments = await Appointment.find({
      lat: { $nin: [null, ''] },
      lon: { $nin: [null, ''] }
    }).lean();

    // 2. Obtener Nombres de los Fixers
    let userMap: Record<string, string> = {};
    
    try {
      if (appointments.length > 0) {
          const fixerIds = [...new Set(appointments.map((app: any) => app.id_fixer))];
          // Filtramos IDs válidos
          const validIds = fixerIds.filter(id => id && typeof id === 'string');

          if (validIds.length > 0) {
             // Buscamos en la colección Users
             const users = await User.find({ _id: { $in: validIds } }).select('_id name');
             users.forEach((user: any) => {
                userMap[user._id.toString()] = user.name;
             });
          }
      }
    } catch (error) {
      console.error("⚠️ Error cargando nombres de fixers:", error);
    }

    // 3. Mapear respuesta
    const mappedAppointments = appointments.map((appointment: any) => ({
      _id: appointment._id,
      lat: appointment.lat,
      lon: appointment.lon,
      status: appointment.schedule_state,
      // Usamos el nombre real si existe
      fixerName: userMap[appointment.id_fixer] || 'Fixer Desconocido', 
      requesterName: appointment.current_requester_name,
      date: appointment.starting_time
    }));

    res.json(mappedAppointments);

  } catch (error) {
    console.error('❌ Error en getMapLocations:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// --- ENDPOINT 2: MÉTRICAS ---
export const getTrackingMetrics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    let matchStage: any = {};

    if (startDate || endDate) {
      matchStage.starting_time = {};
      if (startDate) matchStage.starting_time.$gte = new Date(startDate as string);
      if (endDate) {
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59);
        matchStage.starting_time.$lte = end;
      }
    }

    const metrics = await Appointment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$schedule_state', 'booked'] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ['$schedule_state', 'cancelled'] }, 1, 0] } }
        }
      }
    ]);

    const result = metrics[0] || { total: 0, active: 0, cancelled: 0 };
    res.json(result);

  } catch (error) {
    console.error('❌ Error en getTrackingMetrics:', error);
    res.status(500).json({ error: 'Error calculando métricas' });
  }
};