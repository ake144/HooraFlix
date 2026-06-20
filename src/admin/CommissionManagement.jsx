import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import './CommissionManagement.css';
import { adminAPI } from '../utils/api';
import {
    FiActivity,
    FiCheckCircle,
    FiClock,
    FiDollarSign,
    FiLayers,
    FiPlus,
    FiRefreshCw,
    FiShield,
    FiTrendingUp,
    FiUsers,
} from 'react-icons/fi';

const initialFormData = {
    name: 'Gold founder commission',
    scopeMode: 'rank',
    role: 'FOUNDER',
    rank: 'GOLD',
    offer: 'Launch Pack',
    level: '1',
    rewardType: 'flat',
    value: '20',
    stackable: true,
    note: 'Set a commission for Gold founder members based on the current model.',
};

const scopeOptions = [
    { value: 'role', label: 'Founder role' },
    { value: 'rank', label: 'Founder rank' },
    { value: 'offer', label: 'Custom offer' },
    { value: 'unilevel', label: 'Unilevel tier' },
];

const roleOptions = [
    { value: 'FOUNDER', label: 'Founder' },
];
const rankOptions = [
    { value: 'GOLD', label: 'Gold' },
    { value:"STARTER", label:"Starter"},
    { value: 'PROMOTER', label: 'Promoter' },
    { value:"PLATINUM", label:"Platinum"},

];
const levelOptions = ['1', '2', '3', '4', '5'];
const filterOptions = [
    { value: 'all', label: 'All requests' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Approved', label: 'Approved' },
    { value: 'On hold', label: 'On hold' },
    { value: 'Paid', label: 'Paid' },
];

const numberFormatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
});

