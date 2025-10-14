// src/mocks/requester.ts

export interface IRequesterMock {
  id: string
  nombre: string
  correo: string
  telefono: string
  ubicacion: string
}

export const requesterMock: IRequesterMock[] = [
  {
    id: 'r1',
    nombre: 'Luis Gustavo García',
    correo: 'luis.garcia@example.com',
    telefono: '+591 71234567',
    ubicacion: 'La Paz, Bolivia',
  },
  {
    id: 'r2',
    nombre: 'María Fernanda López',
    correo: 'maria.fernanda@example.com',
    telefono: '+591 71239876',
    ubicacion: 'Santa Cruz de la Sierra, Bolivia',
  },
  {
    id: 'r3',
    nombre: 'Carlos Gómez Rojas',
    correo: 'carlos.gomez@example.com',
    telefono: '+591 71325489',
    ubicacion: 'Cochabamba, Bolivia',
  },
  {
    id: 'r4',
    nombre: 'Andrea Vargas',
    correo: 'andrea.vargas@example.com',
    telefono: '+591 71547896',
    ubicacion: 'Sucre, Bolivia',
  },
  {
    id: 'r5',
    nombre: 'Jorge Ramírez',
    correo: 'jorge.ramirez@example.com',
    telefono: '+591 71658974',
    ubicacion: 'Tarija, Bolivia',
  },
]
