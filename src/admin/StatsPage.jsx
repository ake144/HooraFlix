import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { adminAPI } from '../utils/api';

const StatsPage = () => {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    adminAPI.getCodeStats().then(setStats);
  }, []);
  return (
    <AdminLayout>
      <h2>Code Generation Stats</h2>
      <div>{stats ? JSON.stringify(stats) : 'No data'}</div>
    </AdminLayout>
  );
};

export default StatsPage;
