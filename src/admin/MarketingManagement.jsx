import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { adminAPI } from '../utils/api';
import { FiPlus, FiTrash2, FiDownload, FiImage, FiVideo, FiFileText, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';

const MarketingManagement = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: 'IMAGE',
        icon: '',
        formats: '',
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
            toast.error('Failed to load assets');
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
            const data = {
                ...formData,
                formats: formData.formats.split(',').map(f => f.trim())
            };
            const res = await adminAPI.createMarketingAsset(data);
            if (res.success) {
                toast.success('Asset created successfully');
                setAssets([res.data, ...assets]);
                setShowForm(false);
                setFormData({
                    title: '',
                    type: 'IMAGE',
                    icon: '',
                    formats: '',
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

    const getIcon = (type) => {
        switch (type) {
            case 'VIDEO': return <FiVideo />;
            case 'IMAGE': return <FiImage />;
            case 'PDF': return <FiFileText />;
            default: return <FiDownload />;
        }
    };

    return (
        <AdminLayout>
            <div className="admin-page-container">
                <header className="admin-page-header">
                    <div>
                        <h1 className="admin-page-title">Marketing Library Management</h1>
                        <p className="admin-page-subtitle">Upload and manage marketing materials for founders.</p>
                    </div>
                    <div className="admin-header-actions">
                        <button className="admin-btn secondary" onClick={loadAssets}><FiRefreshCw /> Refresh</button>
                        <button className="admin-btn primary" onClick={() => setShowForm(!showForm)}>
                            <FiPlus /> {showForm ? 'Cancel' : 'Add New Asset'}
                        </button>
                    </div>
                </header>

                {showForm && (
                    <section className="admin-panel admin-form-panel">
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="admin-form-grid">
                                <div className="form-group">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        placeholder="e.g. Poster Pack"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="IMAGE">Image</option>
                                        <option value="VIDEO">Video</option>
                                        <option value="DESIGN">Design</option>
                                        <option value="PDF">PDF</option>
                                        <option value="AUDIO">Audio</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Formats (comma separated)</label>
                                    <input
                                        type="text"
                                        value={formData.formats}
                                        onChange={e => setFormData({ ...formData, formats: e.target.value })}
                                        placeholder="PSD, PNG, JPG"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>File URL</label>
                                    <input
                                        type="text"
                                        value={formData.fileUrl}
                                        onChange={e => setFormData({ ...formData, fileUrl: e.target.value })}
                                        required
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Thumbnail URL</label>
                                    <input
                                        type="text"
                                        value={formData.thumbnailUrl}
                                        onChange={e => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        required
                                        placeholder="Describe the asset..."
                                    />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="admin-btn primary">Create Asset</button>
                            </div>
                        </form>
                    </section>
                )}

                <div className="admin-panel">
                    {loading ? (
                        <p>Loading assets...</p>
                    ) : (
                        <div className="admin-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Asset</th>
                                        <th>Type</th>
                                        <th>Formats</th>
                                        <th>Created At</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assets.map(asset => (
                                        <tr key={asset.id}>
                                            <td>
                                                <div className="table-cell-with-icon">
                                                    <span className="cell-icon">{getIcon(asset.type)}</span>
                                                    <div>
                                                        <div className="cell-title">{asset.title}</div>
                                                        <div className="cell-subtitle">{asset.description.substring(0, 50)}...</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><span className={`status-pill ${asset.type.toLowerCase()}`}>{asset.type}</span></td>
                                            <td>{asset.formats.join(', ')}</td>
                                            <td>{new Date(asset.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <button className="action-btn delete" onClick={() => handleDelete(asset.id)}>
                                                    <FiTrash2 />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {assets.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-center">No assets found.</td>
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
