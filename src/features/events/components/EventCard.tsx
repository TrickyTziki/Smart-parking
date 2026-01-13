import { useNavigate } from 'react-router-dom';
import { Card, Badge, Icon } from '../../../components';
import type { ParkingEvent } from '../../../types';
import { formatDate, formatTime } from '../../../lib/utils';
import styles from '../../../styles/EventCard.module.css';

interface EventCardProps {
  event: ParkingEvent;
  registrationCount?: number;
}

const statusConfig = {
  upcoming: { label: 'Upcoming', variant: 'info' as const },
  active: { label: 'Active', variant: 'success' as const },
  completed: { label: 'Completed', variant: 'default' as const },
  cancelled: { label: 'Cancelled', variant: 'danger' as const },
};

export function EventCard({ event, registrationCount = 0 }: EventCardProps) {
  const navigate = useNavigate();
  const status = statusConfig[event.status];

  const handleClick = () => {
    navigate(`/events/${event.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const spotsRemaining = event.spotsReserved - registrationCount;
  const spotsPercentage = (registrationCount / event.spotsReserved) * 100;

  return (
    <Card
      hoverable
      className={styles.card}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${event.name}`}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{event.name}</h3>
        <Badge variant={status.variant} size="small">
          {status.label}
        </Badge>
      </div>

      <div className={styles.details}>
        <div className={styles.detail}>
          <Icon name="calendar" size="sm" className={styles.icon} />
          <span>{formatDate(event.date)}</span>
        </div>

        <div className={styles.detail}>
          <Icon name="clock" size="sm" className={styles.icon} />
          <span>
            {formatTime(event.startTime)} - {formatTime(event.endTime)}
          </span>
        </div>

        <div className={styles.detail}>
          <Icon name="location" size="sm" className={styles.icon} />
          <span>{event.location}</span>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.spotsInfo}>
          <div className={styles.spotsHeader}>
            <span className={styles.spotsLabel}>Parking spots</span>
            <span className={styles.spotsValue}>
              {registrationCount} / {event.spotsReserved}
            </span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${Math.min(spotsPercentage, 100)}%` }}
            />
          </div>
          {spotsRemaining > 0 && (
            <span className={styles.spotsRemaining}>
              {spotsRemaining} available
            </span>
          )}
        </div>
        <div className={styles.viewMore}>
          <span>View details</span>
          <Icon name="chevron-right" size="sm" />
        </div>
      </div>
    </Card>
  );
}
