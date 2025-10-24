import { Db, ObjectId } from 'mongodb';
import axios from 'axios';
import { JobSummary } from '../model/job.model';

async function geolocateIp(ip?: string): Promise<string> {
  if (!ip) return 'Desconocida';
  try {
    const cleanIp = ip.replace(/^::ffff:/, '');
    const resp = await axios.get(`https://ipapi.co/${cleanIp}/json/`);
    const data = resp.data;
    const parts = [data.city, data.region, data.country_name].filter(Boolean);
    return parts.length ? parts.join(', ') : 'Desconocida';
  } catch (err) {
    console.warn('geolocation failed:', (err as Error).message);
    return 'Desconocida';
  }
}

export async function getJobSummary(db: Db, id: string, clientIp?: string): Promise<JobSummary | null> {
  if (!ObjectId.isValid(id)) return null;
  const _id = new ObjectId(id);

  const job = await db.collection('jobs').findOne(
    { _id },
    { projection: { title: 1, description: 1, createdAt: 1, status: 1 } }
  );

  if (!job) return null;

  const ubicacion = await geolocateIp(clientIp);

  return {
    _id: job._id.toHexString(),
    title: job.title,
    description: job.description,
    createdAt: job.createdAt,
    Ubicacion: ubicacion,
    status: job.status,
  };
}
