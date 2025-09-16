import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { BookOpenIcon, ScaleIcon, ChartPieIcon } from '../components/Icon';
import Button from '../components/Button';

const reportItems = [
  {
    title: 'Day Book',
    description: 'View all voucher entries chronologically.',
    icon: <BookOpenIcon className="w-8 h-8" />,
    path: '/reports/day-book',
  },
  {
    title: 'Profit & Loss',
    description: 'View income, expenses, and net profit.',
    icon: <ChartPieIcon className="w-8 h-8" />,
    path: '/reports/profit-and-loss',
  },
  {
    title: 'Balance Sheet',
    description: 'View assets, liabilities, and equity.',
    icon: <ScaleIcon className="w-8 h-8" />,
    path: '/reports/balance-sheet',
  },
];

const Reports: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-100">Reports</h1>
        <Button onClick={() => navigate('/')} variant="secondary">Back to Dashboard</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {reportItems.map((item) => (
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

export default Reports;