import { useCallback, useMemo } from 'react';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import type { ParkingEvent, EventFormData, EventStatus } from '../../../types';
import { generateId, generateAccessCode, getEventStatus } from '../../../lib/utils';

const STORAGE_KEY = 'parking-events';

export function useEvents() {
  const [events, setEvents] = useLocalStorage<ParkingEvent[]>(STORAGE_KEY, []);

  const createEvent = useCallback(
    (data: EventFormData): ParkingEvent => {
      const newEvent: ParkingEvent = {
        id: generateId(),
        ...data,
        accessCode: generateAccessCode(),
        status: 'upcoming',
        createdAt: new Date().toISOString(),
      };

      setEvents((prev) => [...prev, newEvent]);
      return newEvent;
    },
    [setEvents]
  );

  const updateEvent = useCallback(
    (id: string, data: Partial<EventFormData>): ParkingEvent | null => {
      let updatedEvent: ParkingEvent | null = null;

      setEvents((prev) =>
        prev.map((event) => {
          if (event.id === id) {
            updatedEvent = { ...event, ...data };
            return updatedEvent;
          }
          return event;
        })
      );

      return updatedEvent;
    },
    [setEvents]
  );

  const deleteEvent = useCallback(
    (id: string): void => {
      setEvents((prev) => prev.filter((event) => event.id !== id));
    },
    [setEvents]
  );

  const cancelEvent = useCallback(
    (id: string): void => {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === id ? { ...event, status: 'cancelled' as const } : event
        )
      );
    },
    [setEvents]
  );

  const getEventById = useCallback(
    (id: string): ParkingEvent | undefined => {
      return events.find((event) => event.id === id);
    },
    [events]
  );

  const getEventByAccessCode = useCallback(
    (accessCode: string): ParkingEvent | undefined => {
      return events.find(
        (event) => event.accessCode.toLowerCase() === accessCode.toLowerCase()
      );
    },
    [events]
  );

  const eventsWithStatus = useMemo((): ParkingEvent[] => {
    return events.map((event) => ({
      ...event,
      status: (event.status === 'cancelled' ? 'cancelled' : getEventStatus(event)) as EventStatus,
    }));
  }, [events]);

  const upcomingEvents = useMemo(() => {
    return eventsWithStatus
      .filter((e) => e.status === 'upcoming')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [eventsWithStatus]);

  const activeEvents = useMemo(() => {
    return eventsWithStatus.filter((e) => e.status === 'active');
  }, [eventsWithStatus]);

  const pastEvents = useMemo(() => {
    return eventsWithStatus
      .filter((e) => e.status === 'completed' || e.status === 'cancelled')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [eventsWithStatus]);

  return {
    events: eventsWithStatus,
    upcomingEvents,
    activeEvents,
    pastEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    cancelEvent,
    getEventById,
    getEventByAccessCode,
  };
}
