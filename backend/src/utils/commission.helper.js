import prisma from '../config/database.js';

// coin conversion rate (coins -> money). Make configurable via env later.
const COIN_RATE = parseFloat(process.env.COIN_TO_MONEY_RATE || '0.01');

/**
 * Calculate commission amount based on CommissionRule and referral baseAmount
 * - For FLAT: return rule.value
 * - For PERCENTAGE: return (rule.value / 100) * baseAmount
 */
export const calculateCommission = (rule, baseAmount = 0) => {
  if (!rule) return 0;
  if (rule.rewardType === 'FLAT') return Number(rule.value || 0);
  if (rule.rewardType === 'PERCENTAGE') return (Number(rule.value || 0) / 100) * Number(baseAmount || 0);
  return 0;
};

export const coinToMoney = (coins) => {
  return Number(coins || 0) * COIN_RATE;
};

/**
 * Find an applicable CommissionRule for a referral (simple matching by role/rank)
 */
export const findCommissionRuleForReferral = async (referral) => {
  // preference: match by founder rank/role if available
  try {
    // If referral has founder info on the referrer
    if (!referral) return null;

    // Try to find a rule for Founder role
    const roleRule = await prisma.commissionRule.findFirst({ where: { scopeMode: 'ROLE', role: 'FOUNDER', status: 'ACTIVE' } });
    if (roleRule) return roleRule;

    // Try to find a rule matching rank of the founder who referred
    if (referral.founder) {
      const rankRule = await prisma.commissionRule.findFirst({ where: { scopeMode: 'RANK', rank: referral.founder.rank, status: 'ACTIVE' } });
      if (rankRule) return rankRule;
    }

    // Fallback to any active rule
    const anyRule = await prisma.commissionRule.findFirst({ where: { status: 'ACTIVE' } });
    return anyRule;
  } catch (e) {
    console.error('findCommissionRuleForReferral error', e);
    return null;
  }
};

/**
 * Compute total commission earnings for a founder by scanning referrals and CommissionEarning records
 */
export const computeFounderCommissionSummary = async (founderId) => {
  // sum CommissionEarning amounts
  const sum = await prisma.commissionEarning.aggregate({
    _sum: { amount: true },
    where: { founderId }
  });
  const commissionTotal = Number(sum._sum.amount || 0);

  // fetch founder coin value
  const founder = await prisma.founder.findUnique({ where: { id: founderId } });
  const coinValue = coinToMoney(founder?.coins || 0);

  return { commissionTotal, coinValue, coins: founder?.coins || 0 };
};

export default {
  calculateCommission,
  coinToMoney,
  findCommissionRuleForReferral,
  computeFounderCommissionSummary
};
