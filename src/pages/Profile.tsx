
import React from 'react';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';

const Profile = () => {
  const { unifiedUser } = useUnifiedAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profil</h1>
      <p>Email: {unifiedUser?.email}</p>
      <p>Role: {unifiedUser?.role}</p>
      <p>Status: {unifiedUser?.status}</p>
    </div>
  );
};

export default Profile;
