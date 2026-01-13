import { useCallback, useMemo } from 'react';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import type { GuestRegistration, RegistrationFormData } from '../../../types';
import { generateId } from '../../../lib/utils';

const STORAGE_KEY = 'parking-registrations';

export function useRegistrations() {
  const [registrations, setRegistrations] = useLocalStorage<GuestRegistration[]>(
    STORAGE_KEY,
    []
  );

  const createRegistration = useCallback(
    (eventId: string, data: RegistrationFormData): GuestRegistration => {
      const newRegistration: GuestRegistration = {
        id: generateId(),
        eventId,
        ...data,
        registeredAt: new Date().toISOString(),
      };

      setRegistrations((prev) => [...prev, newRegistration]);
      return newRegistration;
    },
    [setRegistrations]
  );

  const getRegistrationsByEventId = useCallback(
    (eventId: string): GuestRegistration[] => {
      return registrations.filter((r) => r.eventId === eventId);
    },
    [registrations]
  );

  const getRegistrationById = useCallback(
    (id: string): GuestRegistration | undefined => {
      return registrations.find((r) => r.id === id);
    },
    [registrations]
  );

  const isEmailRegistered = useCallback(
    (eventId: string, email: string): boolean => {
      return registrations.some(
        (r) => r.eventId === eventId && r.email.toLowerCase() === email.toLowerCase()
      );
    },
    [registrations]
  );

  const deleteRegistration = useCallback(
    (id: string): void => {
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
    },
    [setRegistrations]
  );

  const deleteRegistrationsByEventId = useCallback(
    (eventId: string): void => {
      setRegistrations((prev) => prev.filter((r) => r.eventId !== eventId));
    },
    [setRegistrations]
  );

  const registrationCountByEvent = useMemo(() => {
    return registrations.reduce((acc, r) => {
      acc[r.eventId] = (acc[r.eventId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [registrations]);

  return {
    registrations,
    createRegistration,
    getRegistrationsByEventId,
    getRegistrationById,
    isEmailRegistered,
    deleteRegistration,
    deleteRegistrationsByEventId,
    registrationCountByEvent,
  };
}
