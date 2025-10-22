import { Db, ObjectId } from 'mongodb';

export async function getRatingsByFixer(db: Db, fixerId: string) {
  try {
    if (!fixerId) throw new Error('fixerId no proporcionado');

    const cleaned = fixerId.trim();
    let objId: ObjectId | null = null;
    try { objId = new ObjectId(cleaned); } catch { objId = null; }

    const col = db.collection('jobs');

    const resultsObj = objId ? await col.find({ fixerId: objId, rating: { $ne: null } }).toArray() : [];
    const resultsStr = await col.find({ fixerId: cleaned, rating: { $ne: null } }).toArray();

    const map = new Map<string, any>();
    for (const d of resultsObj) map.set(d._id.toString(), d);
    for (const d of resultsStr) map.set(d._id.toString(), d);

    const combined = Array.from(map.values()).sort((a, b) => {
      const ta = new Date(a.createdAt).getTime() || 0;
      const tb = new Date(b.createdAt).getTime() || 0;
      return tb - ta;
    });

    return combined;
  } catch (err) {
    return [];
  }
}
