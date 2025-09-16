import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { LedgerIcon, StockIcon } from '../components/Icon';
import Button from '../components/Button';

const masterItems = [
  {
    title: 'Create Ledger',
    description: 'Manage accounts for parties and expenses.',
    icon: <LedgerIcon className="w-8 h-8" />,
    path: '/create-ledger',
  },
  {
    title: 'Create Stock Item',
    description: 'Define and manage your inventory.',
    icon: <StockIcon className="w-8 h-8" />,
    path: '/create-stock',
  },
];

const CreateItems: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-100">Create Items</h1>
        <Button onClick={() => navigate('/')} variant="secondary">Back to Dashboard</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {masterItems.map((item) => (
          <Card
            key={item.title}
            title={item.title}
            description={item.description}
            icon={item.icon}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>
    </div>
  );
};

export default CreateItems;