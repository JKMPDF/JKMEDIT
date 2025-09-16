import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanyDataContext } from '../context/CompanyDataContext';
import type { Ledger } from '../types';
import { ACCOUNTING_GROUPS } from '../constants/accountingGroups';
import Input from '../components/Input';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import { SaveIcon } from '../components/Icon';

const CreateLedger: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(CompanyDataContext);
  const [ledgerDetails, setLedgerDetails] = useState<Omit<Ledger, 'id'>>({
    name: '',
    group: '',
    address: '',
    state: '',
    pincode: '',
    gstNo: '',
    panNo: '',
  });

  if (!context) return null;
  const { companyData, addLedger } = context;

  const CONDITIONAL_GROUPS = ['Sundry Debtors', 'Sundry Creditors'];
  const showExtraFields = CONDITIONAL_GROUPS.includes(ledgerDetails.group);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLedgerDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ledgerDetails.name || !ledgerDetails.group) {
      alert('Ledger Name and Group are required.');
      return;
    }
    if (companyData?.ledgers.some(l => l.name.toLowerCase() === ledgerDetails.name.toLowerCase())) {
        alert('A ledger with this name already exists.');
        return;
    }
    addLedger(ledgerDetails);
    alert('Ledger created successfully!');
    // Reset form
    setLedgerDetails({
      name: '', group: '', address: '', state: '', pincode: '', gstNo: '', panNo: '',
    });
  };

  return (
    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-bold text-slate-100 mb-6">Create Ledger</h1>
        <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-lg shadow-lg space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Ledger Name" id="name" name="name" value={ledgerDetails.name} onChange={handleChange} required />
            <Select label="Group" id="group" name="group" value={ledgerDetails.group} onChange={handleChange} required>
              <option value="">Select Group</option>
              {ACCOUNTING_GROUPS.sort().map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </Select>
          </div>
          
          {showExtraFields && (
            <div className="border-t border-slate-700 pt-6 mt-6 space-y-6">
                 <h3 className="text-lg font-semibold text-indigo-400">Mailing Details</h3>
                 <Textarea label="Address" name="address" value={ledgerDetails.address} onChange={handleChange} />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="State" name="state" value={ledgerDetails.state} onChange={handleChange} />
                    <Input label="Pincode" name="pincode" value={ledgerDetails.pincode} onChange={handleChange} />
                 </div>
                 <h3 className="text-lg font-semibold text-indigo-400">Tax Registration Details</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="PAN/IT No." name="panNo" value={ledgerDetails.panNo} onChange={handleChange} />
                    <Input label="GSTIN/UIN" name="gstNo" value={ledgerDetails.gstNo} onChange={handleChange} />
                 </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4">
            <Button type="button" variant="secondary" onClick={() => navigate('/create-items')}>
              Back
            </Button>
            <Button type="submit">
              <SaveIcon className="w-5 h-5 mr-2" />
              Save Ledger
            </Button>
          </div>
        </form>
      </div>

      <div className="lg:col-span-1">
        <h2 className="text-2xl font-bold text-slate-100 mb-6">Existing Ledgers</h2>
        <div className="bg-slate-800 p-4 rounded-lg shadow-lg max-h-[60vh] overflow-y-auto">
          {companyData?.ledgers && companyData.ledgers.length > 0 ? (
            <ul className="divide-y divide-slate-700">
              {companyData.ledgers.map(ledger => (
                <li key={ledger.id} className="py-3">
                  <p className="font-semibold text-slate-200">{ledger.name}</p>
                  <p className="text-sm text-slate-400">{ledger.group}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400 text-center py-4">No ledgers created yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateLedger;