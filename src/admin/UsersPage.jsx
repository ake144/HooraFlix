import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { adminAPI } from '../utils/api';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getUsers().then(data => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  return (
    <AdminLayout>
      <h2>Manage Users</h2>
      {loading ? <div>Loading...</div> : (
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
