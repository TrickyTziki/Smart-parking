import { useParams } from 'react-router-dom';
import { RegistrationPage, useRegistrations } from '../../features/registration';
import { useEvents } from '../../features/events';

export function RegisterPage() {
  const { accessCode } = useParams<{ accessCode: string }>();
  const { getEventByAccessCode } = useEvents();
  const { createRegistration, isEmailRegistered, getRegistrationsByEventId } = useRegistrations();

  const event = accessCode ? getEventByAccessCode(accessCode) ?? null : null;
  const registrationCount = event ? getRegistrationsByEventId(event.id).length : 0;

  const handleRegister = (data: Parameters<typeof createRegistration>[1]) => {
    if (event) {
      return createRegistration(event.id, data);
    }
    throw new Error('Event not found');
  };

  const checkEmailRegistered = (email: string) => {
    if (event) {
      return isEmailRegistered(event.id, email);
    }
    return false;
  };

  return (
    <RegistrationPage
      event={event}
      registrationCount={registrationCount}
      onRegister={handleRegister}
      isEmailRegistered={checkEmailRegistered}
    />
  );
}
