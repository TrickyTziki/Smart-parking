import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, EmptyState, Modal, Icon } from '../../../components';
import type { ParkingEvent, EventFormData, GuestRegistration } from '../../../types';
import { EventCard } from './EventCard';
import { EventForm } from './EventForm';
import styles from '../../../styles/EventList.module.css';

interface EventListProps {
  events: ParkingEvent[];
  registrations: GuestRegistration[];
  onCreateEvent: (data: EventFormData) => void;
}

export function EventList({ events, registrations, onCreateEvent }: EventListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const upcomingEvents = events.filter(
    (e) => e.status === 'upcoming' || e.status === 'active'
  );
  const pastEvents = events.filter(
    (e) => e.status === 'completed' || e.status === 'cancelled'
  );

  const filterEvents = (eventList: ParkingEvent[]) => {
    let filtered = eventList;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((event) =>
        event.name.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        (event.description && event.description.toLowerCase().includes(query))
      );
    }

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter((event) => event.date === dateFilter);
    }

    return filtered;
  };

  const filteredUpcoming = useMemo(
    () => filterEvents(upcomingEvents),
    [upcomingEvents, searchQuery, dateFilter]
  );

  const filteredPast = useMemo(
    () => filterEvents(pastEvents),
    [pastEvents, searchQuery, dateFilter]
  );

  const displayedEvents = activeTab === 'upcoming' ? filteredUpcoming : filteredPast;
  const isFiltering = searchQuery.trim().length > 0 || dateFilter.length > 0;

  const clearFilters = () => {
    setSearchQuery('');
    setDateFilter('');
  };

  const getRegistrationCount = (eventId: string) => {
    return registrations.filter((r) => r.eventId === eventId).length;
  };

  const handleCreateEvent = (data: EventFormData) => {
    onCreateEvent(data);
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Parking Events</h1>
          <p className={styles.subtitle}>
            Manage parking reservations for your events
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Icon name="plus" size="sm" />
          New Event
        </Button>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <div className={styles.searchWrapper}>
            <Icon name="search" size="sm" className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by name, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              aria-label="Search events"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className={styles.clearButton}
                aria-label="Clear search"
              >
                <Icon name="x" size="xs" />
              </button>
            )}
          </div>

          <div className={styles.dateWrapper}>
            <Icon name="calendar" size="sm" className={styles.dateIcon} />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className={styles.dateInput}
              aria-label="Filter by date"
            />
            {dateFilter && (
              <button
                type="button"
                onClick={() => setDateFilter('')}
                className={styles.clearButton}
                aria-label="Clear date filter"
              >
                <Icon name="x" size="xs" />
              </button>
            )}
          </div>
        </div>

        <div className={styles.tabs} role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'upcoming'}
            className={`${styles.tab} ${activeTab === 'upcoming' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            <span className={styles.tabLabel}>Upcoming</span>
            <span className={styles.tabCount}>{filteredUpcoming.length}</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'past'}
            className={`${styles.tab} ${activeTab === 'past' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('past')}
          >
            <span className={styles.tabLabel}>Past</span>
            <span className={styles.tabCount}>{filteredPast.length}</span>
          </button>
        </div>
      </div>

      <div className={styles.content} role="tabpanel">
        {displayedEvents.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Icon name={isFiltering ? 'search' : 'calendar'} size="xl" />}
              title={
                isFiltering
                  ? 'No events found'
                  : activeTab === 'upcoming'
                    ? 'No upcoming events'
                    : 'No past events'
              }
              description={
                isFiltering
                  ? `No ${activeTab} events match your filters. Try adjusting your search or date.`
                  : activeTab === 'upcoming'
                    ? 'Create your first event to start reserving parking spots for guests.'
                    : 'Past events will appear here once they are completed.'
              }
              action={
                isFiltering ? (
                  <Button variant="secondary" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                ) : (
                  activeTab === 'upcoming' && (
                    <Button onClick={() => setIsModalOpen(true)}>
                      Create Event
                    </Button>
                  )
                )
              }
            />
          </Card>
        ) : (
          <motion.div className={styles.grid} layout>
            <AnimatePresence mode="popLayout">
              {displayedEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  <EventCard
                    event={event}
                    registrationCount={getRegistrationCount(event.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Event"
        size="medium"
      >
        <EventForm
          onSubmit={handleCreateEvent}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
