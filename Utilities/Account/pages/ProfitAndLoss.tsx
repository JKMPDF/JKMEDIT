import React, { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanyDataContext } from '../context/CompanyDataContext';
import { calculateLedgerBalances, calculateProfitAndLoss } from '../utils/accounting';
import Button from '../components/Button';

const ReportRow: React.FC<{ name: string; balance: number; isGroup?: boolean }> = ({ name, balance, isGroup = false }) => (
    <div className={`flex justify-between py-2 ${isGroup ? 'font-bold text-indigo-400 border-b border-slate-600' : 'pl-4 text-slate-300'}`}>
        <span>{name}</span>
        <span className="font-mono">{balance.toFixed(2)}</span>
    </div>
);

const ProfitAndLoss: React.FC = () => {
    const navigate = useNavigate();
    const context = useContext(CompanyDataContext);

    try {
        const { companyData } = context || {};
        const { ledgers = [], vouchers = [] } = companyData || {};

        const { incomeLedgers, expenseLedgers, totalIncome, totalExpense, netProfit } = useMemo(() => {
            if (!ledgers?.length) return { incomeLedgers: [], expenseLedgers: [], totalIncome: 0, totalExpense: 0, netProfit: 0 };
            const ledgerBalances = calculateLedgerBalances(ledgers, vouchers);
            return calculateProfitAndLoss(ledgers, ledgerBalances);
        }, [ledgers, vouchers]);

        const profitOrLossText = netProfit >= 0 ? 'Net Profit' : 'Net Loss';

        return (
            <div className="container mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-slate-100">Profit & Loss Statement</h1>
                    <Button onClick={() => navigate('/view-report')} variant="secondary">Back to Reports</Button>
                </div>

                <div className="bg-slate-800 rounded-lg shadow-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        {/* Expenses Side */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-slate-200 pb-2">Expenses</h2>
                            <div className="divide-y divide-slate-700/50">
                                {expenseLedgers.length > 0 ? expenseLedgers.map(item => <ReportRow key={item.name} name={item.name} balance={item.balance} />) : <p className="text-slate-400 p-4">No expenses recorded.</p>}
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t-2 border-slate-500 pt-3 mt-4 text-orange-400">
                                <span>Total Expenses</span>
                                <span className="font-mono">{totalExpense.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Incomes Side */}
                        <div className="space-y-4 mt-8 md:mt-0">
                            <h2 className="text-xl font-semibold text-slate-200 pb-2">Incomes</h2>
                            <div className="divide-y divide-slate-700/50">
                                {incomeLedgers.length > 0 ? incomeLedgers.map(item => <ReportRow key={item.name} name={item.name} balance={item.balance} />) : <p className="text-slate-400 p-4">No incomes recorded.</p>}
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t-2 border-slate-500 pt-3 mt-4 text-green-400">
                                <span>Total Incomes</span>
                                <span className="font-mono">{totalIncome.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className={`text-center mt-8 p-4 rounded-lg border ${netProfit >= 0 ? 'bg-green-900/30 border-green-500' : 'bg-red-900/30 border-red-500'}`}>
                        <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                            {profitOrLossText}: <span className="font-mono">{Math.abs(netProfit).toFixed(2)}</span>
                        </p>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error rendering Profit & Loss:", error);
        return (
            <div className="container mx-auto text-center p-10 bg-red-900/20 border border-red-500 rounded-lg">
                <h1 className="text-3xl font-bold text-red-400 mb-4">An Error Occurred</h1>
                <p className="text-slate-300">Could not display the Profit & Loss statement. There might be an issue with the data.</p>
                <p className="text-slate-400 text-sm mt-2">Check the console for more details.</p>
                <Button onClick={() => navigate('/view-report')} variant="secondary" className="mt-6">Back to Reports</Button>
            </div>
        );
    }
};

export default ProfitAndLoss;