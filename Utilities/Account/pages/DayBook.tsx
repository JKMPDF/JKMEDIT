import React, { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanyDataContext } from '../context/CompanyDataContext';
import Button from '../components/Button';

const DayBook: React.FC = () => {
    const navigate = useNavigate();
    const context = useContext(CompanyDataContext);

    if (!context) {
        return <div className="text-center p-10">Loading...</div>;
    }

    try {
        const { companyData } = context;
        if (!companyData) {
            return <div className="text-center p-10">Loading company data...</div>;
        }

        const { vouchers = [], ledgers = [] } = companyData;

        // Create a map for quick ledger name lookup
        const ledgerNameMap = useMemo(() => {
            const map = new Map<string, string>();
            ledgers.forEach(ledger => {
                map.set(ledger.id, ledger.name);
            });
            return map;
        }, [ledgers]);

        const sortedVouchers = [...vouchers].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return (
            <div className="container mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-slate-100">Day Book</h1>
                    <Button onClick={() => navigate('/view-report')} variant="secondary">Back to Reports</Button>
                </div>

                <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                    {sortedVouchers.length > 0 ? (
                        <div className="divide-y divide-slate-700">
                            {sortedVouchers.map(voucher => (
                                <div key={voucher.id} className="p-4 hover:bg-slate-700/50 transition-colors duration-200">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3 pb-3 border-b border-slate-600">
                                        <div>
                                            <span className="font-semibold text-slate-400 text-sm">Date:</span>
                                            <p className="text-slate-200">{new Date(voucher.date).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-slate-400 text-sm">Voucher Type:</span>
                                            <p className="text-indigo-400 font-medium">{voucher.type}</p>
                                        </div>
                                        <div className="col-span-2 md:col-span-1 md:text-right">
                                            <span className="font-semibold text-slate-400 text-sm">Voucher No:</span>
                                            <p className="text-slate-300 font-mono text-xs">{voucher.id}</p>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="text-left text-slate-400">
                                                <tr>
                                                    <th className="py-2 px-2 font-normal w-[10%]">Dr/Cr</th>
                                                    <th className="py-2 px-2 font-normal">Particulars</th>
                                                    <th className="py-2 px-2 font-normal text-right w-[20%]">Debit</th>
                                                    <th className="py-2 px-2 font-normal text-right w-[20%]">Credit</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Array.isArray(voucher.entries) && voucher.entries.map((entry, index) => (
                                                    <tr key={index} className="border-t border-slate-700/50">
                                                        <td className={`py-2 px-2 font-medium ${entry.type === 'Dr' ? 'text-green-400' : 'text-orange-400'}`}>{entry.type}</td>
                                                        <td className="py-2 px-2 text-slate-200">{ledgerNameMap.get(entry.ledgerId) || 'Unknown Ledger'}</td>
                                                        <td className="py-2 px-2 text-right font-mono text-slate-200">{entry.type === 'Dr' ? (Number(entry.amount) || 0).toFixed(2) : ''}</td>
                                                        <td className="py-2 px-2 text-right font-mono text-slate-200">{entry.type === 'Cr' ? (Number(entry.amount) || 0).toFixed(2) : ''}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {voucher.narration && (
                                        <div className="mt-3 pt-3 border-t border-slate-700/50">
                                            <p className="text-sm text-slate-400"><span className="font-semibold">Narration:</span> {voucher.narration}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center bg-slate-800/50 p-10 rounded-lg">
                            <h2 className="text-2xl font-bold text-indigo-400 mb-4">No Vouchers Found</h2>
                            <p className="text-slate-300">You haven't posted any entries yet. Go to the dashboard to create your first voucher.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error rendering Day Book:", error);
        return (
            <div className="container mx-auto text-center p-10 bg-red-900/20 border border-red-500 rounded-lg">
                <h1 className="text-3xl font-bold text-red-400 mb-4">An Error Occurred</h1>
                <p className="text-slate-300">Could not display the Day Book. There might be an issue with the data.</p>
                <p className="text-slate-400 text-sm mt-2">Check the console for more details.</p>
                <Button onClick={() => navigate('/view-report')} variant="secondary" className="mt-6">Back to Reports</Button>
            </div>
        );
    }
};

export default DayBook;