import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Badge, Icon } from '../../../components';
import type { ParkingEvent, GuestRegistration, RegistrationFormData } from '../../../types';
import { formatDate, formatTime } from '../../../lib/utils';
import { RegistrationForm } from './RegistrationForm';
import { Confirmation } from './Confirmation';
import styles from '../../../styles/RegistrationPage.module.css';

interface RegistrationPageProps {
  event: ParkingEvent | null;
  registrationCount: number;
  onRegister: (data: RegistrationFormData) => GuestRegistration;
  isEmailRegistered: (email: string) => boolean;
  isLoading?: boolean;
  error?: string;
}

export function RegistrationPage({
  event,
  registrationCount,
  onRegister,
  isEmailRegistered,
  isLoading = false,
  error,
}: RegistrationPageProps) {
  const [registration, setRegistration] = useState<GuestRegistration | null>(null);

  if (!event) {
    return (
      <div className={styles.container}>
        <Card padding="large" className={styles.errorCard}>
          <div className={styles.errorIcon}>
            <Icon name="alert-circle" size="xl" />
          </div>
          <h1 className={styles.errorTitle}>Event Not Found</h1>
          <p className={styles.errorDescription}>
            {error || 'The event you are looking for does not exist or the access code is invalid.'}
          </p>
        </Card>
      </div>
    );
  }

  const spotsRemaining = event.spotsReserved - registrationCount;
  const isFull = spotsRemaining <= 0;
  const isClosed = event.status === 'cancelled' || event.status === 'completed';

  if (registration) {
    return (
      <div className={styles.container}>
        <Confirmation event={event} registration={registration} />
      </div>
    );
  }

  if (isClosed) {
    return (
      <div className={styles.container}>
        <Card padding="large" className={styles.errorCard}>
          <div className={styles.errorIcon}>
            <Icon name="ban" size="xl" />
          </div>
          <h1 className={styles.errorTitle}>Registration Closed</h1>
          <p className={styles.errorDescription}>
            This event is no longer accepting parking registrations.
          </p>
        </Card>
      </div>
    );
  }

  if (isFull) {
    return (
      <div className={styles.container}>
        <Card padding="large" className={styles.errorCard}>
          <div className={styles.errorIcon}>
            <Icon name="car" size="xl" />
          </div>
          <h1 className={styles.errorTitle}>Parking Full</h1>
          <p className={styles.errorDescription}>
            All parking spots for this event have been reserved. Please contact the event organizer for assistance.
          </p>
        </Card>
      </div>
    );
  }

  const handleSubmit = (data: RegistrationFormData) => {
    const newRegistration = onRegister(data);
    setRegistration(newRegistration);
  };

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={styles.content}
      >
        <div className={styles.header}>
          <div className={styles.logoMark}>
            <Icon name="parking" size="lg" />
          </div>
          <h1 className={styles.title}>Parking Registration</h1>
        </div>

        <Card padding="large" className={styles.eventCard}>
          <div className={styles.eventHeader}>
            <h2 className={styles.eventName}>{event.name}</h2>
            <Badge variant="info">{spotsRemaining} spots left</Badge>
          </div>

          {event.description && (
            <p className={styles.eventDescription}>{event.description}</p>
          )}

          <div className={styles.eventDetails}>
            <div className={styles.eventDetail}>
              <Icon name="calendar" size="sm" />
              <span>{formatDate(event.date)}</span>
            </div>

            <div className={styles.eventDetail}>
              <Icon name="clock" size="sm" />
              <span>
                {formatTime(event.startTime)} - {formatTime(event.endTime)}
              </span>
            </div>

            <div className={styles.eventDetail}>
              <Icon name="location" size="sm" />
              <span>{event.location}</span>
            </div>
          </div>
        </Card>

        <Card padding="large" className={styles.formCard}>
          <h3 className={styles.formTitle}>Register Your Parking</h3>
          <p className={styles.formDescription}>
            Fill in your details to reserve a parking spot for this event.
          </p>
          <RegistrationForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            isEmailRegistered={isEmailRegistered}
          />
        </Card>
      </motion.div>
    </div>
  );
}
