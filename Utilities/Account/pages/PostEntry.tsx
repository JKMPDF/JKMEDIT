import React, { useState, useContext, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanyDataContext } from '../context/CompanyDataContext';
import type { VoucherEntry, InventoryAllocation } from '../types';
import Button from '../components/Button';
import Select from '../components/Select';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import { SaveIcon, TrashIcon, CreateIcon } from '../components/Icon';

// Sub-component for the traditional Journal/Payment/Receipt entry form
const JournalForm: React.FC<{
    entries: VoucherEntry[];
    setEntries: React.Dispatch<React.SetStateAction<VoucherEntry[]>>;
}> = ({ entries, setEntries }) => {
    const { companyData } = useContext(CompanyDataContext)!;

    const handleEntryChange = (index: number, field: keyof VoucherEntry, value: string | number) => {
        const newEntries = [...entries];
        (newEntries[index] as any)[field] = value;
        setEntries(newEntries);
    };

    const addEntryRow = () => {
        setEntries([...entries, { type: 'Dr', ledgerId: '', amount: 0 }]);
    };

    const removeEntryRow = (index: number) => {
        if (entries.length <= 2) {
            alert("A voucher must have at least one debit and one credit entry.");
            return;
        }
        setEntries(entries.filter((_, i) => i !== index));
    };

    return (
        <>
            <div className="space-y-2">
                <div className="grid grid-cols-12 gap-4 font-semibold text-slate-400 px-2">
                    <div className="col-span-2">Dr/Cr</div>
                    <div className="col-span-5">Particulars (Ledger)</div>
                    <div className="col-span-4">Amount</div>
                    <div className="col-span-1"></div>
                </div>
                {entries.map((entry, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-2">
                            <Select label="" id={`type-${index}`} name="type" value={entry.type} onChange={(e) => handleEntryChange(index, 'type', e.target.value)}>
                                <option value="Dr">Dr</option>
                                <option value="Cr">Cr</option>
                            </Select>
                        </div>
                        <div className="col-span-5">
                            <Select label="" id={`ledger-${index}`} name="ledgerId" value={entry.ledgerId} onChange={(e) => handleEntryChange(index, 'ledgerId', e.target.value)} required>
                                <option value="">Select Ledger</option>
                                {companyData?.ledgers.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </Select>
                        </div>
                        <div className="col-span-4">
                            <Input label="" id={`amount-${index}`} name="amount" type="number" value={entry.amount} onChange={(e) => handleEntryChange(index, 'amount', e.target.value)} required min="0.01" step="0.01" />
                        </div>
                        <div className="col-span-1">
                            <Button type="button" variant='danger' onClick={() => removeEntryRow(index)} className="!p-2">
                                <TrashIcon className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            <Button type="button" variant="secondary" onClick={addEntryRow} className="!w-auto">
                <CreateIcon className="w-5 h-5 mr-2" />
                Add Row
            </Button>
        </>
    );
};

// Main Component
const PostEntry: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(CompanyDataContext);

  // Common State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [voucherType, setVoucherType] = useState<'Sale' | 'Purchase' | 'Payment' | 'Receipt' | 'Journal'>('Journal');
  const [narration, setNarration] = useState('');

  // Journal Mode State
  const [journalEntries, setJournalEntries] = useState<VoucherEntry[]>([
    { type: 'Dr', ledgerId: '', amount: 0 },
    { type: 'Cr', ledgerId: '', amount: 0 },
  ]);

  // Invoice Mode State
  const [partyLedgerId, setPartyLedgerId] = useState('');
  const [transactionLedgerId, setTransactionLedgerId] = useState(''); // Purchase or Sales Ledger
  const [inventoryItems, setInventoryItems] = useState<Array<InventoryAllocation & { amount: number }>>([
      { stockItemId: '', quantity: 1, rate: 0, amount: 0 }
  ]);
  const [additionalLedgers, setAdditionalLedgers] = useState<Array<{ ledgerId: string, amount: number }>>([]);


  if (!context) return null;
  const { companyData, addVoucher } = context;

  const isInvoiceMode = voucherType === 'Sale' || voucherType === 'Purchase';

  // Calculations for Totals
  const { totalDebit, totalCredit } = useMemo(() => {
    if (!isInvoiceMode) {
      return journalEntries.reduce((acc, entry) => {
        if (entry.type === 'Dr') acc.totalDebit += +entry.amount || 0;
        if (entry.type === 'Cr') acc.totalCredit += +entry.amount || 0;
        return acc;
      }, { totalDebit: 0, totalCredit: 0 });
    } else {
        const itemsTotal = inventoryItems.reduce((sum, item) => sum + item.amount, 0);
        const additionalTotal = additionalLedgers.reduce((sum, l) => sum + l.amount, 0);
        const debitTotal = itemsTotal + additionalTotal;
        return { totalDebit: debitTotal, totalCredit: debitTotal }; // In invoice mode, they are always equal
    }
  }, [journalEntries, inventoryItems, additionalLedgers, isInvoiceMode]);

  // Invoice mode item change handler
  const handleItemChange = (index: number, field: keyof (typeof inventoryItems)[0], value: any) => {
    const newItems = [...inventoryItems];
    const item = { ...newItems[index] };
    (item as any)[field] = value;
    item.amount = (item.quantity || 0) * (item.rate || 0);
    newItems[index] = item;
    setInventoryItems(newItems);
  };
  
  const addInventoryItem = () => setInventoryItems([...inventoryItems, { stockItemId: '', quantity: 1, rate: 0, amount: 0 }]);
  const removeInventoryItem = (index: number) => setInventoryItems(inventoryItems.filter((_, i) => i !== index));

  const handleAdditionalLedgerChange = (index: number, field: keyof (typeof additionalLedgers)[0], value: any) => {
    const newLedgers = [...additionalLedgers];
    (newLedgers[index] as any)[field] = value;
    setAdditionalLedgers(newLedgers);
  };

  const addAdditionalLedger = () => setAdditionalLedgers([...additionalLedgers, { ledgerId: '', amount: 0 }]);
  const removeAdditionalLedger = (index: number) => setAdditionalLedgers(additionalLedgers.filter((_, i) => i !== index));

  // Auto-calculate GST when stock item changes
  useEffect(() => {
    if (isInvoiceMode) {
        const gstLedgers = companyData?.ledgers.filter(l => l.name.toLowerCase().includes('gst')) || [];
        const cgstLedger = gstLedgers.find(l => l.name.toLowerCase().includes('cgst'));
        const sgstLedger = gstLedgers.find(l => l.name.toLowerCase().includes('sgst'));

        if (!cgstLedger || !sgstLedger) return;

        const { totalGst } = inventoryItems.reduce((acc, item) => {
            const stockItem = companyData?.stockItems.find(si => si.id === item.stockItemId);
            if (stockItem && stockItem.gstRate) {
                const gstAmount = item.amount * (stockItem.gstRate / 100);
                acc.totalGst += gstAmount;
            }
            return acc;
        }, { totalGst: 0 });

        if (totalGst > 0) {
            const newAdditional = additionalLedgers.filter(l => l.ledgerId !== cgstLedger.id && l.ledgerId !== sgstLedger.id);
            newAdditional.push({ ledgerId: cgstLedger.id, amount: totalGst / 2 });
            newAdditional.push({ ledgerId: sgstLedger.id, amount: totalGst / 2 });
            setAdditionalLedgers(newAdditional);
        }
    }
  }, [inventoryItems, isInvoiceMode, companyData?.stockItems, companyData?.ledgers]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalDebit !== totalCredit || totalDebit === 0) {
      alert('Total Debits must equal Total Credits, and cannot be zero.');
      return;
    }

    let finalEntries: VoucherEntry[] = [];
    if (isInvoiceMode) {
        // Construct entries from invoice form
        if (!partyLedgerId || !transactionLedgerId || inventoryItems.some(i => !i.stockItemId || i.amount <= 0)) {
            alert("Please fill all required fields in the invoice: Party, Transaction Ledger, and all item details.");
            return;
        }
        const itemsTotal = inventoryItems.reduce((sum, item) => sum + item.amount, 0);
        
        // Credit/Debit the party
        finalEntries.push({
            type: voucherType === 'Purchase' ? 'Cr' : 'Dr',
            ledgerId: partyLedgerId,
            amount: totalCredit,
        });

        // Debit/Credit the transaction ledger (Purchase/Sale) with inventory details
        finalEntries.push({
            type: voucherType === 'Purchase' ? 'Dr' : 'Cr',
            ledgerId: transactionLedgerId,
            amount: itemsTotal,
            inventoryAllocations: inventoryItems.map(({stockItemId, quantity, rate}) => ({stockItemId, quantity, rate}))
        });

        // Add additional ledgers (GST, etc.)
        additionalLedgers.forEach(l => {
            if (l.ledgerId && l.amount > 0) {
                finalEntries.push({
                    type: voucherType === 'Purchase' ? 'Dr' : 'Cr',
                    ledgerId: l.ledgerId,
                    amount: l.amount,
                });
            }
        });

    } else {
        // Use entries from journal form
        if (journalEntries.some(entry => !entry.ledgerId || !entry.amount)) {
            alert('Please ensure all entry lines have a ledger and amount specified.');
            return;
        }
        finalEntries = journalEntries;
    }

    addVoucher({ date, type: voucherType, entries: finalEntries, narration });
    alert('Voucher saved successfully!');
    
    // Reset form
    setDate(new Date().toISOString().split('T')[0]);
    setNarration('');
    setJournalEntries([{ type: 'Dr', ledgerId: '', amount: 0 }, { type: 'Cr', ledgerId: '', amount: 0 }]);
    setPartyLedgerId('');
    setTransactionLedgerId('');
    setInventoryItems([{ stockItemId: '', quantity: 1, rate: 0, amount: 0 }]);
    setAdditionalLedgers([]);
  };

  return (
    <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-slate-100 mb-6">Voucher Entry</h1>
        <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-lg shadow-lg space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Select label="Voucher Type" id="voucherType" name="voucherType" value={voucherType} onChange={(e) => setVoucherType(e.target.value as any)}>
                    <option>Journal</option>
                    <option>Sale</option>
                    <option>Purchase</option>
                    <option>Payment</option>
                    <option>Receipt</option>
                </Select>
                 <Input label="Date" id="date" name="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>

            {isInvoiceMode ? (
                 <div className='space-y-6'>
                    {/* Invoice Header */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Select label={voucherType === 'Purchase' ? 'Party (Creditor)' : 'Party (Debtor)'} value={partyLedgerId} onChange={e => setPartyLedgerId(e.target.value)} required>
                            <option value="">Select Party Ledger</option>
                            {companyData?.ledgers.filter(l => l.group.includes('Sundry')).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                        </Select>
                        <Select label={voucherType === 'Purchase' ? 'Purchase Ledger' : 'Sales Ledger'} value={transactionLedgerId} onChange={e => setTransactionLedgerId(e.target.value)} required>
                             <option value="">Select Transaction Ledger</option>
                             {companyData?.ledgers.filter(l => l.group.includes(voucherType)).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                        </Select>
                    </div>
                    {/* Inventory Items Table */}
                    <div className="space-y-2 border-t border-slate-700 pt-4">
                        <h3 className="text-lg font-semibold text-indigo-400 mb-2">Inventory Items</h3>
                        {inventoryItems.map((item, index) => (
                             <div key={index} className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-5"><Select label="" value={item.stockItemId} onChange={e => handleItemChange(index, 'stockItemId', e.target.value)} required><option value="">Select Item</option>{companyData?.stockItems.map(si => <option key={si.id} value={si.id}>{si.name}</option>)}</Select></div>
                                <div className="col-span-2"><Input label="" type="number" placeholder="Qty" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', parseFloat(e.target.value))} /></div>
                                <div className="col-span-2"><Input label="" type="number" placeholder="Rate" value={item.rate} onChange={e => handleItemChange(index, 'rate', parseFloat(e.target.value))} /></div>
                                <div className="col-span-2"><Input label="" type="number" placeholder="Amount" value={item.amount.toFixed(2)} readOnly className="!bg-slate-700" /></div>
                                <div className="col-span-1"><Button type="button" variant="danger" onClick={() => removeInventoryItem(index)} className="!p-2"><TrashIcon className="w-5 h-5"/></Button></div>
                            </div>
                        ))}
                         <Button type="button" variant="secondary" onClick={addInventoryItem} className="!w-auto mt-2"><CreateIcon className="w-5 h-5 mr-2"/>Add Item</Button>
                    </div>
                     {/* Additional Ledgers */}
                    <div className="space-y-2 border-t border-slate-700 pt-4">
                        <h3 className="text-lg font-semibold text-indigo-400 mb-2">Additional Ledgers (GST, etc.)</h3>
                        {additionalLedgers.map((ledger, index) => (
                             <div key={index} className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-7"><Select label="" value={ledger.ledgerId} onChange={e => handleAdditionalLedgerChange(index, 'ledgerId', e.target.value)} required><option value="">Select Ledger</option>{companyData?.ledgers.filter(l => l.group.includes('Duties & Taxes') || l.group.includes('Expense') || l.group.includes('Income')).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</Select></div>
                                <div className="col-span-4"><Input label="" type="number" placeholder="Amount" value={ledger.amount} onChange={e => handleAdditionalLedgerChange(index, 'amount', parseFloat(e.target.value))} /></div>
                                <div className="col-span-1"><Button type="button" variant="danger" onClick={() => removeAdditionalLedger(index)} className="!p-2"><TrashIcon className="w-5 h-5"/></Button></div>
                            </div>
                        ))}
                        <Button type="button" variant="secondary" onClick={addAdditionalLedger} className="!w-auto mt-2"><CreateIcon className="w-5 h-5 mr-2"/>Add Ledger</Button>
                    </div>
                 </div>
            ) : (
                <JournalForm entries={journalEntries} setEntries={setJournalEntries} />
            )}

            {/* Totals & Narration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-700">
                <Textarea label="Narration" name="narration" value={narration} onChange={e => setNarration(e.target.value)} />
                <div className="space-y-2 font-mono text-lg p-4 bg-slate-900/50 rounded">
                    <div className="flex justify-between items-center text-green-400">
                        <span>Total Debit:</span>
                        <span>{totalDebit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-orange-400">
                        <span>Total Credit:</span>
                        <span>{totalCredit.toFixed(2)}</span>
                    </div>
                    <div className={`flex justify-between items-center border-t border-slate-600 pt-2 mt-2 ${Math.abs(totalDebit - totalCredit) > 0.01 ? 'text-red-500' : 'text-slate-400'}`}>
                        <span>Difference:</span>
                        <span>{(totalDebit - totalCredit).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pt-4">
                <Button type="button" variant="secondary" onClick={() => navigate('/')}>
                  Back to Dashboard
                </Button>
                <Button type="submit" disabled={Math.abs(totalDebit - totalCredit) > 0.01 || totalDebit === 0}>
                  <SaveIcon className="w-5 h-5 mr-2" />
                  Save Voucher
                </Button>
            </div>
        </form>
    </div>
  );
};

export default PostEntry;