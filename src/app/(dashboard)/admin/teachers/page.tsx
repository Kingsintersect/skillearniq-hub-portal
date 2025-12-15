"use client";

import React from 'react';
import { TeachersPageProvider } from './components/TeachersPageProvider';
import { TeachersPageView } from './components/TeachersPageView';
export default function TeachersPage() {
  return (
    <TeachersPageProvider>
      <TeachersPageView />
    </TeachersPageProvider>
  );
}
