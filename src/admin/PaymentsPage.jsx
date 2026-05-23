import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import './PaymentsPage.css';
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

const initialRules = [
  {
    id: 'rule-founder-launch',
    name: 'Gold founder bonus',
    scopeMode: 'role',
    target: 'Founder / Gold',
    rewardType: 'percentage',
    value: 12,
    stackable: true,
    status: 'Active',
    note: 'Rewards founders at Gold rank during launch campaigns.',
  },
  {
    id: 'rule-rank-climb',
    name: 'Rank climb reward',
    scopeMode: 'rank',
    target: 'Founder / Gold',
    rewardType: 'flat',
    value: 150,
    stackable: false,
    status: 'Active',
    note: 'Fixed bonus for verified rank progression.',
  },
  {
    id: 'rule-unilevel-depth',
    name: 'Unilevel depth reward',
    scopeMode: 'unilevel',
    target: 'Tier 3',
    rewardType: 'percentage',
    value: 4,
    stackable: true,
    status: 'Paused',
    note: 'Distributes earnings through the network tree.',
  },
];

const initialFormData = {
  name: 'Gold founder commission',
  scopeMode: 'rank',
  role: 'FOUNDER',
  rank: 'GOLD',
  offer: 'Launch Pack',
  level: '1',
  rewardType: 'percentage',
  value: '10',
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

const PaymentsPage = () => {
  const [payoutRequests, setPayoutRequests] = useState([]);
  const [commissionRules, setCommissionRules] = useState(initialRules);
  const [formData, setFormData] = useState(initialFormData);
  const [requestFilter, setRequestFilter] = useState('all');
  const [requestStatusMap, setRequestStatusMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [builderMessage, setBuilderMessage] = useState('');
  const [coinDate, setCoinDate] = useState(() => new Date().toISOString().slice(0,10));
  const [coinStats, setCoinStats] = useState({ total: 0, claims: [] });

  const loadPayoutRequests = async () => {
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
        setCommissionRules(backendRules.length > 0 ? backendRules : initialRules);
      }

      // fetch coin claims summary for default date (today) and last 7 days
      try {
        const coinRes = await adminAPI.getCoinClaims();
        if (coinRes.success) {
          // if no date param, backend returns series and recentClaims
          setCoinStats({ series: coinRes.data.series || [], recentClaims: coinRes.data.recentClaims || [], total: (coinRes.data.series && coinRes.data.series.slice(-1)[0]?.total) || 0 });
        }
      } catch (e) {
        // ignore coin stats errors
        console.error('Failed to load coin claims', e);
      }

    } catch (requestError) {
      setError(requestError.message || 'Unable to load commission and payout data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      await loadPayoutRequests();
      if (!active) return;
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  const requestRows = useMemo(
    () =>
      payoutRequests.map((request, index) => ({
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

  const performanceBars = useMemo(() => {
    const sortedRequests = [...requestRows].sort((left, right) => right.amount - left.amount).slice(0, 4);
    const maxAmount = sortedRequests[0]?.amount || 1;

    return sortedRequests.map((request) => ({
      id: request.id,
      label: request.founderEmail,
      amount: request.amount,
      percent: Math.max(8, Math.round((request.amount / maxAmount) * 100)),
    }));
  }, [requestRows]);

  const rulePreview = useMemo(
    () => ({
      name: formData.name.trim() || 'Custom commission rule',
      target: getScopeTarget(formData),
      reward: formData.rewardType === 'percentage' ? `${Number(formData.value) || 0}%` : formatCoins(formData.value),
      payoutMode: formData.rewardType === 'percentage' ? 'Percentage based' : 'Flat amount',
      stackable: formData.stackable ? 'Stackable' : 'Exclusive',
      note: formData.note.trim() || 'No note provided.',
    }),
    [formData],
  );

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
        name: cleanedName,
        scopeMode: formData.scopeMode,
        role: formData.scopeMode === 'role' ? formData.role : null,
        rank: formData.scopeMode === 'rank' ? formData.rank : null,
        offer: formData.scopeMode === 'offer' ? formData.offer : null,
        level: formData.scopeMode === 'unilevel' ? formData.level : null,
        rewardType: formData.rewardType,
        value: cleanedValue,
        stackable: formData.stackable,
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
        ? {
            ...currentRule,
            status: formatApiStatus(response.data.status),
          }
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

      setRequestStatusMap((current) => ({
        ...current,
        [requestId]: updatedStatus,
      }));
    } catch (requestError) {
      setBuilderMessage(requestError.message || 'Unable to update payout status.');
    }
  };

  return (
    <AdminLayout>
      <div className="admin-payments-page">
        <section className="admin-panel admin-payments-hero">
          <div className="admin-payments-hero-copy">
            <p className="admin-panel-kicker">Commission management</p>
            <h2>Build flexible commission rules and track payout requests in one place.</h2>
            <p>
              Configure Gold founder commission rules, then watch payout requests and settlement status update from the same screen.
            </p>

            <div className="admin-payments-hero-actions">
              <button type="button" className="admin-btn admin-payments-refresh-btn" onClick={loadPayoutRequests}>
                <FiRefreshCw />
                Refresh payouts
              </button>
              <div className="admin-payments-hero-note">
                <FiTrendingUp />
                <span>Focused on founder commission setup and payout tracking.</span>
              </div>
            </div>
          </div>
          <div className="admin-payments-coin-stats">
            <div className="admin-payments-coin-stats-row">
              <label className="admin-payments-coin-label">Select date</label>
              <input type="date" value={coinDate} onChange={(e) => setCoinDate(e.target.value)} />
              <button type="button" className="admin-btn" onClick={async () => {
                try {
                  const res = await adminAPI.getCoinClaims(coinDate);
                  if (res.success) setCoinStats({ total: res.data.total || 0, claims: res.data.claims || [], date: res.data.date });
                } catch (err) {
                  console.error('Failed to fetch coin claims for date', err);
                }
              }}>Filter</button>
            </div>

            <div className="admin-payments-coin-summary">
              <small>Coins claimed for {coinStats.date || 'selected date'}</small>
              <strong>{formatCoins(coinStats.total || 0)}</strong>
            </div>
          </div>

          <div className="admin-payments-hero-metrics">
            <article>
              <span><FiLayers /></span>
              <small>Active rules</small>
              <strong>{metrics.activeRules.length}</strong>
            </article>
            <article>
              <span><FiDollarSign /></span>
              <small>Managed coins</small>
              <strong>{formatCoins(metrics.totalManagedCoins)}</strong>
            </article>
            <article>
              <span><FiClock /></span>
              <small>Pending requests</small>
              <strong>{metrics.pendingRequests.length}</strong>
            </article>
            <article>
              <span><FiCheckCircle /></span>
              <small>Approved queue</small>
              <strong>{metrics.approvedRequests.length}</strong>
            </article>
          </div>
        </section>

        {loading ? (
          <div className="admin-payments-empty-state">Loading commission workspace...</div>
        ) : error ? (
          <div className="admin-payments-empty-state admin-payments-empty-state-error">
            <FiActivity />
            <span>{error}</span>
          </div>
        ) : (
          <>
            <section className="admin-payments-grid admin-payments-grid-builder">
              <article className="admin-panel admin-payments-builder-card">
                <div className="admin-panel-header">
                  <div>
                    <p className="admin-panel-kicker">Rule generator</p>
                    <h3>Commission settings</h3>
                  </div>
                  <span className="admin-panel-chip">Code generator style</span>
                </div>

                <form className="admin-payments-builder-form" onSubmit={handleAddRule}>
                  <div className="admin-payments-form-grid">
                    <label className="admin-payments-field">
                      <span>Rule name</span>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={updateFormData}
                        placeholder="Founder growth reward"
                      />
                    </label>

                    <label className="admin-payments-field">
                      <span>Scope</span>
                      <select name="scopeMode" value={formData.scopeMode} onChange={updateFormData}>
                        {scopeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    {formData.scopeMode === 'role' && (
                      <label className="admin-payments-field">
                        <span>Role</span>
                        <select name="role" value={formData.role} onChange={updateFormData}>
                          {roleOptions.map((role) => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}

                    {formData.scopeMode === 'rank' && (
                      <label className="admin-payments-field">
                        <span>Rank</span>
                        <select name="rank" value={formData.rank} onChange={updateFormData}>
                          {rankOptions.map((rank) => (
                            <option key={rank.value} value={rank.value}>
                              {rank.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}

                    {formData.scopeMode === 'offer' && (
                      <label className="admin-payments-field">
                        <span>Offer name</span>
                        <input
                          type="text"
                          name="offer"
                          value={formData.offer}
                          onChange={updateFormData}
                          placeholder="Launch Pack"
                        />
                      </label>
                    )}

                    {formData.scopeMode === 'unilevel' && (
                      <label className="admin-payments-field">
                        <span>Unilevel tier</span>
                        <select name="level" value={formData.level} onChange={updateFormData}>
                          {levelOptions.map((level) => (
                            <option key={level} value={level}>
                              Tier {level}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}

                    <label className="admin-payments-field">
                      <span>Reward type</span>
                      <select name="rewardType" value={formData.rewardType} onChange={updateFormData}>
                        <option value="percentage">Percentage</option>
                        <option value="flat">Flat amount</option>
                      </select>
                    </label>

                    <label className="admin-payments-field">
                      <span>{formData.rewardType === 'percentage' ? 'Percentage value' : 'Flat amount'}</span>
                      <input
                        type="number"
                        name="value"
                        value={formData.value}
                        onChange={updateFormData}
                        min="0"
                        step={formData.rewardType === 'percentage' ? '0.5' : '1'}
                        placeholder={formData.rewardType === 'percentage' ? '12' : '150'}
                      />
                    </label>
                  </div>

                  <label className="admin-payments-switch">
                    <input type="checkbox" name="stackable" checked={formData.stackable} onChange={updateFormData} />
                    <span>
                      <strong>Stackable rule</strong>
                      <small>Allow this commission to combine with related rank or offer rewards.</small>
                    </span>
                  </label>

                  <label className="admin-payments-field">
                    <span>Admin note</span>
                    <textarea
                      name="note"
                      rows="3"
                      value={formData.note}
                      onChange={updateFormData}
                      placeholder="Explain the reward logic or launch campaign goal."
                    />
                  </label>

                  <div className="admin-payments-form-actions">
                    <button type="submit" className="admin-btn admin-payments-save-btn">
                      <FiPlus />
                      Save rule
                    </button>
                    <span className="admin-payments-form-message">{builderMessage || 'Create reusable settings for all commission types.'}</span>
                  </div>
                </form>
              </article>

              <article className="admin-panel admin-payments-preview-card">
                <div className="admin-panel-header">
                  <div>
                    <p className="admin-panel-kicker">Preview</p>
                    <h3>Generated commission policy</h3>
                  </div>
                  <span className="admin-panel-chip">Reusable config</span>
                </div>

                <div className="admin-payments-preview-stack">
                  <div className="admin-payments-preview-card-block">
                    <small>Target</small>
                    <strong>{rulePreview.target}</strong>
                  </div>
                  <div className="admin-payments-preview-card-block">
                    <small>Reward</small>
                    <strong>{rulePreview.reward}</strong>
                  </div>
                  <div className="admin-payments-preview-card-block">
                    <small>Mode</small>
                    <strong>{rulePreview.payoutMode}</strong>
                  </div>
                  <div className="admin-payments-preview-card-block">
                    <small>Stacking</small>
                    <strong>{rulePreview.stackable}</strong>
                  </div>
                </div>

                <div className="admin-payments-code-block">
                  <pre>{JSON.stringify(rulePreview, null, 2)}</pre>
                </div>

                <div className="admin-payments-performance">
                  <div className="admin-panel-header admin-payments-performance-header">
                    <div>
                      <p className="admin-panel-kicker">Performance watch</p>
                      <h3>Revenue signals</h3>
                    </div>
                    <span className="admin-panel-chip">Watching growth</span>
                  </div>

                  <div className="admin-payments-performance-grid">
                    <article>
                      <FiUsers />
                      <small>Top founder</small>
                      <strong>{metrics.topRequest?.founderEmail || 'No payout yet'}</strong>
                    </article>
                    <article>
                      <FiTrendingUp />
                      <small>Average request</small>
                      <strong>{formatCoins(metrics.averageRequest)}</strong>
                    </article>
                    <article>
                      <FiShield />
                      <small>Paid requests</small>
                      <strong>{metrics.paidRequests.length}</strong>
                    </article>
                    <article>
                      <FiClock />
                      <small>Managed queue</small>
                      <strong>{visibleRequests.length}</strong>
                    </article>
                  </div>

                  <div className="admin-payments-bars">
                    {performanceBars.length > 0 ? (
                      performanceBars.map((bar) => (
                        <div key={bar.id} className="admin-payments-bar-row">
                          <div className="admin-payments-bar-labels">
                            <strong>{bar.label}</strong>
                            <span>{formatCoins(bar.amount)}</span>
                          </div>
                          <div className="admin-payments-bar-track">
                            <div className="admin-payments-bar-fill" style={{ width: `${bar.percent}%` }} />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="admin-payments-bars-empty">No payout performance to display yet.</div>
                    )}
                  </div>
                </div>
              </article>
            </section>

            <section className="admin-payments-grid admin-payments-grid-wide">
              <article className="admin-panel admin-payments-table-card">
                <div className="admin-panel-header">
                  <div>
                    <p className="admin-panel-kicker">Commission library</p>
                    <h3>Saved reward rules</h3>
                  </div>
                  <span className="admin-panel-chip">{commissionRules.length} rules</span>
                </div>

                <div className="admin-payments-table-wrap">
                  <table className="admin-payments-table">
                    <thead>
                      <tr>
                        <th>Rule</th>
                        <th>Applies to</th>
                        <th>Reward</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commissionRules.map((rule) => (
                        <tr key={rule.id}>
                          <td>
                            <div className="admin-payments-rule-main">
                              <strong>{rule.name}</strong>
                              <span>{rule.note}</span>
                            </div>
                          </td>
                          <td>
                            <div className="admin-payments-rule-target">
                              <span>{rule.target}</span>
                              <small>{formatEnumLabel(rule.scopeMode)}</small>
                            </div>
                          </td>
                          <td>
                            <span className="admin-payments-amount">{rule.rewardType === 'percentage' ? `${rule.value}%` : formatCoins(rule.value)}</span>
                          </td>
                          <td>
                            <span className={`admin-payments-status-pill admin-payments-status-${rule.status.toLowerCase()}`}>
                              {rule.status}
                            </span>
                          </td>
                          <td>
                            <button type="button" className="admin-payments-link-btn" onClick={() => toggleRuleStatus(rule.id)}>
                              {rule.status === 'Active' ? 'Pause rule' : 'Activate rule'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>

              <article className="admin-panel admin-payments-table-card">
                <div className="admin-panel-header">
                  <div>
                    <p className="admin-panel-kicker">Payout queue</p>
                    <h3>Founder requests</h3>
                  </div>
                  <span className="admin-panel-chip">{requestRows.length} imported</span>
                </div>

                <div className="admin-payments-filter-row" role="tablist" aria-label="Payout filters">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`admin-payments-filter-pill ${requestFilter === option.value ? 'active' : ''}`}
                      onClick={() => setRequestFilter(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="admin-payments-table-wrap">
                  <table className="admin-payments-table">
                    <thead>
                      <tr>
                        <th>Founder</th>
                        <th>Amount</th>
                        <th>Scope</th>
                        <th>Requested</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleRequests.length > 0 ? (
                        visibleRequests.map((request) => (
                          <tr key={request.id}>
                            <td>
                              <div className="admin-payments-founder-cell">
                                <strong>{request.founderEmail}</strong>
                                <span>{request.commissionRuleName} - {formatEnumLabel(request.role)} / {formatEnumLabel(request.rank)}</span>
                              </div>
                            </td>
                            <td>
                              <span className="admin-payments-amount">{formatCoins(request.amount)}</span>
                            </td>
                            <td>
                              <span className="admin-payments-scope-pill">{request.scope}</span>
                            </td>
                            <td>{formatDate(request.date)}</td>
                            <td>
                              <span className={`admin-payments-status-pill admin-payments-status-${request.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                {request.status}
                              </span>
                            </td>
                            <td>
                              <div className="admin-payments-row-actions">
                                {request.status !== 'Paid' && (
                                  <>
                                    {request.status !== 'Approved' && (
                                      <button
                                        type="button"
                                        className="admin-payments-link-btn"
                                        onClick={() => updateRequestStatus(request.id, 'Approved')}
                                      >
                                        Approve
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      className="admin-payments-link-btn"
                                      onClick={() => updateRequestStatus(request.id, 'Paid')}
                                    >
                                      Mark paid
                                    </button>
                                    <button
                                      type="button"
                                      className="admin-payments-link-btn"
                                      onClick={() => updateRequestStatus(request.id, 'On hold')}
                                    >
                                      Hold
                                    </button>
                                  </>
                                )}
                                {request.status === 'Paid' && <span className="admin-payments-complete-label">Settled</span>}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6">
                            <div className="admin-payments-empty-table">No payout requests match the selected filter.</div>
                          </td>
                        </tr>
                      )}
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

export default PaymentsPage;
