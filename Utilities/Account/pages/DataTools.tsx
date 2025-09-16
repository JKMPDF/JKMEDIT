import React, { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanyDataContext } from '../context/CompanyDataContext';
import Button from '../components/Button';
import { UploadIcon, ExportIcon } from '../components/Icon';

const DataTools: React.FC = () => {
    const navigate = useNavigate();
    const context = useContext(CompanyDataContext);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!context) return null;
    const { exportVouchersAsCsv, exportLedgersAsCsv, importVouchersFromCsv } = context;

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            importVouchersFromCsv(file);
        }
    };

    return (
        <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-slate-100">Data Tools</h1>
                <Button onClick={() => navigate('/')} variant="secondary">Back to Dashboard</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Export Section */}
                <div className="bg-slate-800 p-6 rounded-lg shadow-lg space-y-4">
                    <h2 className="text-2xl font-bold text-indigo-400">Export Data</h2>
                    <p className="text-slate-400">Download your company data as CSV files, which can be opened in Excel or other spreadsheet software.</p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <Button onClick={exportVouchersAsCsv}>
                            <ExportIcon className="w-5 h-5 mr-2" />
                            Export Vouchers (CSV)
                        </Button>
                        <Button onClick={exportLedgersAsCsv} variant="secondary">
                            <ExportIcon className="w-5 h-5 mr-2" />
                            Export Ledgers (CSV)
                        </Button>
                    </div>
                </div>

                {/* Import Section */}
                <div className="bg-slate-800 p-6 rounded-lg shadow-lg space-y-4">
                    <h2 className="text-2xl font-bold text-indigo-400">Import Vouchers</h2>
                    <p className="text-slate-400">Import voucher entries from a CSV file. First, export your vouchers to get the correct template format.</p>
                    <div className="pt-2">
                         <Button onClick={handleUploadClick}>
                            <UploadIcon className="w-5 h-5 mr-2" />
                            Import Vouchers from CSV
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept=".csv,text/csv"
                        />
                    </div>
                     <div className="text-xs text-slate-500 pt-2">
                        <p><strong>Note:</strong> Ensure ledger names in the CSV file exactly match the ones in your company. The import will fail if a ledger is not found.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataTools;