import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { adminAPI } from '../utils/api';
import { FiAlertCircle, FiCalendar, FiSearch, FiShield, FiUser, FiUsers, FiLayers, FiStar, FiRefreshCw } from 'react-icons/fi';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

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

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return users;

    return users.filter((user) => {
      const referredByName = user?.referredBy?.founder?.user?.name || '';
      const referredByEmail = user?.referredBy?.founder?.user?.email || '';
      return [user?.name, user?.email, user?.role, referredByName, referredByEmail]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery));
    });
  }, [users, query]);

  const stats = useMemo(() => {
    const total = users.length;
    const founders = users.filter((user) => user.role === 'FOUNDER' || user.isFounder).length;
    const referrals = users.filter((user) => user.referredBy).length;
    const activeUsers = users.filter((user) => user.role !== 'ADMIN').length;

    return [
      { label: 'Total Users', value: total, icon: <FiUsers /> },
      { label: 'Founders', value: founders, icon: <FiShield /> },
      { label: 'Referred Users', value: referrals, icon: <FiStar /> },
      { label: 'Active Accounts', value: activeUsers, icon: <FiLayers /> },
    ];
  }, [users]);

  const formatDate = (value) => {
    if (!value) return 'N/A';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'N/A';

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const getRoleTone = (role) => {
    if (role === 'ADMIN') return 'admin';
    if (role === 'FOUNDER') return 'founder';
    return 'user';
  };

  const getInitials = (name, email) => {
    const source = name || email || '?';
    return source
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <AdminLayout>
      <div className="admin-users-page">
        <section className="admin-users-hero">
          <div>
            <p className="admin-panel-kicker">User management</p>
            <h2>Users overview</h2>
            <p>Track user identity, referral source, role, and creation date from one clean control surface.</p>
          </div>

          <div className="admin-users-hero-actions">
            <label className="admin-users-search" aria-label="Search users">
              <FiSearch />
              <input
                type="search"
                placeholder="Search by name, email, role, or referrer..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>

            <button type="button" className="admin-users-refresh-btn" onClick={() => window.location.reload()}>
              <FiRefreshCw />
              Refresh
            </button>
          </div>
        </section>

        <section className="admin-users-stats-grid" aria-label="Users summary">
          {stats.map((stat) => (
            <article key={stat.label} className="admin-users-stat-card">
              <span className="admin-users-stat-icon">{stat.icon}</span>
              <div>
                <small>{stat.label}</small>
                <strong>{stat.value}</strong>
              </div>
            </article>
          ))}
        </section>

        {loading ? (
          <div className="admin-users-state">Loading users...</div>
        ) : error ? (
          <div className="admin-users-state admin-users-state-error">
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        ) : (
          <section className="admin-users-panel">
            <div className="admin-panel-header">
              <div>
                <p className="admin-panel-kicker">Directory</p>
                <h3>
                  {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
                </h3>
              </div>
              <span className="admin-panel-chip">Sorted by newest</span>
            </div>

            <div className="admin-users-table-wrap">
              <table className="admin-users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th>Referred by</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const referrerName = user?.referredBy?.founder?.user?.name;
                    const referrerEmail = user?.referredBy?.founder?.user?.email;
                    const referrerLabel = referrerName || referrerEmail || 'Direct signup';

                    return (
                      <tr key={user.id}>
                        <td>
                          <div className="admin-user-main">
                            <div className="admin-user-avatar">{getInitials(user.name, user.email)}</div>
                            <div>
                              <strong>{user.name || 'Unnamed user'}</strong>
                              <span>ID: {user.id}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="admin-user-email-cell">
                            <span>{user.email}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`admin-user-role admin-user-role-${getRoleTone(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <div className="admin-user-date">
                            <FiCalendar />
                            <span>{formatDate(user.createdAt)}</span>
                          </div>
                        </td>
                        <td>
                          <div className="admin-user-referrer">
                            <strong>{referrerLabel}</strong>
                            <span>{user?.referredBy?.status || 'No referral data'}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && <div className="admin-users-empty">No users match your search.</div>}
          </section>
        )}
      </div>
    </AdminLayout>
  );
};

export default UsersPage;
