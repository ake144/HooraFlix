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
            <div className="admin-page-container">
                <header className="admin-page-header">
                    <div>
                        <h1 className="admin-page-title">Training Center Management</h1>
                        <p className="admin-page-subtitle">Create and manage training courses for founders.</p>
                    </div>
                    <div className="admin-header-actions">
                        <button className="admin-btn secondary" onClick={loadCourses}><FiRefreshCw /> Refresh</button>
                        <button className="admin-btn primary" onClick={() => setShowForm(!showForm)}>
                            <FiPlus /> {showForm ? 'Cancel' : 'Add New Course'}
                        </button>
                    </div>
                </header>

                {showForm && (
                    <section className="admin-panel admin-form-panel">
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="admin-form-grid">
                                <div className="form-group">
                                    <label>Course Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        placeholder="e.g. How to Promote Films"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Duration</label>
                                    <input
                                        type="text"
                                        value={formData.duration}
                                        onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                        required
                                        placeholder="e.g. 45 mins"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Level</label>
                                    <select
                                        value={formData.level}
                                        onChange={e => setFormData({ ...formData, level: e.target.value })}
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Focus</label>
                                    <input
                                        type="text"
                                        value={formData.focus}
                                        onChange={e => setFormData({ ...formData, focus: e.target.value })}
                                        placeholder="e.g. Conversion, Viral, ROI"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Thumbnail URL</label>
                                    <input
                                        type="text"
                                        value={formData.thumbnailUrl}
                                        onChange={e => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                                        required
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Video URL (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.videoUrl}
                                        onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        required
                                        placeholder="Describe what founders will learn..."
                                    />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="admin-btn primary">Create Course</button>
                            </div>
                        </form>
                    </section>
                )}

                <div className="admin-panel">
                    {loading ? (
                        <p>Loading courses...</p>
                    ) : (
                        <div className="admin-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Course</th>
                                        <th>Level</th>
                                        <th>Duration</th>
                                        <th>Focus</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map(course => (
                                        <tr key={course.id}>
                                            <td>
                                                <div className="table-cell-with-icon">
                                                    <span className="cell-icon"><FiPlay /></span>
                                                    <div>
                                                        <div className="cell-title">{course.title}</div>
                                                        <div className="cell-subtitle">{course.description.substring(0, 50)}...</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><span className={`status-pill ${course.level.toLowerCase()}`}>{course.level}</span></td>
                                            <td><FiClock /> {course.duration}</td>
                                            <td><FiTrendingUp /> {course.focus}</td>
                                            <td>
                                                <button className="action-btn delete" onClick={() => handleDelete(course.id)}>
                                                    <FiTrash2 />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {courses.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-center">No courses found.</td>
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
