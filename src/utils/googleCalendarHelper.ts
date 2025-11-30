import { calendar, CALENDAR_ID } from '../config/google.config';

// 1. Interfaces (Tipado estricto)
interface EventParams {
    emails: string[];
    title: string;          // "Servineo Cita"
    description: string;    // Descripción base (Cliente, Teléfono, Problema)
    start: Date;
    end: Date;
    isVirtual: boolean;     
    customLink?: string;    // Siempre presente si isVirtual es true
    locationName?: string;  // Dirección escrita
    locationCoordinates?: { lat: string, lon: string }; // Siempre presente si es presencial
}

export interface CalendarResponse {
    success: boolean;
    eventId?: string | null;
    htmlLink?: string | null;
    error?: unknown;
}

// Estructura para Google API
interface GoogleEventBody {
    summary: string;
    description: string;
    location: string;
    start: { dateTime: string; timeZone: string };
    end: { dateTime: string; timeZone: string };
    attendees: { email: string }[];
    conferenceDataVersion: number;
}

// 2. Corrección de Hora (Bolivia)
const formatTime = (date: Date): string => {
    return date.toISOString().replace('Z', '');
};

// 3. Funciones

// CREAR
export async function sendMeetingInvite(params: EventParams): Promise<CalendarResponse> {
    try {
        if (!calendar) return { success: false, error: "Calendar config missing" };

        let finalLocation = '';
        let finalDescription = params.description; // Empezamos con la descripción base

        // Lógica simplificada: Usamos lo que nos mandan
        if (params.isVirtual) {
            // Virtual: La ubicación es el Link
            finalLocation = params.customLink || '';
            finalDescription += `\n\nLink de Reunion: ${params.customLink}`;
        } else {
            // Presencial: La ubicación es la dirección escrita + Link de Mapa en descripción
            finalLocation = params.locationName || '';
            if (params.locationCoordinates?.lat) {
                const mapLink = `https://www.google.com/maps/search/?api=1&query=${params.locationCoordinates.lat},${params.locationCoordinates.lon}`;
                finalDescription += `\n\nUbicacion GPS: ${mapLink}`;
            }
        }

        const eventBody: GoogleEventBody = {
            summary: params.title,
            description: finalDescription,
            location: finalLocation,
            start: { dateTime: formatTime(new Date(params.start)), timeZone: 'America/La_Paz' },
            end: { dateTime: formatTime(new Date(params.end)), timeZone: 'America/La_Paz' },
            attendees: params.emails.map(email => ({ email })), 
            conferenceDataVersion: 1, 
        };

        const response = await calendar.events.insert({
            calendarId: CALENDAR_ID,
            sendUpdates: 'all',
            conferenceDataVersion: 1,
            requestBody: eventBody,
        });

        console.log(`Evento creado en Google. ID: ${response.data.id}`);

        return { 
            success: true, 
            eventId: response.data.id,
            htmlLink: response.data.htmlLink 
        };

    } catch (error) {
        console.error('Error en sendMeetingInvite:', error);
        return { success: false, error };
    }
}

// ACTUALIZAR (Para cambios de descripción, teléfono o modalidad)
export async function updateMeetingInvite(eventId: string, params: EventParams): Promise<CalendarResponse> {
    try {
        if (!calendar) return { success: false, error: "Calendar config missing" };

        let finalLocation = '';
        let finalDescription = params.description;

        if (params.isVirtual) {
            finalLocation = params.customLink || '';
            finalDescription += `\n\nLink de Reunion: ${params.customLink}`;
        } else {
            finalLocation = params.locationName || '';
            if (params.locationCoordinates?.lat) {
                const mapLink = `https://www.google.com/maps/search/?api=1&query=${params.locationCoordinates.lat},${params.locationCoordinates.lon}`;
                finalDescription += `\n\nUbicacion GPS: ${mapLink}`;
            }
        }

        // Aunque la fecha no cambie, Google pide el objeto de tiempo para validar la zona horaria.
        // Pasaremos la misma fecha que recibimos (la original).
        const eventBody: Partial<GoogleEventBody> = {
            summary: params.title,
            description: finalDescription,
            location: finalLocation,
            start: { dateTime: formatTime(new Date(params.start)), timeZone: 'America/La_Paz' },
            end: { dateTime: formatTime(new Date(params.end)), timeZone: 'America/La_Paz' },
        };

        await calendar.events.patch({
            calendarId: CALENDAR_ID,
            eventId: eventId,
            sendUpdates: 'all', // Notifica los cambios a los invitados
            requestBody: eventBody,
        });

        console.log(`Evento actualizado en Google: ${eventId}`);
        return { success: true };

    } catch (error) {
        console.error('Error en updateMeetingInvite:', error);
        return { success: false, error };
    }
}

// ELIMINAR (Cancelación)
export async function deleteMeetingEvent(eventId: string): Promise<CalendarResponse> {
    try {
        if (!calendar) return { success: false, error: "Calendar config missing" };

        await calendar.events.delete({
            calendarId: CALENDAR_ID,
            eventId: eventId,
            sendUpdates: 'all' // Envía correo de "Cancelado"
        });

        console.log(`Evento eliminado de Google: ${eventId}`);
        return { success: true };

    } catch (error) {
        console.error('Error en deleteMeetingEvent:', error);
        return { success: false, error };
    }
}