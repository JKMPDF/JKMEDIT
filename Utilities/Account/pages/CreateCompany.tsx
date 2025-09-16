import React, { useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanyDataContext } from '../context/CompanyDataContext';
import type { CompanyDetails, CompanyType } from '../types';
import Input from '../components/Input';
import Button from '../components/Button';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import ToggleSwitch from '../components/ToggleSwitch';

const CreateCompany: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(CompanyDataContext);
  const [errors, setErrors] = useState<{ email?: string; gstNo?: string }>({});

  const financialYearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const options = [];
    for (let i = 2; i >= -2; i--) {
      const startYear = currentYear - i;
      const endYear = startYear + 1;
      options.push(`${startYear}-${endYear.toString().slice(2)}`);
    }
    return options;
  }, []);
  
  const [details, setDetails] = useState<CompanyDetails>({
    name: '',
    address: '',
    country: 'India',
    state: '',
    pincode: '',
    email: '',
    financialYear: financialYearOptions[2],
    currencySymbol: '₹',
    companyType: '',
    gstApplicable: false,
    gstNo: '',
    tdsApplicable: false,
    prevYearTurnover: '',
  });

  if (!context) return null;
  const { createNewCompany } = context;

  const validateEmail = (email: string) => {
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      setErrors(prev => ({ ...prev, email: 'Invalid email format.' }));
    } else {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  };

  const validateGstNo = (gstNo: string) => {
    if (gstNo && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstNo)) {
      setErrors(prev => ({ ...prev, gstNo: 'Invalid GSTIN format.' }));
    } else {
      setErrors(prev => ({ ...prev, gstNo: undefined }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'email') validateEmail(value);
    if (name === 'gstNo') validateGstNo(value.toUpperCase());
    setDetails(prev => ({ ...prev, [name]: value }));
  };
  
  const handleToggleChange = (name: 'gstApplicable' | 'tdsApplicable', value: boolean) => {
    setDetails(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.name || !details.financialYear) {
        alert("Company Name and Financial Year are required.");
        return;
    }
    if (errors.email || errors.gstNo) {
        alert("Please fix the errors before submitting.");
        return;
    }
    createNewCompany(details);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full space-y-8 bg-slate-800 p-8 md:p-10 rounded-xl shadow-2xl border border-slate-700">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-white">
            Create a New Company
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Enter the details to get started.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Left Column */}
            <div className="space-y-6">
              <Input label="Company Name" id="name" name="name" type="text" value={details.name} onChange={handleChange} required />
              <Textarea label="Address" id="address" name="address" value={details.address} onChange={handleChange} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <Input label="Country" id="country" name="country" type="text" value={details.country} onChange={handleChange} />
                 <Input label="State" id="state" name="state" type="text" value={details.state} onChange={handleChange} />
              </div>
              <Input label="Pincode" id="pincode" name="pincode" type="text" value={details.pincode} onChange={handleChange} />
               <div>
                <Input label="Email ID" id="email" name="email" type="email" value={details.email} onChange={handleChange} />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
               <Select label="Company Type" id="companyType" name="companyType" value={details.companyType} onChange={handleChange}>
                    <option value="">Select Type</option>
                    <option value="Private">Private Ltd.</option>
                    <option value="Public">Public Ltd.</option>
                    <option value="Proprietor">Proprietorship</option>
                    <option value="LLP">LLP</option>
                    <option value="Firm">Firm</option>
               </Select>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Currency Symbol" id="currencySymbol" name="currencySymbol" type="text" value={details.currencySymbol} onChange={handleChange} />
                <Select label="Financial Year" id="financialYear" name="financialYear" value={details.financialYear} onChange={handleChange} required>
                    {financialYearOptions.map(fy => <option key={fy} value={fy}>{`F.Y. ${fy}`}</option>)}
                </Select>
               </div>
               <Input label="Turnover in Previous Year" id="prevYearTurnover" name="prevYearTurnover" type="number" value={details.prevYearTurnover} onChange={handleChange} />
               <div className='space-y-4'>
                <ToggleSwitch label="GST Applicable" id="gstApplicable" enabled={details.gstApplicable} onChange={(val) => handleToggleChange('gstApplicable', val)} />
                {details.gstApplicable && (
                    <div>
                        <Input label="GST No." id="gstNo" name="gstNo" type="text" value={details.gstNo} onChange={handleChange} placeholder="e.g. 29ABCDE1234F1Z5" />
                        {errors.gstNo && <p className="text-red-400 text-xs mt-1">{errors.gstNo}</p>}
                    </div>
                )}
                <ToggleSwitch label="TDS Applicable" id="tdsApplicable" enabled={details.tdsApplicable} onChange={(val) => handleToggleChange('tdsApplicable', val)} />
               </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={() => navigate('/welcome')}>
              Back
            </Button>
            <Button type="submit">
              Create Company
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCompany;