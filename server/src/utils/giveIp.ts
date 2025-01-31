import os from 'os';
import express from 'express';

const app = express();

export function getServerIp(): string {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    const interfaceDetails = interfaces[interfaceName];
    if (interfaceDetails) {
      for (const detail of interfaceDetails) {
        if (detail.family === 'IPv4' && !detail.internal) {
          return detail.address;
        }
      }
    }
  }
  return 'localhost'; // Fallback to localhost if no IP is found
}
