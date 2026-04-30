import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { adminAPI } from '../utils/api';

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  useEffect(() => {
    adminAPI.getPayments().then(setPayments);
  }, []);
  return (
    <AdminLayout>
      <h2>Payments / Coins</h2>
      <ul className="admin-payment-list">
        {payments.map(p => (
          <li key={p.id}>
            <span>User: {p.userEmail}</span>
            <span>Amount: {p.amount}</span>
            <span>Date: {p.date}</span>
          </li>
        ))}
      </ul>
    </AdminLayout>
  );
};

export default PaymentsPage;