const createRuleId = () => `rule-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const formatCoins = (value) => `${numberFormatter.format(Number(value) || 0)} coins`;

const formatEnumLabel = (value) => {
    if (!value) return 'N/A';
    return String(value)
        .toLowerCase()
        .split(/[_\s-]+/)
        .filter(Boolean)
        .map((part) => part[0].toUpperCase() + part.slice(1))
        .join(' ');
};

const formatApiStatus = (value) => {
    if (!value) return 'Pending';
    const normalized = String(value).toLowerCase();
    if (normalized === 'on_hold' || normalized === 'on-hold') return 'On hold';
    return String(value)
        .toLowerCase()
        .split(/[_\s-]+/)
        .filter(Boolean)
        .map((part) => part[0].toUpperCase() + part.slice(1))
        .join(' ');
};

const getRequestStatus = (index) => {
    if (index % 5 === 0) return 'Pending';
    if (index % 5 === 1) return 'Approved';
    if (index % 5 === 2) return 'On hold';
    if (index % 5 === 3) return 'Paid';
    return 'Pending';
};

const normalizeRequests = (response) => {
    const rows = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
    return rows.map((row, index) => ({
        id: String(row.id ?? `payment-${index}`),
        founderEmail: row.userEmail || 'Unknown founder',
        amount: Number(row.amount) || 0,
        date: row.date,
        scope: row.scope || 'Founder / GOLD',
        role: row.role || 'FOUNDER',
        rank: row.rank || 'GOLD',
        commissionRuleName: row.commissionRuleName || 'Founder Gold commission',
        defaultStatus: formatApiStatus(row.status) || getRequestStatus(index),
    }));
};

const getScopeTarget = (formData) => {
    if (formData.scopeMode === 'role') return `Role: ${formatEnumLabel(formData.role)}`;
    if (formData.scopeMode === 'rank') return `Founder / ${formatEnumLabel(formData.rank)}`;
    if (formData.scopeMode === 'offer') return `Offer: ${formData.offer || 'Custom offer'}`;
    return `Unilevel tier ${formData.level}`;
};

const CommissionManagement = () => {
    const [payoutRequests, setPayoutRequests] = useState([]);
    const [commissionRules, setCommissionRules] = useState([]);
    const [formData, setFormData] = useState(initialFormData);
    const [requestFilter, setRequestFilter] = useState('all');
    const [requestStatusMap, setRequestStatusMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [builderMessage, setBuilderMessage] = useState('');

    const loadData = async () => {
        setLoading(true);
        setError('');
        try {
            const [payoutsResponse, rulesResponse] = await Promise.all([
                adminAPI.getPayouts(),
                adminAPI.getCommissionRules()
            ]);

            const rows = normalizeRequests(payoutsResponse);
            setPayoutRequests(rows);
            setRequestStatusMap(
                rows.reduce((accumulator, request) => {
                    accumulator[request.id] = request.defaultStatus;
                    return accumulator;
                }, {}),
            );

            if (rulesResponse?.data && Array.isArray(rulesResponse.data)) {
                const backendRules = rulesResponse.data.map(rule => ({
                    id: rule.id,
                    name: rule.name,
                    scopeMode: rule.scopeMode.toLowerCase(),
                    target: rule.offer || (rule.rank ? `Founder / ${formatEnumLabel(rule.rank)}` : `Role: ${formatEnumLabel(rule.role)}`),
                    rewardType: rule.rewardType.toLowerCase(),
                    value: rule.value,
                    stackable: rule.stackable,
                    status: formatApiStatus(rule.status),
                    note: rule.note,
                }));
                setCommissionRules(backendRules);
            }
        } catch (requestError) {
            setError(requestError.message || 'Unable to load commission and payout data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const requestRows = useMemo(
        () => payoutRequests.map((request, index) => ({
                ...request,
                status: requestStatusMap[request.id] || request.defaultStatus || getRequestStatus(index),
            })),
        [payoutRequests, requestStatusMap],
    );

    const visibleRequests = useMemo(
        () => (requestFilter === 'all' ? requestRows : requestRows.filter((request) => request.status === requestFilter)),
        [requestFilter, requestRows],
    );

    const metrics = useMemo(() => {
        const totalManagedCoins = requestRows.reduce((sum, request) => sum + request.amount, 0);
        const pendingRequests = requestRows.filter((request) => request.status === 'Pending');
        const approvedRequests = requestRows.filter((request) => request.status === 'Approved');
        const paidRequests = requestRows.filter((request) => request.status === 'Paid');
        const activeRules = commissionRules.filter((rule) => rule.status === 'Active');
        const averageRequest = requestRows.length ? totalManagedCoins / requestRows.length : 0;
        const topRequest = [...requestRows].sort((left, right) => right.amount - left.amount)[0];

        return {
            totalManagedCoins,
            pendingRequests,
            approvedRequests,
            paidRequests,
            activeRules,
            averageRequest,
            topRequest,
        };
    }, [commissionRules, requestRows]);

    const updateFormData = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData((current) => ({
            ...current,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleAddRule = async (event) => {
        event.preventDefault();
        const cleanedName = formData.name.trim();
        const cleanedValue = Number(formData.value);

        if (!cleanedName) {
            setBuilderMessage('Add a rule name before saving the commission setting.');
            return;
        }
        if (!Number.isFinite(cleanedValue) || cleanedValue <= 0) {
            setBuilderMessage('Enter a commission value greater than zero.');
            return;
        }

        try {
            const response = await adminAPI.createCommissionRule({
                name: cleanedName || initialFormData.name,
                scopeMode: formData.scopeMode || initialFormData.scopeMode,
                // role: formData.scopeMode === 'role' ? formData.role : null,
                rank: formData.scopeMode === 'rank' ? formData.rank : null,
                // offer: formData.scopeMode === 'offer' ? formData.offer : null,
                role:initialFormData.role,
                offer:initialFormData.offer,
                level:initialFormData.level,
                // level: formData.scopeMode === 'unilevel' ? formData.level : null,
                rewardType: formData.rewardType || initialFormData.rewardType,
                value: cleanedValue,
                stackable: true,
                note: formData.note.trim() || 'Custom commission created from the admin generator.',
            });

            const createdRule = response?.data
                ? {
                    id: response.data.id,
                    name: response.data.name,
                    scopeMode: response.data.scopeMode.toLowerCase(),
                    target: response.data.offer || (response.data.rank ? `Founder / ${formatEnumLabel(response.data.rank)}` : `Role: ${formatEnumLabel(response.data.role)}`),
                    rewardType: response.data.rewardType.toLowerCase(),
                    value: response.data.value,
                    stackable: response.data.stackable,
                    status: formatApiStatus(response.data.status),
                    note: response.data.note,
                }
                : {
                    id: createRuleId(),
                    name: cleanedName,
                    scopeMode: formData.scopeMode,
                    target: getScopeTarget(formData),
                    rewardType: formData.rewardType,
                    value: cleanedValue,
                    stackable: formData.stackable,
                    status: 'Active',
                    note: formData.note.trim() || 'Custom commission created from the admin generator.',
                };

            setCommissionRules((current) => [createdRule, ...current]);
            setBuilderMessage(`Saved ${createdRule.name} for ${createdRule.target}.`);
        } catch (requestError) {
            setBuilderMessage(requestError.message || 'Unable to save commission rule.');
        }
    };

    const toggleRuleStatus = async (ruleId) => {
        const currentRule = commissionRules.find((rule) => rule.id === ruleId);
        if (!currentRule) return;
        const nextStatus = currentRule.status === 'Active' ? 'PAUSED' : 'ACTIVE';
        try {
            const response = await adminAPI.toggleCommissionRule(ruleId, nextStatus);
            const updatedRule = response?.data
                ? { ...currentRule, status: formatApiStatus(response.data.status) }
                : { ...currentRule, status: nextStatus === 'ACTIVE' ? 'Active' : 'Paused' };
            setCommissionRules((current) => current.map((rule) => (rule.id === ruleId ? updatedRule : rule)));
        } catch (requestError) {
            setBuilderMessage(requestError.message || 'Unable to update rule status.');
        }
    };

    const updateRequestStatus = async (requestId, status) => {
        try {
            const response = await adminAPI.updatePayoutStatus(requestId, status.toUpperCase());
            const updatedStatus = formatApiStatus(response?.data?.status) || status;
            setRequestStatusMap((current) => ({ ...current, [requestId]: updatedStatus }));
        } catch (requestError) {
            setBuilderMessage(requestError.message || 'Unable to update payout status.');
        }
    };

    return (
        <AdminLayout>
            <div className="admin-commissions-page">
                <section className="admin-panel admin-commissions-hero">
                    <div className="admin-commissions-hero-copy">
                        <p className="admin-panel-kicker">Commission Management</p>
                        <h2>Manage user earnings and payout requests.</h2>
                        <p>
                            Configure commission rules for different roles and ranks, and process payout requests from users.
                        </p>
                        <div className="admin-commissions-hero-actions">
                            <button type="button" className="admin-btn" onClick={loadData}>
                                <FiRefreshCw />
                                Refresh Data
                            </button>
                        </div>
                    </div>
                    <div className="admin-commissions-hero-metrics">
                        <article>
                            <span><FiLayers /></span>
                            <small>Active Rules</small>
                            <strong>{metrics.activeRules.length}</strong>
                        </article>
                        <article>
                            <span><FiDollarSign /></span>
                            <small>Total Commissions</small>
                            <strong>{formatCoins(metrics.totalManagedCoins)}</strong>
                        </article>
                        <article>
                            <span><FiClock /></span>
                            <small>Pending Payouts</small>
                            <strong>{metrics.pendingRequests.length}</strong>
                        </article>
                        <article>
                            <span><FiCheckCircle /></span>
                            <small>Approved Queue</small>
                            <strong>{metrics.approvedRequests.length}</strong>
                        </article>
                    </div>
                </section>

                {loading ? (
                    <div className="admin-commissions-empty-state">Loading commission workspace...</div>
                ) : error ? (
                    <div className="admin-commissions-empty-state admin-commissions-empty-state-error">
                        <FiActivity />
                        <span>{error}</span>
                    </div>
                ) : (
                    <>
                        <section className="admin-commissions-grid admin-commissions-grid-builder">
                            <article className="admin-panel admin-commissions-builder-card">
                                <div className="admin-panel-header">
                                    <div>
                                        <p className="admin-panel-kicker">Rule Generator</p>
                                        <h3>Commission Settings</h3>
                                    </div>
                                </div>
                                <form className="admin-commissions-builder-form" onSubmit={handleAddRule}>
                                    <div className="admin-commissions-form-grid">
                                        {/* <label className="admin-commissions-field">
                                            <span>Rule Name</span>
                                            <input type="text" name="name" value={formData.name} onChange={updateFormData} placeholder="Founder growth reward" />
                                        </label> */}
                                        {/* <label className="admin-commissions-field">
                                            <span>Scope</span>
                                            <select name="scopeMode" value={formData.scopeMode} onChange={updateFormData}>
                                                {scopeOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                        </label> */}
                                        {/* {formData.scopeMode === 'role' && (
                                            <label className="admin-commissions-field">
                                                <span>Role</span>
                                                <select name="role" value={formData.role} onChange={updateFormData}>
                                                    {roleOptions.map((role) => (
                                                        <option key={role.value} value={role.value}>{role.label}</option>
                                                    ))}
                                                </select>
                                            </label>
                                        )}
                                    */}
                                        {formData.scopeMode === 'rank' && (
                                            <label className="admin-commissions-field">
                                                <span>Rank</span>
                                                <select name="rank" value={formData.rank} onChange={updateFormData}>
                                                    {rankOptions.map((rank) => (
                                                        <option key={rank.value} value={rank.value}>{rank.label}</option>
                                                    ))}
                                                </select>
                                            </label>
                                        )} 
                                        <label className="admin-commissions-field">
                                            <span>Reward Type</span>
                                            <select name="rewardType" defaultValue={"percentage"} value={formData.rewardType} onChange={updateFormData}>
                                                <option value="percentage">Percentage</option>
                                                <option value="flat">Flat amount</option>
                                            </select>
                                        </label>
                                        <label className="admin-commissions-field">
                                            <span>{formData.rewardType === 'percentage' ? 'Percentage Value' : 'Flat Amount'}</span>
                                            <input type="number" name="value" value={formData.value} onChange={updateFormData} min="0" />
                                        </label>
                                    </div>
                                    {/* <label className="admin-commissions-switch">
                                        <input type="checkbox" name="stackable" checked={formData.stackable} onChange={updateFormData} />
                                        <span>
                                            <strong>Stackable Rule</strong>
                                            <small>Allow this commission to combine with other rewards.</small>
                                        </span>
                                    </label> */}
                                    <div className="admin-commissions-form-actions">
                                        <button type="submit" className="admin-btn admin-commissions-save-btn">
                                            <FiPlus />
                                            Save Rule
                                        </button>
                                        <span className="admin-commissions-form-message">{builderMessage}</span>
                                    </div>
                                </form>
                            </article>

                            <article className="admin-panel admin-commissions-preview-card">
                                <div className="admin-panel-header">
                                    <div>
                                        <p className="admin-panel-kicker">Performance Watch</p>
                                        <h3>Revenue Signals</h3>
                                    </div>
                                </div>
                                <div className="admin-commissions-performance-grid">
                                    <article>
                                        <FiUsers />
                                        <small>Top Earner</small>
                                        <strong>{metrics.topRequest?.founderEmail || 'N/A'}</strong>
                                    </article>
                                    <article>
                                        <FiTrendingUp />
                                        <small>Average Payout</small>
                                        <strong>{formatCoins(metrics.averageRequest)}</strong>
                                    </article>
                                    <article>
                                        <FiShield />
                                        <small>Paid Requests</small>
                                        <strong>{metrics.paidRequests.length}</strong>
                                    </article>
                                    <article>
                                        <FiClock />
                                        <small>Managed Queue</small>
                                        <strong>{visibleRequests.length}</strong>
                                    </article>
                                </div>
                            </article>
                        </section>

                        <section className="admin-commissions-grid admin-commissions-grid-wide">
                            <article className="admin-panel admin-commissions-table-card">
                                <div className="admin-panel-header">
                                    <div>
                                        <p className="admin-panel-kicker">Commission Library</p>
                                        <h3>Saved Reward Rules</h3>
                                    </div>
                                    <span className="admin-panel-chip">{commissionRules.length} rules</span>
                                </div>
                                <div className="admin-commissions-table-wrap">
                                    <table className="admin-commissions-table">
                                        <thead>
                                            <tr>
                                                <th>Rule</th>
                                                <th>Applies To</th>
                                                <th>Reward</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {commissionRules.map((rule) => (
                                                <tr key={rule.id}>
                                                    <td><strong>{rule.name}</strong></td>
                                                    <td>{rule.target}</td>
                                                    <td><span className="admin-commissions-amount">{rule.rewardType === 'percentage' ? `${rule.value}%` : formatCoins(rule.value)}</span></td>
                                                    <td><span className={`admin-commissions-status-pill status-${rule.status.toLowerCase().replace(' ', '-')}`}>{rule.status}</span></td>
                                                    <td>
                                                        <button type="button" className="admin-commissions-link-btn" onClick={() => toggleRuleStatus(rule.id)}>
                                                            {rule.status === 'Active' ? 'Pause' : 'Activate'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </article>

                            <article className="admin-panel admin-commissions-table-card">
                                <div className="admin-panel-header">
                                    <div>
                                        <p className="admin-panel-kicker">Payout Queue</p>
                                        <h3>User Requests</h3>
                                    </div>
                                </div>
                                <div className="admin-commissions-filter-row">
                                    {filterOptions.map((option) => (
                                        <button key={option.value} type="button" className={`admin-commissions-filter-pill ${requestFilter === option.value ? 'active' : ''}`} onClick={() => setRequestFilter(option.value)}>
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="admin-commissions-table-wrap">
                                    <table className="admin-commissions-table">
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {visibleRequests.map((request) => (
                                                <tr key={request.id}>
                                                    <td>{request.founderEmail}</td>
                                                    <td><span className="admin-commissions-amount">{formatCoins(request.amount)}</span></td>
                                                    <td><span className={`admin-commissions-status-pill status-${request.status.toLowerCase().replace(' ', '-')}`}>{request.status}</span></td>
                                                    <td>
                                                        <div className="admin-commissions-row-actions">
                                                            {request.status === 'Pending' && (
                                                                <>
                                                                    <button onClick={() => updateRequestStatus(request.id, 'Approved')}>Approve</button>
                                                                    <button onClick={() => updateRequestStatus(request.id, 'On hold')}>Hold</button>
                                                                </>
                                                            )}
                                                            {request.status === 'Approved' && (
                                                                <button onClick={() => updateRequestStatus(request.id, 'Paid')}>Mark Paid</button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </article>
                        </section>
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default CommissionManagement;
