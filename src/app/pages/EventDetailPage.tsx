import { useParams, useNavigate } from 'react-router-dom';
import { EventDetail, useEvents } from '../../features/events';
import { useRegistrations } from '../../features/registration';
import { Card, EmptyState, Button, Icon } from '../../components';

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEventById, updateEvent, cancelEvent, deleteEvent } = useEvents();
  const { getRegistrationsByEventId, deleteRegistrationsByEventId } = useRegistrations();

  const event = id ? getEventById(id) : undefined;
  const registrations = id ? getRegistrationsByEventId(id) : [];

  if (!event) {
    return (
      <Card>
        <EmptyState
          icon={<Icon name="alert-circle" size="xl" />}
          title="Event not found"
          description="The event you're looking for doesn't exist or has been deleted."
          action={
            <Button onClick={() => navigate('/')}>Back to Events</Button>
          }
        />
      </Card>
    );
  }

  const handleUpdate = (data: Parameters<typeof updateEvent>[1]) => {
    if (id) {
      updateEvent(id, data);
    }
  };

  const handleCancel = () => {
    if (id) {
      cancelEvent(id);
    }
  };

  const handleDelete = () => {
    if (id) {
      deleteRegistrationsByEventId(id);
      deleteEvent(id);
    }
  };

  return (
    <EventDetail
      event={event}
      registrations={registrations}
      onUpdate={handleUpdate}
      onCancel={handleCancel}
      onDelete={handleDelete}
    />
  );
}
