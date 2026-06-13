import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { adminAPI } from '../utils/api';
import { FiPlus, FiTrash2, FiPlay, FiClock, FiTrendingUp, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';

const TrainingManagement = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        duration: '',
        level: 'Beginner',
        description: '',
        focus: '',
        thumbnailUrl: '',
        videoUrl: ''
    });

    const loadCourses = async () => {
        setLoading(true);
        try {
            const res = await adminAPI.getTrainingCourses();
            if (res.success) {
                setCourses(res.data);
            }
        } catch (err) {
            toast.error('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCourses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await adminAPI.createTrainingCourse(formData);
            if (res.success) {
                toast.success('Course created successfully');
                setCourses([res.data, ...courses]);
                setShowForm(false);
                setFormData({
                    title: '',
                    duration: '',
                    level: 'Beginner',
                    description: '',
                    focus: '',
                    thumbnailUrl: '',
                    videoUrl: ''
                });
            }
        } catch (err) {
            toast.error('Failed to create course');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;
        try {
            const res = await adminAPI.deleteTrainingCourse(id);
            if (res.success) {
                toast.success('Course deleted');
                setCourses(courses.filter(c => c.id !== id));
            }
        } catch (err) {
            toast.error('Failed to delete course');
        }
    };

    return (
        <AdminLayout>
            <div className="admin-page-container" style={{ padding: '20px' }}>
                <header className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                        <h1 className="admin-page-title" style={{ fontSize: '24px', margin: 0 }}>Training Center Management</h1>
                        <p className="admin-page-subtitle" style={{ color: '#9ca3af', margin: '5px 0 0' }}>Create and manage training courses for founders.</p>
                    </div>
                    <div className="admin-header-actions" style={{ display: 'flex', gap: '10px' }}>
                        <button className="admin-btn secondary" onClick={loadCourses} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>
                            <FiRefreshCw /> Refresh
                        </button>
                        <button className="admin-btn primary" onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px', background: '#ff6b3d', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>
                            <FiPlus /> {showForm ? 'Cancel' : 'Add New Course'}
                        </button>
                    </div>
                </header>

                {showForm && (
                    <section className="admin-panel admin-form-panel" style={{ background: 'rgba(15,15,18,0.7)', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '14px', color: '#d1d5db' }}>Course Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        placeholder="e.g. How to Promote Films"
                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                    />
                                </div>
                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '14px', color: '#d1d5db' }}>Duration</label>
                                    <input
                                        type="text"
                                        value={formData.duration}
                                        onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                        required
                                        placeholder="e.g. 45 mins"
                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                    />
                                </div>
                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '14px', color: '#d1d5db' }}>Level</label>
                                    <select
                                        value={formData.level}
                                        onChange={e => setFormData({ ...formData, level: e.target.value })}
                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '14px', color: '#d1d5db' }}>Focus</label>
                                    <input
                                        type="text"
                                        value={formData.focus}
                                        onChange={e => setFormData({ ...formData, focus: e.target.value })}
                                        placeholder="e.g. Conversion, Viral, ROI"
                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                    />
                                </div>
                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '14px', color: '#d1d5db' }}>Thumbnail URL</label>
                                    <input
                                        type="text"
                                        value={formData.thumbnailUrl}
                                        onChange={e => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                                        required
                                        placeholder="https://..."
                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                    />
                                </div>
                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '14px', color: '#d1d5db' }}>Video URL (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.videoUrl}
                                        onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
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
                                        placeholder="Describe what founders will learn..."
                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white', minHeight: '80px' }}
                                    />
                                </div>
                            </div>
                            <div className="form-actions" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                                <button type="submit" className="admin-btn primary" style={{ padding: '10px 20px', background: '#ff6b3d', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Create Course</button>
                            </div>
                        </form>
                    </section>
                )}

                <div className="admin-panel" style={{ background: 'rgba(15,15,18,0.7)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                    {loading ? (
                        <p style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>Loading courses...</p>
                    ) : (
                        <div className="admin-table-wrapper" style={{ overflowX: 'auto' }}>
                            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
                                        <th style={{ padding: '15px', color: '#9ca3af', fontWeight: '500' }}>Course</th>
                                        <th style={{ padding: '15px', color: '#9ca3af', fontWeight: '500' }}>Level</th>
                                        <th style={{ padding: '15px', color: '#9ca3af', fontWeight: '500' }}>Duration</th>
                                        <th style={{ padding: '15px', color: '#9ca3af', fontWeight: '500' }}>Focus</th>
                                        <th style={{ padding: '15px', color: '#9ca3af', fontWeight: '500' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map(course => (
                                        <tr key={course.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '15px' }}>
                                                <div className="table-cell-with-icon" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <span className="cell-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', background: 'rgba(255,107,61,0.1)', color: '#ff6b3d', borderRadius: '8px' }}><FiPlay /></span>
                                                    <div>
                                                        <div className="cell-title" style={{ fontWeight: 'bold' }}>{course.title}</div>
                                                        <div className="cell-subtitle" style={{ fontSize: '12px', color: '#9ca3af' }}>{course.description.substring(0, 50)}...</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '15px' }}>
                                                <span className={`status-pill ${course.level.toLowerCase()}`} style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', background: 'rgba(255,255,255,0.1)' }}>{course.level}</span>
                                            </td>
                                            <td style={{ padding: '15px', color: '#d1d5db' }}><FiClock style={{ verticalAlign: 'middle', marginRight: '5px' }} /> {course.duration}</td>
                                            <td style={{ padding: '15px', color: '#d1d5db' }}><FiTrendingUp style={{ verticalAlign: 'middle', marginRight: '5px' }} /> {course.focus}</td>
                                            <td style={{ padding: '15px' }}>
                                                <button className="action-btn delete" onClick={() => handleDelete(course.id)} style={{ background: 'rgba(255,72,72,0.1)', color: '#ff4848', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}>
                                                    <FiTrash2 />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {courses.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-center" style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>No courses found.</td>
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

export default TrainingManagement;
