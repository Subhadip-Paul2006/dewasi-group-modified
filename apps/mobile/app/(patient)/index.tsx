import React from 'react';
import { AuthenticatedPlaceholder } from '../../components';

export default function PatientHomeScreen() {
  return (
    <AuthenticatedPlaceholder
      portalTitle="Patient Portal"
      portalSubtitle="Book appointments, track queues, and view prescriptions"
      expectedRole="PATIENT"
      iconName="user"
    />
  );
}
