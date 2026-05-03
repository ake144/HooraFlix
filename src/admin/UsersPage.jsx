import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { adminAPI } from '../utils/api';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminAPI.getUsers()
      .then((res) => {
        setUsers(res?.data || []);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load users');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AdminLayout>
      <h2>Manage Users</h2>
      {loading ? <div>Loading...</div> : error ? <div>{error}</div> : (
        <ul className="admin-user-list">
          {users.map(u => (
            <li key={u.id}>{u.email} ({u.role})</li>
          ))}
        </ul>
      )}
    </AdminLayout>
  );
};

export default UsersPage;
