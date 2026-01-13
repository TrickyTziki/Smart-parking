import type { FormEvent } from 'react';
import { useState } from 'react';
import { Button, Input } from '../../../components';
import type { RegistrationFormData } from '../../../types';
import styles from '../../../styles/RegistrationForm.module.css';

interface RegistrationFormProps {
  onSubmit: (data: RegistrationFormData) => void;
  isLoading?: boolean;
  isEmailRegistered?: (email: string) => boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  licensePlate?: string;
}

export function RegistrationForm({
  onSubmit,
  isLoading = false,
  isEmailRegistered,
}: RegistrationFormProps) {
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    email: '',
    licensePlate: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (isEmailRegistered && isEmailRegistered(formData.email)) {
      newErrors.email = 'This email is already registered for this event';
    }

    if (formData.licensePlate && !/^[A-Z0-9\s-]+$/i.test(formData.licensePlate)) {
      newErrors.licensePlate = 'Please enter a valid license plate';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        licensePlate: formData.licensePlate.toUpperCase(),
      });
    }
  };

  const handleChange = (field: keyof RegistrationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <Input
        label="Full Name"
        placeholder="John Doe"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        error={errors.name}
        required
        autoFocus
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="john.doe@example.com"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        error={errors.email}
        hint="We'll send your parking confirmation to this email"
        required
      />

      <Input
        label="License Plate"
        placeholder="ABC 123"
        value={formData.licensePlate}
        onChange={(e) => handleChange('licensePlate', e.target.value.toUpperCase())}
        error={errors.licensePlate}
        hint="Optional - You can add this later if you don't know it yet"
      />

      <Button type="submit" loading={isLoading} fullWidth size="large">
        Register for Parking
      </Button>
    </form>
  );
}
