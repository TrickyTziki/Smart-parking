export interface ParkingEvent {
  id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  spotsReserved: number;
  accessCode: string;
  status: EventStatus;
  createdAt: string;
}

export type EventStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';

export interface GuestRegistration {
  id: string;
  eventId: string;
  name: string;
  email: string;
  licensePlate: string;
  registeredAt: string;
}

export interface EventFormData {
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  spotsReserved: number;
}

export interface RegistrationFormData {
  name: string;
  email: string;
  licensePlate: string;
}
