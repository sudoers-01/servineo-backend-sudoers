import { calendar, CALENDAR_ID } from '../config/google.config';

/**
 * Crea una reunión en Google Calendar y envía invitaciones por correo automáticamente.
 * * @param emails Array de correos a invitar ['juan@test.com', 'maria@test.com']
 * @param title Título del evento
 * @param date Fecha y hora de inicio
 * @param description (Opcional) Descripción del evento
 * @param durationMins (Opcional) Duración en minutos (Default: 60)
 */
export async function sendMeetingInvite(
  emails: string[],
  title: string,
  date: Date,
  description: string,
  durationMins: number = 60,
) {
  try {
    // Validamos que la fecha sea un objeto Date válido
    const start = new Date(date);
    const end = new Date(start.getTime() + durationMins * 60000);

    const response = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      sendUpdates: 'all', // <--- ESTO es lo que envía el correo de invitación
      requestBody: {
        summary: title,
        description: description,
        start: { dateTime: start.toISOString(), timeZone: 'America/La_Paz' },
        end: { dateTime: end.toISOString(), timeZone: 'America/La_Paz' },
        attendees: emails.map((email) => ({ email })), // Convierte ['a@a.com'] en [{email: 'a@a.com'}]
      },
    });

    console.log(`✅ Invitación enviada a: ${emails.join(', ')}`);
    return {
      success: true,
      eventId: response.data.id,
      link: response.data.htmlLink,
    };
  } catch (error) {
    console.error('❌ Error enviando invitación de Google:', error);
    return { success: false, error };
  }
}
