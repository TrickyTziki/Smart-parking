import { EventList, useEvents } from '../../features/events';
import { useRegistrations } from '../../features/registration';

export function EventsPage() {
  const { events, createEvent } = useEvents();
  const { registrations } = useRegistrations();

  return (
    <EventList
      events={events}
      registrations={registrations}
      onCreateEvent={createEvent}
    />
  );
}
