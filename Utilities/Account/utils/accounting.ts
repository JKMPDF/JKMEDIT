import type { Ledger, Voucher } from '../types';

export const GROUP_TYPES = {
  ASSET: ['Current Assets', 'Bank Accounts', 'Cash-in-hand', 'Deposits (Asset)', 'Loans & Advances (Asset)', 'Stock-in-hand', 'Sundry Debtors', 'Fixed Assets', 'Investments', 'Suspense A/c'],
  LIABILITY: ['Current Liabilities', 'Duties & Taxes', 'Provisions', 'Sundry Creditors', 'Bank OD A/c', 'Loans (Liability)', 'Secured Loans', 'Unsecured Loans'],
  EQUITY: ['Capital Account', 'Reserves & Surplus'],
  INCOME: ['Sales Accounts', 'Direct Incomes', 'Indirect Incomes'],
  EXPENSE: ['Purchase Accounts', 'Direct Expenses', 'Indirect Expenses'],
};

export const getGroupType = (group: string): keyof typeof GROUP_TYPES | 'UNKNOWN' => {
  for (const type in GROUP_TYPES) {
    if ((GROUP_TYPES as any)[type].includes(group)) {
      return type as keyof typeof GROUP_TYPES;
    }
  }
  return 'UNKNOWN';
};

// Calculate closing balance for each ledger
export const calculateLedgerBalances = (ledgers: Ledger[], vouchers: Voucher[]): Map<string, number> => {
    const balances = new Map<string, number>();
    if (!ledgers) return balances;
    ledgers.forEach(l => balances.set(l.id, 0));

    if (!vouchers) return balances;
    vouchers.forEach(v => {
        if (!v || !Array.isArray(v.entries)) return; // Skip if voucher or its entries are malformed

        v.entries.forEach(entry => {
            if (!entry || !entry.ledgerId) return; // Skip if entry is malformed
            const currentBalance = balances.get(entry.ledgerId) || 0;
            const amount = Number(entry.amount) || 0; // Ensure amount is a valid number, defaulting to 0
            if (entry.type === 'Dr') {
                balances.set(entry.ledgerId, currentBalance + amount);
            } else { // 'Cr'
                balances.set(entry.ledgerId, currentBalance - amount);
            }
        });
    });

    return balances;
};

// Calculate Profit & Loss
export const calculateProfitAndLoss = (ledgers: Ledger[], ledgerBalances: Map<string, number>) => {
    let totalIncome = 0;
    let totalExpense = 0;

    const incomeLedgers: {name: string, balance: number}[] = [];
    const expenseLedgers: {name: string, balance: number}[] = [];

    ledgers.forEach(ledger => {
        const groupType = getGroupType(ledger.group);
        const balance = ledgerBalances.get(ledger.id) || 0;

        if (groupType === 'INCOME') {
            // Incomes have credit balances, so balance will be negative. We show it as positive.
            const incomeAmount = -balance;
            if (incomeAmount !== 0) {
                totalIncome += incomeAmount;
                incomeLedgers.push({ name: ledger.name, balance: incomeAmount });
            }
        } else if (groupType === 'EXPENSE') {
            // Expenses have debit balances, so balance will be positive.
            if (balance !== 0) {
                totalExpense += balance;
                expenseLedgers.push({ name: ledger.name, balance });
            }
        }
    });

    const netProfit = totalIncome - totalExpense;
    return { incomeLedgers, expenseLedgers, totalIncome, totalExpense, netProfit };
};


// Calculate Balance Sheet
export const calculateBalanceSheet = (ledgers: Ledger[], ledgerBalances: Map<string, number>, netProfit: number) => {
    let totalAssets = 0;
    let totalLiabilities = 0;

    const assetLedgers: {name: string, balance: number, group: string}[] = [];
    const liabilityLedgers: {name: string, balance: number, group: string}[] = [];
    
    ledgers.forEach(ledger => {
        const groupType = getGroupType(ledger.group);
        const balance = ledgerBalances.get(ledger.id) || 0;

        if (balance === 0) return;

        if (groupType === 'ASSET') {
            totalAssets += balance;
            assetLedgers.push({ name: ledger.name, balance, group: ledger.group });
        } else if (groupType === 'LIABILITY' || groupType === 'EQUITY') {
            // Liabilities/Equity have credit balances, so balance will be negative. We show it as positive.
            const liabilityAmount = -balance;
            totalLiabilities += liabilityAmount;
            liabilityLedgers.push({ name: ledger.name, balance: liabilityAmount, group: ledger.group });
        }
    });

    // Add P&L to liabilities side
    if (netProfit !== 0) {
      const profitAndLossItem = { name: 'Profit & Loss A/c', balance: netProfit, group: 'Reserves & Surplus' };
      totalLiabilities += netProfit;
      liabilityLedgers.push(profitAndLossItem);
    }
    
    // Group them for display
    const groupedAssets = assetLedgers.reduce((acc, item) => {
        (acc[item.group] = acc[item.group] || []).push(item);
        return acc;
    }, {} as Record<string, {name: string; balance: number}[]>);

    const groupedLiabilities = liabilityLedgers.reduce((acc, item) => {
        (acc[item.group] = acc[item.group] || []).push(item);
        return acc;
    }, {} as Record<string, {name: string; balance: number}[]>);

    return { groupedAssets, groupedLiabilities, totalAssets, totalLiabilities };
};