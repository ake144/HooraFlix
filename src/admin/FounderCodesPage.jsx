import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { adminAPI } from '../utils/api';
import toast from 'react-hot-toast';

const FounderCodesPage = () => {
    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ code: '', maxUses: '' });
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchCodes();
    }, []);

    const fetchCodes = async () => {
        try {
            const res = await adminAPI.getFounderCodes();
            if (res.success) {
                setCodes(res.data || []);
            }
        } catch (error) {
            toast.error('Failed to fetch founder codes');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerateCode = async (e) => {
        e.preventDefault();
        setGenerating(true);
        try {
            const res = await adminAPI.createFounderCode(formData);
            if (res.success) {
                toast.success('Founder code generated successfully!');
                setFormData({ code: '', maxUses: '' });
                fetchCodes();
            } else {
                toast.error(res.message || 'Failed to generate code');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to generate code');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <AdminLayout>
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#f3f5f7' }}>Founder Codes Management</h2>
                <p style={{ margin: '8px 0 0', color: '#97a3b6' }}>Generate and monitor referral codes for founders.</p>
            </div>

            <div className="admin-form-card">
                <h3 style={{ margin: '0 0 20px', fontSize: '18px' }}>Generate New Code</h3>
                <form onSubmit={handleGenerateCode} style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div className="admin-form-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
                        <label htmlFor="code">Custom Code (Optional)</label>
                        <input
                            type="text"
                            id="code"
                            name="code"
                            value={formData.code}
                            onChange={handleInputChange}
                            placeholder="Leave blank for random"
                        />
                    </div>
                    <div className="admin-form-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
                        <label htmlFor="maxUses">Max Uses (Optional)</label>
                        <input
                            type="number"
                            id="maxUses"
                            name="maxUses"
                            value={formData.maxUses}
                            onChange={handleInputChange}
                            placeholder="e.g. 100"
                            min="1"
                        />
                    </div>
                    <button type="submit" className="admin-btn" disabled={generating}>
                        {generating ? 'Generating...' : 'Generate Code'}
                    </button>
                </form>
            </div>

            <div className="admin-table-wrapper">
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#97a3b6' }}>Loading codes...</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Status</th>
                                <th>Uses</th>
                                <th>Max Uses</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {codes.length > 0 ? codes.map(code => (
                                <tr key={code.id}>
                                    <td style={{ fontWeight: '600', color: '#f1c33d' }}>{code.code}</td>
                                    <td>
                                        <span className={`admin-badge ${code.isActive ? 'active' : 'inactive'}`}>
                                            {code.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>{code.usedCount}</td>
                                    <td>{code.maxUses || 'Unlimited'}</td>
                                    <td>{new Date(code.createdAt).toLocaleDateString()}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#97a3b6' }}>
                                        No founder codes found. Generate one above.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </AdminLayout>
    );
};

export default FounderCodesPage;
