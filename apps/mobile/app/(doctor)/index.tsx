import React from 'react';
import { AuthenticatedPlaceholder } from '../../components';

export default function DoctorHomeScreen() {
  return (
    <AuthenticatedPlaceholder
      portalTitle="Doctor Portal"
      portalSubtitle="Manage live queue, schedules, leaves, and prescriptions"
      expectedRole="DOCTOR"
      iconName="stethoscope"
    />
  );
}
