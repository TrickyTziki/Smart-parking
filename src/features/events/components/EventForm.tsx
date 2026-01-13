import type { FormEvent } from 'react';
import { useState } from 'react';
import { Button, Input, Textarea } from '../../../components';
import type { EventFormData, ParkingEvent } from '../../../types';
import styles from '../../../styles/EventForm.module.css';

interface EventFormProps {
  initialData?: ParkingEvent;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface FormErrors {
  name?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  spotsReserved?: string;
}

export function EventForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    date: initialData?.date || '',
    startTime: initialData?.startTime || '',
    endTime: initialData?.endTime || '',
    location: initialData?.location || '',
    spotsReserved: initialData?.spotsReserved || 20,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Event name is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today && !initialData) {
        newErrors.date = 'Date cannot be in the past';
      }
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    } else if (formData.startTime && formData.endTime <= formData.startTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (formData.spotsReserved < 1) {
      newErrors.spotsReserved = 'At least 1 spot is required';
    } else if (formData.spotsReserved > 500) {
      newErrors.spotsReserved = 'Maximum 500 spots allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (
    field: keyof EventFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <Input
        label="Event Name"
        placeholder="e.g., Annual Board Meeting"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        error={errors.name}
        required
        autoFocus
      />

      <Textarea
        label="Description"
        placeholder="Brief description of the event (optional)"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        rows={3}
      />

      <div className={styles.row}>
        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
          error={errors.date}
          required
        />

        <Input
          label="Location"
          placeholder="e.g., Building A, Main Entrance"
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          error={errors.location}
          required
        />
      </div>

      <div className={styles.row}>
        <Input
          label="Start Time"
          type="time"
          value={formData.startTime}
          onChange={(e) => handleChange('startTime', e.target.value)}
          error={errors.startTime}
          required
        />

        <Input
          label="End Time"
          type="time"
          value={formData.endTime}
          onChange={(e) => handleChange('endTime', e.target.value)}
          error={errors.endTime}
          required
        />
      </div>

      <Input
        label="Parking Spots to Reserve"
        type="number"
        min={1}
        max={500}
        value={formData.spotsReserved}
        onChange={(e) => handleChange('spotsReserved', parseInt(e.target.value, 10) || 0)}
        error={errors.spotsReserved}
        hint="How many parking spots should be reserved for guests?"
        required
      />

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isLoading}>
          {initialData ? 'Save Changes' : 'Create Event'}
        </Button>
      </div>
    </form>
  );
}
