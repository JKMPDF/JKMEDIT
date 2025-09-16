import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { CompanyData, CompanyDetails, Ledger, StockItem, Voucher } from '../types';

interface CompanyDataContextType {
  companyData: CompanyData | null;
  loading: boolean;
  loadDataFromFile: (file: File) => Promise<void>;
  createNewCompany: (details: CompanyDetails) => void;
  exportDataAsJson: () => void;
  logout: () => void;
  addLedger: (ledger: Omit<Ledger, 'id'>) => void;
  addVoucher: (voucher: Omit<Voucher, 'id'>) => void;
  addStockItem: (stockItem: Omit<StockItem, 'id'>) => void;
  importVouchersFromCsv: (file: File) => Promise<void>;
  exportVouchersAsCsv: () => void;
  exportLedgersAsCsv: () => void;
}

export const CompanyDataContext = createContext<CompanyDataContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'jkmEditCompanyData';

export const CompanyDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        setCompanyData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to load data from local storage", error);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveData = useCallback((data: CompanyData | null) => {
    try {
      if (data) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
      setCompanyData(data);
    } catch (error) {
      console.error("Failed to save data to local storage", error);
    }
  }, []);

  const loadDataFromFile = async (file: File) => {
    if (!file || file.type !== 'application/json') {
      alert('Please upload a valid JSON file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text === 'string') {
          const data: CompanyData = JSON.parse(text);
          // Basic validation
          if (data.details && data.ledgers) {
            saveData(data);
            alert('Company data imported successfully!');
          } else {
            throw new Error('Invalid JSON structure for company data.');
          }
        }
      } catch (error) {
        console.error("Failed to parse JSON file", error);
        alert('Failed to import data. The file may be corrupted or in the wrong format.');
      }
    };
    reader.readAsText(file);
  };

  const createNewCompany = (details: CompanyDetails) => {
    const newCompanyData: CompanyData = {
      details,
      ledgers: [],
      stockItems: [],
      vouchers: [],
    };
    saveData(newCompanyData);
  };

  const triggerDownload = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportDataAsJson = () => {
    if (!companyData) {
      alert('No company data to export.');
      return;
    }
    try {
      const jsonString = JSON.stringify(companyData, null, 2);
      const safeName = companyData.details.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const filename = `jkmedit_backup_${safeName}_${new Date().toISOString().split('T')[0]}.json`;
      triggerDownload(filename, jsonString, 'application/json');
    } catch (error) {
      console.error("Failed to export data", error);
      alert('An error occurred while exporting data.');
    }
  };

  const logout = () => {
    if (window.confirm('Are you sure you want to close this company? This will return you to the welcome screen.')) {
        if (window.confirm('Would you like to export a backup before closing? This is recommended.')) {
            exportDataAsJson();
        }
        saveData(null);
        // The App component's router will automatically navigate to /welcome
    }
  };

  const addLedger = (ledgerData: Omit<Ledger, 'id'>) => {
    if (!companyData) return;
    const newLedger: Ledger = {
      ...ledgerData,
      id: `ledger_${new Date().getTime()}`,
    };
    const updatedData = {
      ...companyData,
      ledgers: [...companyData.ledgers, newLedger].sort((a, b) => a.name.localeCompare(b.name)),
    };
    saveData(updatedData);
  };

  const addVoucher = (voucherData: Omit<Voucher, 'id'>) => {
    if (!companyData) return;
    const newVoucher: Voucher = {
      ...voucherData,
      id: `voucher_${new Date().getTime()}`,
    };
    const updatedData = {
      ...companyData,
      vouchers: [...companyData.vouchers, newVoucher],
    };
    saveData(updatedData);
  };

  const addStockItem = (stockItemData: Omit<StockItem, 'id'>) => {
    if (!companyData) return;
    const newStockItem: StockItem = {
      ...stockItemData,
      id: `stock_${new Date().getTime()}`,
    };
    const updatedData = {
      ...companyData,
      stockItems: [...companyData.stockItems, newStockItem].sort((a, b) => a.name.localeCompare(b.name)),
    };
    saveData(updatedData);
  };
  
  const escapeCsvCell = (cell: any): string => {
    const cellStr = String(cell ?? '');
    if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
      return `"${cellStr.replace(/"/g, '""')}"`;
    }
    return cellStr;
  };

  const exportVouchersAsCsv = () => {
      if (!companyData || !companyData.vouchers.length) {
          alert('No vouchers to export.');
          return;
      }
      const { vouchers, ledgers } = companyData;
      const ledgerMap = new Map(ledgers.map(l => [l.id, l.name]));

      const headers = ['VoucherID', 'Date', 'Type', 'DrCr', 'LedgerName', 'Amount', 'Narration'];
      const rows = vouchers.flatMap(v => 
          v.entries.map(e => [
              v.id,
              v.date,
              v.type,
              e.type,
              ledgerMap.get(e.ledgerId) || e.ledgerId,
              e.amount,
              v.narration
          ].map(escapeCsvCell))
      );
      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      const safeName = companyData.details.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      triggerDownload(`vouchers_${safeName}.csv`, csvContent, 'text/csv');
  };

  const exportLedgersAsCsv = () => {
      if (!companyData || !companyData.ledgers.length) {
          alert('No ledgers to export.');
          return;
      }
      const headers = ['LedgerName', 'Group'];
      const rows = companyData.ledgers.map(l => [l.name, l.group].map(escapeCsvCell));
      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      const safeName = companyData.details.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      triggerDownload(`ledgers_${safeName}.csv`, csvContent, 'text/csv');
  };

  const importVouchersFromCsv = async (file: File) => {
    if (!companyData) return;
    if (!file || !file.name.endsWith('.csv')) {
        alert('Please upload a valid CSV file.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const text = event.target?.result as string;
            const lines = text.split('\n').filter(line => line.trim() !== '');
            const headers = lines[0].split(',').map(h => h.trim());
            const requiredHeaders = ['VoucherID', 'Date', 'Type', 'DrCr', 'LedgerName', 'Amount'];
            if (!requiredHeaders.every(h => headers.includes(h))) {
                throw new Error(`Invalid CSV format. Missing headers: ${requiredHeaders.filter(h => !headers.includes(h)).join(', ')}`);
            }
            
            const ledgerMap = new Map(companyData.ledgers.map(l => [l.name.toLowerCase(), l.id]));
            const rows = lines.slice(1);
            const vouchersToCreate = new Map<string, Omit<Voucher, 'id'>>();

            for (const row of rows) {
                const values = row.split(',');
                const rowData = headers.reduce((obj, header, index) => {
                    obj[header] = values[index]?.trim();
                    return obj;
                }, {} as any);

                if (!rowData.VoucherID) continue;

                if (!vouchersToCreate.has(rowData.VoucherID)) {
                    vouchersToCreate.set(rowData.VoucherID, {
                        date: rowData.Date,
                        type: rowData.Type,
                        entries: [],
                        narration: rowData.Narration || '',
                    });
                }

                const ledgerId = ledgerMap.get(rowData.LedgerName.toLowerCase());
                if (!ledgerId) {
                    throw new Error(`Ledger "${rowData.LedgerName}" not found. Please create it first.`);
                }

                vouchersToCreate.get(rowData.VoucherID)?.entries.push({
                    type: rowData.DrCr as 'Dr' | 'Cr',
                    ledgerId: ledgerId,
                    amount: parseFloat(rowData.Amount),
                });
            }

            let addedCount = 0;
            const updatedVouchers = [...companyData.vouchers];
            for (const [id, voucherData] of vouchersToCreate.entries()) {
                // Simple check for debit/credit balance
                const total = voucherData.entries.reduce((acc, e) => acc + (e.type === 'Dr' ? e.amount : -e.amount), 0);
                if (Math.abs(total) > 0.01) {
                    console.warn(`Skipping voucher ${id} due to imbalance (Debit != Credit).`);
                    continue;
                }
                updatedVouchers.push({ ...voucherData, id: `imported_${id}_${Date.now()}` });
                addedCount++;
            }

            if (addedCount > 0) {
                saveData({ ...companyData, vouchers: updatedVouchers });
                alert(`${addedCount} vouchers imported successfully!`);
            } else {
                alert('No new vouchers were imported. Check for errors or imbalances.');
            }

        } catch (error: any) {
            console.error("Failed to parse CSV file", error);
            alert(`Failed to import data: ${error.message}`);
        }
    };
    reader.readAsText(file);
  };

  const value = {
    companyData,
    loading,
    loadDataFromFile,
    createNewCompany,
    exportDataAsJson,
    logout,
    addLedger,
    addVoucher,
    addStockItem,
    importVouchersFromCsv,
    exportVouchersAsCsv,
    exportLedgersAsCsv,
  };

  return (
    <CompanyDataContext.Provider value={value}>
      {children}
    </CompanyDataContext.Provider>
  );
};
