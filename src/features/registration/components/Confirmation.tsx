import { motion } from 'framer-motion';
import { Card, Button, Icon } from '../../../components';
import type { ParkingEvent, GuestRegistration } from '../../../types';
import { formatDate, formatTime } from '../../../lib/utils';
import styles from '../../../styles/Confirmation.module.css';

interface ConfirmationProps {
  event: ParkingEvent;
  registration: GuestRegistration;
}

export function Confirmation({ event, registration }: ConfirmationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={styles.container}
    >
      <div className={styles.successIcon}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <Icon name="check-circle" size="xl" />
        </motion.div>
      </div>

      <h1 className={styles.title}>You're All Set!</h1>
      <p className={styles.subtitle}>
        Your parking spot has been reserved for the event.
      </p>

      <Card className={styles.detailsCard}>
        <h2 className={styles.eventName}>{event.name}</h2>

        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Date</span>
            <span className={styles.detailValue}>{formatDate(event.date)}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Time</span>
            <span className={styles.detailValue}>
              {formatTime(event.startTime)} - {formatTime(event.endTime)}
            </span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Location</span>
            <span className={styles.detailValue}>{event.location}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Registered Name</span>
            <span className={styles.detailValue}>{registration.name}</span>
          </div>

          {registration.licensePlate && (
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>License Plate</span>
              <span className={styles.detailValue}>{registration.licensePlate}</span>
            </div>
          )}
        </div>

        <div className={styles.confirmationCode}>
          <span className={styles.codeLabel}>Confirmation Code</span>
          <span className={styles.code}>{registration.id.split('-')[0]}</span>
        </div>
      </Card>

      <div className={styles.instructions}>
        <h3 className={styles.instructionsTitle}>What's Next?</h3>
        <ul className={styles.instructionsList}>
          <li>A confirmation email has been sent to {registration.email}</li>
          <li>Show this confirmation or your email at the parking entrance</li>
          <li>Arrive at least 15 minutes before the event starts</li>
        </ul>
      </div>

      <Button
        variant="secondary"
        onClick={() => window.print()}
        className={styles.printButton}
      >
        Print Confirmation
      </Button>
    </motion.div>
  );
}
