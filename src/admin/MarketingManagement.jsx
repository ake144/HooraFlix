import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { adminAPI } from '../utils/api';
import { FiPlus, FiTrash2, FiFileText, FiImage, FiVideo, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';

const MarketingManagement = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: 'SOCIAL_MEDIA',
        icon: 'FiImage',
        formats: 'PNG, JPG',
        description: '',
        fileUrl: '',
        thumbnailUrl: ''
    });

    const loadAssets = async () => {
        setLoading(true);
        try {
            const res = await adminAPI.getMarketingAssets();
            if (res.success) {
                setAssets(res.data);
            }
        } catch (err) {
            toast.error('Failed to load marketing assets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAssets();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convert formats string to array
            const payload = {
                ...formData,
                formats: formData.formats.split(',').map(f => f.trim())
            };
            const res = await adminAPI.createMarketingAsset(payload);
            if (res.success) {
                toast.success('Asset created successfully');
                setAssets([res.data, ...assets]);
                setShowForm(false);
                setFormData({
                    title: '',
                    type: 'SOCIAL_MEDIA',
                    icon: 'FiImage',
                    formats: 'PNG, JPG',
                    description: '',
                    fileUrl: '',
                    thumbnailUrl: ''
                });
            }
        } catch (err) {
            toast.error('Failed to create asset');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this asset?')) return;
        try {
            const res = await adminAPI.deleteMarketingAsset(id);
            if (res.success) {
                toast.success('Asset deleted');
                setAssets(assets.filter(a => a.id !== id));
            }
        } catch (err) {
            toast.error('Failed to delete asset');
        }
    };

    const getTypeIcon = (iconName) => {
        switch (iconName) {
            case 'FiVideo': return <FiVideo />;
            case 'FiFileText': return <FiFileText />;
            default: return <FiImage />;
        }
    };

    return (
        <AdminLayout>
            <div className="admin-page-container" style={{ padding: '20px' }}>
                <header className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                        <h1 className="admin-page-title" style={{ fontSize: '24px', margin: 0 }}>Marketing Library Management</h1>
                        <p className="admin-page-subtitle" style={{ color: '#9ca3af', margin: '5px 0 0' }}>Upload and manage promotional materials for founders.</p>
                    </div>
                    <div className="admin-header-actions" style={{ display: 'flex', gap: '10px' }}>
                        <button className="admin-btn secondary" onClick={loadAssets} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>
                            <FiRefreshCw /> Refresh
                        </button>
                        <button className="admin-btn primary" onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px', background: '#ff6b3d', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>
                            <FiPlus /> {showForm ? 'Cancel' : 'Add New Asset'}
                        </button>
                    </div>
                </header>

                {showForm && (
                    <section className="admin-panel admin-form-panel" style={{ background: 'rgba(15,15,18,0.7)', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '14px', color: '#d1d5db' }}>Asset Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        placeholder="e.g. Instagram Story Templates"
                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                    />
                                </div>
                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '14px', color: '#d1d5db' }}>Category Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                    >
                                        <option value="SOCIAL_MEDIA">Social Media</option>
                                        <option value="EMAIL_TEMPLATES">Email Templates</option>
                                        <option value="VIDEO_ASSETS">Video Assets</option>
                                        <option value="PRINT_MATERIALS">Print Materials</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '14px', color: '#d1d5db' }}>Icon</label>
                                    <select
                                        value={formData.icon}
                                        onChange={e => setFormData({ ...formData, icon: e.target.value })}
                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                    >
                                        <option value="FiImage">Image Icon</option>
                                        <option value="FiVideo">Video Icon</option>
                                        <option value="FiFileText">Document Icon</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '14px', color: '#d1d5db' }}>Formats (comma separated)</label>
                                    <input
                                        type="text"
                                        value={formData.formats}
                                        onChange={e => setFormData({ ...formData, formats: e.target.value })}
                                        required
                                        placeholder="e.g. PNG, PSD, MP4"
                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                    />
                                </div>
                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '14px', color: '#d1d5db' }}>File URL</label>
                                    <input
                                        type="text"
                                        value={formData.fileUrl}
                                        onChange={e => setFormData({ ...formData, fileUrl: e.target.value })}
                                        required
                                        placeholder="https://..."
                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                    />
                                </div>
                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '14px', color: '#d1d5db' }}>Thumbnail URL (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.thumbnailUrl}
                                        onChange={e => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                                        placeholder="https://..."
                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                    />
                                </div>
                                <div className="form-group full-width" style={{ display: 'flex', flexDirection: 'column', gap: '5px', gridColumn: '1 / -1' }}>
                                    <label style={{ fontSize: '14px', color: '#d1d5db' }}>Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        required
                                        placeholder="Describe the asset..."
                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white', minHeight: '80px' }}
                                    />
                                </div>
                            </div>
                            <div className="form-actions" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                                <button type="submit" className="admin-btn primary" style={{ padding: '10px 20px', background: '#ff6b3d', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Upload Asset</button>
                            </div>
                        </form>
                    </section>
                )}

                <div className="admin-panel" style={{ background: 'rgba(15,15,18,0.7)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                    {loading ? (
                        <p style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>Loading assets...</p>
                    ) : (
                        <div className="admin-table-wrapper" style={{ overflowX: 'auto' }}>
                            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
                                        <th style={{ padding: '15px', color: '#9ca3af', fontWeight: '500' }}>Asset</th>
                                        <th style={{ padding: '15px', color: '#9ca3af', fontWeight: '500' }}>Type</th>
                                        <th style={{ padding: '15px', color: '#9ca3af', fontWeight: '500' }}>Formats</th>
                                        <th style={{ padding: '15px', color: '#9ca3af', fontWeight: '500' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assets.map(asset => (
                                        <tr key={asset.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '15px' }}>
                                                <div className="table-cell-with-icon" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <span className="cell-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', background: 'rgba(255,107,61,0.1)', color: '#ff6b3d', borderRadius: '8px' }}>
                                                        {getTypeIcon(asset.icon)}
                                                    </span>
                                                    <div>
                                                        <div className="cell-title" style={{ fontWeight: 'bold' }}>{asset.title}</div>
                                                        <div className="cell-subtitle" style={{ fontSize: '12px', color: '#9ca3af' }}>{asset.description.substring(0, 50)}...</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '15px' }}>
                                                <span className="status-pill" style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', background: 'rgba(255,255,255,0.1)' }}>
                                                    {asset.type.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td style={{ padding: '15px' }}>
                                                <div style={{ display: 'flex', gap: '5px' }}>
                                                    {asset.formats.map((format, idx) => (
                                                        <span key={idx} style={{ padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '11px', color: '#d1d5db' }}>{format}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td style={{ padding: '15px' }}>
                                                <button className="action-btn delete" onClick={() => handleDelete(asset.id)} style={{ background: 'rgba(255,72,72,0.1)', color: '#ff4848', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}>
                                                    <FiTrash2 />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {assets.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center" style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>No assets found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default MarketingManagement;
