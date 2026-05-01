import React from "react";
import "./CommissionTierSection.css";

const tiers = [
  {
    name: "Starter",
    badge: "Entry Level",
    badgeClass: "",
    sub: "Perfect for beginning your journey with Hooraflix.",
    features: [
      { label: "Direct Referral", value: "10%" },
      { label: "PPV Sales", value: "5%" },
      { label: "Subscription Sales", value: "5%" },
      { label: "Live Event Tickets", value: "5%" },
    ],
    cta: "Join Starter",
    onClick: () => {},
  },
  {
    name: "Promoter",
    badge: "Most Popular",
    badgeClass: "popular",
    sub: "Maximize your reach and accelerate your earnings.",
    features: [
      { label: "Direct Referral", value: "15%" },
      { label: "Indirect Network Bonus", value: "5%" },
      { label: "PPV Sales", value: "10%" },
      { label: "Subscription Sales", value: "8%" },
      { label: "Live Event Tickets", value: "10%" },
    ],
    cta: "Join Promoter",
    onClick: () => {},
    popular: true,
  },
  {
    name: "Gold",
    badge: "Elite Level",
    badgeClass: "",
    sub: "Top-tier commissions for power users and elite partners.",
    features: [
      { label: "Direct Referral", value: "20%" },
      { label: "Indirect Network Bonus", value: "7%" },
      { label: "PPV Sales", value: "15%" },
      { label: "Subscription Sales", value: "12%" },
    ],
    cta: "Join Gold",
    onClick: () => {set},
  },
];


export default function CommissionTierSection({ onJoin }) {
  return (
    <section className="commission-tier-section">
      <h2 className="commission-tier-title">Choose Your Commission Structure</h2>
      <p className="commission-tier-desc">
        Select the tier that best fits your audience and start earning with our industry-leading partner program.
      </p>
      <div className="commission-tier-grid">
        {tiers.map((tier, idx) => (
          <div
            className={
              "commission-tier-card" + (tier.popular ? " popular" : "")
            }
            key={tier.name}
          >
            <div
              className={
                "commission-tier-badge" +
                (tier.badgeClass ? " " + tier.badgeClass : "")
              }
            >
              {tier.badge}
            </div>
            <div className="commission-tier-name">{tier.name}</div>
            <div className="commission-tier-sub">{tier.sub}</div>
            <ul className="commission-tier-list">
              {tier.features.map((f, i) => (
                <li key={i}>
                  <span className="check">✔</span> {f.label}: <b>{f.value}</b>
                </li>
              ))}
            </ul>
            <div className="commission-tier-cta">
              <button
                className="commission-tier-btn"
                onClick={e => onJoin(e, tier.name)}
                tabIndex={0}
              >
                {tier.cta}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
