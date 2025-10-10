import dotenv from 'dotenv';

dotenv.config();

export const SERVER_PORT = process.env.SERVER_PORT || 3000;
export const LOCATIONIQ_TOKEN = process.env.LOCATIONIQ_TOKEN as string;
