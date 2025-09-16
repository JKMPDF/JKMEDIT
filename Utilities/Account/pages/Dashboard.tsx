import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { EntryIcon, ReportIcon, ItemsIcon, DataTransferIcon } from '../components/Icon';

const dashboardItems = [
  {
    title: 'Post Entry',
    description: 'Record new vouchers and transactions.',
    icon: <EntryIcon className="w-8 h-8" />,
    path: '/post-entry',
  },
  {
    title: 'View Reports',
    description: 'Access Balance Sheet, P&L, and more.',
    icon: <ReportIcon className="w-8 h-8" />,
    path: '/view-report',
  },
  {
    title: 'Create Items',
    description: 'Manage Ledgers, Stock Items, etc.',
    icon: <ItemsIcon className="w-8 h-8" />,
    path: '/create-items',
  },
  {
    title: 'Data Tools',
    description: 'Import and Export data using CSV files.',
    icon: <DataTransferIcon className="w-8 h-8" />,
    path: '/data-tools',
  }
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-slate-100 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dashboardItems.map((item) => (
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

export default Dashboard;