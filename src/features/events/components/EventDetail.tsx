import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Card, Badge, Modal, EmptyState, Icon } from '../../../components';
import type { ParkingEvent, EventFormData, GuestRegistration } from '../../../types';
import { formatDate, formatTime } from '../../../lib/utils';
import { EventForm } from './EventForm';
import { ShareModal } from './ShareModal';
import styles from '../../../styles/EventDetail.module.css';

interface EventDetailProps {
  event: ParkingEvent;
  registrations: GuestRegistration[];
  onUpdate: (data: Partial<EventFormData>) => void;
  onCancel: () => void;
  onDelete: () => void;
}

const statusConfig = {
  upcoming: { label: 'Upcoming', variant: 'info' as const },
  active: { label: 'Active', variant: 'success' as const },
  completed: { label: 'Completed', variant: 'default' as const },
  cancelled: { label: 'Cancelled', variant: 'danger' as const },
};

export function EventDetail({
  event,
  registrations,
  onUpdate,
  onCancel,
  onDelete,
}: EventDetailProps) {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const status = statusConfig[event.status];
  const spotsRemaining = event.spotsReserved - registrations.length;
  const isEditable = event.status === 'upcoming';

  const handleUpdate = (data: EventFormData) => {
    onUpdate(data);
    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    onDelete();
    navigate('/');
  };

  const handleCancel = () => {
    onCancel();
    setIsCancelModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.backButton}
        onClick={() => navigate('/')}
      >
        <Icon name="arrow-left" size="sm" />
        Back to Events
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card padding="large">
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <div className={styles.titleRow}>
                <h1 className={styles.title}>{event.name}</h1>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>
              {event.description && (
                <p className={styles.description}>{event.description}</p>
              )}
            </div>

            {isEditable && (
              <div className={styles.actions}>
                <Button
                  variant="secondary"
                  onClick={() => setIsShareModalOpen(true)}
                >
                  <Icon name="share" size="sm" />
                  Share
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Icon name="edit" size="sm" />
                  Edit
                </Button>
              </div>
            )}
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <Icon name="calendar" size="md" />
              </div>
              <div>
                <span className={styles.infoLabel}>Date</span>
                <span className={styles.infoValue}>{formatDate(event.date)}</span>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <Icon name="clock" size="md" />
              </div>
              <div>
                <span className={styles.infoLabel}>Time</span>
                <span className={styles.infoValue}>
                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                </span>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <Icon name="location" size="md" />
              </div>
              <div>
                <span className={styles.infoLabel}>Location</span>
                <span className={styles.infoValue}>{event.location}</span>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <Icon name="car" size="md" />
              </div>
              <div>
                <span className={styles.infoLabel}>Parking Spots</span>
                <span className={styles.infoValue}>
                  {registrations.length} / {event.spotsReserved} registered
                  {spotsRemaining > 0 && (
                    <span className={styles.spotsRemaining}>
                      ({spotsRemaining} available)
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card padding="large" className={styles.registrationsCard}>
          <h2 className={styles.sectionTitle}>Registered Guests</h2>

          {registrations.length === 0 ? (
            <EmptyState
              icon={<Icon name="users" size="xl" />}
              title="No registrations yet"
              description="Share the event link with your guests to let them register for parking."
              action={
                isEditable && (
                  <Button onClick={() => setIsShareModalOpen(true)}>
                    Share Event
                  </Button>
                )
              }
            />
          ) : (
            <div className={styles.registrationsList}>
              <div className={styles.registrationsHeader}>
                <span>Guest</span>
                <span>License Plate</span>
                <span>Registered</span>
              </div>
              {registrations.map((registration) => (
                <div key={registration.id} className={styles.registrationRow}>
                  <div className={styles.guestInfo}>
                    <span className={styles.guestName}>
                      {registration.name || 'Anonymous'}
                    </span>
                    <span className={styles.guestEmail}>{registration.email}</span>
                  </div>
                  <span className={styles.licensePlate}>
                    {registration.licensePlate || '—'}
                  </span>
                  <span className={styles.registeredAt}>
                    {new Date(registration.registeredAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {isEditable && (
          <div className={styles.dangerZone}>
            <h3 className={styles.dangerTitle}>Danger Zone</h3>
            <p className={styles.dangerDescription}>
              These actions are irreversible. Please proceed with caution.
            </p>
            <div className={styles.dangerActions}>
              <Button
                variant="secondary"
                onClick={() => setIsCancelModalOpen(true)}
              >
                Cancel Event
              </Button>
              <Button
                variant="danger"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <Icon name="trash" size="sm" />
                Delete Event
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Event"
        size="medium"
      >
        <EventForm
          initialData={event}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        event={event}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Event"
        size="small"
      >
        <div className={styles.confirmModal}>
          <p>
            Are you sure you want to delete this event? This action cannot be
            undone and all registration data will be lost.
          </p>
          <div className={styles.confirmActions}>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Keep Event
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Event
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Event"
        size="small"
      >
        <div className={styles.confirmModal}>
          <p>
            Are you sure you want to cancel this event? Guests will no longer be
            able to register.
          </p>
          <div className={styles.confirmActions}>
            <Button
              variant="secondary"
              onClick={() => setIsCancelModalOpen(false)}
            >
              Keep Event
            </Button>
            <Button variant="danger" onClick={handleCancel}>
              Cancel Event
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
