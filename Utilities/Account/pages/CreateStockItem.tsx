import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanyDataContext } from '../context/CompanyDataContext';
import type { StockItem } from '../types';
import Input from '../components/Input';
import Button from '../components/Button';
import { SaveIcon } from '../components/Icon';

const CreateStockItem: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(CompanyDataContext);
  const [itemDetails, setItemDetails] = useState<Omit<StockItem, 'id'>>({
    name: '',
    unit: '',
    hsnCode: '',
    gstRate: 0,
  });

  if (!context) return null;
  const { companyData, addStockItem } = context;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setItemDetails(prev => ({ 
        ...prev, 
        [name]: type === 'number' ? parseFloat(value) || 0 : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemDetails.name || !itemDetails.unit) {
      alert('Item Name and Unit are required.');
      return;
    }
    if (companyData?.stockItems.some(item => item.name.toLowerCase() === itemDetails.name.toLowerCase())) {
        alert('A stock item with this name already exists.');
        return;
    }
    addStockItem(itemDetails);
    alert('Stock item created successfully!');
    // Reset form
    setItemDetails({ name: '', unit: '', hsnCode: '', gstRate: 0 });
  };

  return (
    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-bold text-slate-100 mb-6">Create Stock Item</h1>
        <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-lg shadow-lg space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Item Name" id="name" name="name" value={itemDetails.name} onChange={handleChange} required />
            <Input label="Unit (e.g., Kgs, Pcs, Pkt)" id="unit" name="unit" value={itemDetails.unit} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="HSN Code" id="hsnCode" name="hsnCode" value={itemDetails.hsnCode} onChange={handleChange} />
            <Input label="GST Rate (%)" id="gstRate" name="gstRate" type="number" value={itemDetails.gstRate} onChange={handleChange} min="0" step="0.01" />
          </div>

          <div className="flex justify-between items-center pt-4">
            <Button type="button" variant="secondary" onClick={() => navigate('/create-items')}>
              Back
            </Button>
            <Button type="submit">
              <SaveIcon className="w-5 h-5 mr-2" />
              Save Item
            </Button>
          </div>
        </form>
      </div>

      <div className="lg:col-span-1">
        <h2 className="text-2xl font-bold text-slate-100 mb-6">Existing Items</h2>
        <div className="bg-slate-800 p-4 rounded-lg shadow-lg max-h-[60vh] overflow-y-auto">
          {companyData?.stockItems && companyData.stockItems.length > 0 ? (
            <ul className="divide-y divide-slate-700">
              {companyData.stockItems.map(item => (
                <li key={item.id} className="py-3">
                  <p className="font-semibold text-slate-200">{item.name}</p>
                  <p className="text-sm text-slate-400">Unit: {item.unit} | GST: {item.gstRate || 0}%</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400 text-center py-4">No stock items created yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateStockItem;