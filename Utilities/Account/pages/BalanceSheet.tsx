import React, { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanyDataContext } from '../context/CompanyDataContext';
import { calculateLedgerBalances, calculateProfitAndLoss, calculateBalanceSheet } from '../utils/accounting';
import Button from '../components/Button';

const ReportRow: React.FC<{ name: string; balance: number; isGroup?: boolean }> = ({ name, balance, isGroup = false }) => (
    <div className={`flex justify-between py-2 ${isGroup ? 'font-bold text-indigo-400' : 'pl-4 text-slate-300'}`}>
        <span>{name}</span>
        <span className="font-mono">{balance.toFixed(2)}</span>
    </div>
);

const BalanceSheet: React.FC = () => {
    const navigate = useNavigate();
    const context = useContext(CompanyDataContext);

    try {
        const { companyData } = context || {};
        const { ledgers = [], vouchers = [] } = companyData || {};

        const { groupedAssets, groupedLiabilities, totalAssets, totalLiabilities } = useMemo(() => {
            if (!ledgers?.length) return { groupedAssets: {}, groupedLiabilities: {}, totalAssets: 0, totalLiabilities: 0 };
            const ledgerBalances = calculateLedgerBalances(ledgers, vouchers);
            const { netProfit } = calculateProfitAndLoss(ledgers, ledgerBalances);
            return calculateBalanceSheet(ledgers, ledgerBalances, netProfit);
        }, [ledgers, vouchers]);

        const difference = totalLiabilities - totalAssets;

        return (
            <div className="container mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-slate-100">Balance Sheet</h1>
                    <Button onClick={() => navigate('/view-report')} variant="secondary">Back to Reports</Button>
                </div>

                <div className="bg-slate-800 rounded-lg shadow-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        {/* Liabilities Side */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-slate-200 border-b-2 border-slate-600 pb-2">Liabilities & Equity</h2>
                            <div className="divide-y divide-slate-700/50">
                                {Object.entries(groupedLiabilities).map(([group, items]) => (
                                    <div key={group} className="py-1">
                                        <ReportRow name={group} balance={items.reduce((sum, i) => sum + i.balance, 0)} isGroup />
                                        {items.map(item => <ReportRow key={item.name} name={item.name} balance={item.balance} />)}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t-2 border-slate-500 pt-3 mt-4 text-green-400">
                                <span>Total Liabilities & Equity</span>
                                <span className="font-mono">{totalLiabilities.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Assets Side */}
                        <div className="space-y-4 mt-8 md:mt-0">
                            <h2 className="text-xl font-semibold text-slate-200 border-b-2 border-slate-600 pb-2">Assets</h2>
                            <div className="divide-y divide-slate-700/50">
                                {Object.entries(groupedAssets).map(([group, items]) => (
                                    <div key={group} className="py-1">
                                        <ReportRow name={group} balance={items.reduce((sum, i) => sum + i.balance, 0)} isGroup />
                                        {items.map(item => <ReportRow key={item.name} name={item.name} balance={item.balance} />)}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t-2 border-slate-500 pt-3 mt-4 text-green-400">
                                <span>Total Assets</span>
                                <span className="font-mono">{totalAssets.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {Math.abs(difference) > 0.01 && (
                        <div className="text-center mt-8 p-4 bg-red-900/30 border border-red-500 rounded-lg">
                            <p className="font-bold text-red-400">Difference in Opening Balances: {difference.toFixed(2)}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error rendering Balance Sheet:", error);
        return (
             <div className="container mx-auto text-center p-10 bg-red-900/20 border border-red-500 rounded-lg">
                <h1 className="text-3xl font-bold text-red-400 mb-4">An Error Occurred</h1>
                <p className="text-slate-300">Could not display the Balance Sheet. There might be an issue with the data.</p>
                <p className="text-slate-400 text-sm mt-2">Check the console for more details.</p>
                <Button onClick={() => navigate('/view-report')} variant="secondary" className="mt-6">Back to Reports</Button>
            </div>
        );
    }
};

export default BalanceSheet;