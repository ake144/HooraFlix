import React, { useState, useEffect, useRef } from 'react';
import { FiBell, FiCheck, FiCheckCircle, FiInfo, FiDollarSign, FiUsers } from 'react-icons/fi';
import { notificationAPI } from '../utils/api';
import toast from 'react-hot-toast';
import './NotificationDropdown.css';

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef(null);
    const latestNotificationIdRef = useRef(null);
    const notificationsRef = useRef([]);
    const audioContextRef = useRef(null);
    const hasUserInteractedRef = useRef(false);

    useEffect(() => {
        notificationsRef.current = notifications;
    }, [notifications]);

    useEffect(() => {
        const markInteracted = () => {
            hasUserInteractedRef.current = true;
        };

        window.addEventListener('pointerdown', markInteracted, { passive: true });
        window.addEventListener('keydown', markInteracted);

        return () => {
            window.removeEventListener('pointerdown', markInteracted);
            window.removeEventListener('keydown', markInteracted);
            if (audioContextRef.current) {
                audioContextRef.current.close().catch(() => {});
            }
        };
    }, []);

    useEffect(() => {
        fetchNotifications();

        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        // Polling every 30 seconds
        const intervalId = setInterval(() => {
            fetchNotifications(true);
        }, 30000);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            clearInterval(intervalId);
        };
    }, []);

    const playNotificationTone = async () => {
        if (!hasUserInteractedRef.current) return;

        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;

        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new AudioContextClass();
            }

            const ctx = audioContextRef.current;
            if (ctx.state === 'suspended') {
                await ctx.resume();
            }

            const now = ctx.currentTime;
            const gainNode = ctx.createGain();
            const oscillator = ctx.createOscillator();

            gainNode.gain.setValueAtTime(0.0001, now);
            gainNode.gain.exponentialRampToValueAtTime(0.05, now + 0.015);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(740, now);
            oscillator.frequency.exponentialRampToValueAtTime(980, now + 0.12);
            oscillator.frequency.exponentialRampToValueAtTime(870, now + 0.26);

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.start(now);
            oscillator.stop(now + 0.3);
        } catch {
            // Best effort only: browsers can block playback based on autoplay policy.
        }
    };

    const showNotificationToast = (item) => {
        toast.custom(
            (t) => (
                <div className={`nd-toast ${t.visible ? 'nd-toast-enter' : 'nd-toast-exit'}`}>
                    <div className="nd-toast-icon-wrap">{getIcon(item.type)}</div>
                    <div className="nd-toast-content">
                        <p className="nd-toast-eyebrow">New notification</p>
                        <h4>{item.title}</h4>
                        {item.message ? <p>{item.message}</p> : null}
                    </div>
                </div>
            ),
            {
                id: `notification-${item.id}`,
                duration: 5000,
                position: 'top-right',
            }
        );
    };

    const fetchNotifications = async (isPolling = false) => {
        try {
            const res = await notificationAPI.getNotifications();
            if (res.success) {
                const newNotifications = res.data || [];

                // Check for new notifications to show toast
                if (isPolling && newNotifications.length > 0) {
                    const latestId = newNotifications[0].id;
                    if (latestNotificationIdRef.current && latestNotificationIdRef.current !== latestId) {
                        const existingIds = new Set(notificationsRef.current.map((old) => old.id));
                        const newItems = newNotifications.filter((n) => !existingIds.has(n.id));

                        if (newItems.length > 0) {
                            playNotificationTone();

                            const visibleItems = [...newItems].slice(0, 3).reverse();
                            visibleItems.forEach((item, index) => {
                                setTimeout(() => showNotificationToast(item), index * 180);
                            });

                            if (newItems.length > 3) {
                                toast(`+${newItems.length - 3} more updates`, {
                                    icon: '🔔',
                                    duration: 3500,
                                    style: {
                                        borderRadius: '12px',
                                        background: '#10161f',
                                        color: '#d8e1ee',
                                        border: '1px solid #2a3442',
                                        boxShadow: '0 12px 28px rgba(0,0,0,0.35)',
                                    },
                                });
                            }
                        }
                    }
                    latestNotificationIdRef.current = latestId;
                } else if (!isPolling && newNotifications.length > 0) {
                    latestNotificationIdRef.current = newNotifications[0].id;
                }

                setNotifications(newNotifications);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            if (!isPolling) setLoading(false);
        }
    };

    const handleMarkAsRead = async (id, e) => {
        if (e) e.stopPropagation();
        try {
            await notificationAPI.markAsRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            fetchNotifications();
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const getIcon = (type) => {
        switch (type) {
            case 'REFERRAL': return <FiUsers className="nd-icon referral" />;
            case 'EARNING': return <FiDollarSign className="nd-icon earning" />;
            case 'SYSTEM': return <FiInfo className="nd-icon system" />;
            default: return <FiBell className="nd-icon default" />;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="nd-container" ref={dropdownRef}>
            <button className="fd-icon-btn nd-trigger" type="button" aria-label="Notifications" onClick={toggleDropdown}>
                <FiBell />
                {unreadCount > 0 && <span className="nd-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
            </button>

            {isOpen && (
                <div className="nd-dropdown">
                    <div className="nd-header">
                        <h3>Notifications</h3>
                        {unreadCount > 0 && (
                            <button className="nd-mark-all" onClick={handleMarkAllAsRead}>
                                <FiCheckCircle /> Mark all read
                            </button>
                        )}
                    </div>

                    <div className="nd-list">
                        {loading ? (
                            <div className="nd-empty">Loading...</div>
                        ) : notifications.length > 0 ? (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`nd-item ${!notification.isRead ? 'unread' : ''}`}
                                    onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                                >
                                    <div className="nd-item-icon">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="nd-item-content">
                                        <h4>{notification.title}</h4>
                                        <p>{notification.message}</p>
                                        <span className="nd-time">{formatDate(notification.createdAt)}</span>
                                    </div>
                                    {!notification.isRead && (
                                        <button
                                            className="nd-read-btn"
                                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                                            title="Mark as read"
                                        >
                                            <FiCheck />
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="nd-empty">
                                <FiBell className="nd-empty-icon" />
                                <p>No notifications yet</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
