// src/mocks/requester.ts

export interface IRequesterMock {
  id: string
  name: string
  email: string
  phone: string
  location: string
}

export const requesterMock: IRequesterMock[] = [
  {
    id: 'r1',
    name: 'Luis Gustavo',
    email: 'luis@example.com',
    phone: '+591 71234567',
    location: 'La Paz, Bolivia',
  },
  {
    id: 'r2',
    name: 'María López',
    email: 'maria@example.com',
    phone: '+591 71234568',
    location: 'Santa Cruz, Bolivia',
  },
  {
    id: 'r3',
    name: 'Carlos Gómez',
    email: 'carlos@example.com',
    phone: '+591 71234569',
    location: 'Cochabamba, Bolivia',
  },
]
