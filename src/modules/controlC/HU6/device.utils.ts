// src/modules/controlC/HU6/device.utils.ts
//Cuando el usuario hace login, vamos a detectar el dispositivo y browser usando ua-parser-js:
import UAParser from 'ua-parser-js';

export const parseDevice = (userAgent: string) => {
  // CORRECCIÓN: Usar 'new' para instanciar el parser.
  const parser = new UAParser(userAgent);

  const os = parser.getOS();
  const browser = parser.getBrowser();
  const device = parser.getDevice();

  let type: 'desktop' | 'tablet' | 'mobile' = 'desktop';

  if (device.type === 'mobile') type = 'mobile';
  else if (device.type === 'tablet') type = 'tablet';

  return {
    type,
    os: os.name || 'Desconocido',
    browser: browser.name || 'Desconocido',
    deviceName: device.model || os.name || 'Dispositivo',
  };
};
