import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CompanyDataContext } from './context/CompanyDataContext';
import Welcome from './pages/Welcome';
import CreateCompany from './pages/CreateCompany';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import CreateItems from './pages/CreateItems';
import CreateLedger from './pages/CreateLedger';
import PostEntry from './pages/PostEntry';
import DayBook from './pages/DayBook';
import Reports from './pages/Reports';
import BalanceSheet from './pages/BalanceSheet';
import ProfitAndLoss from './pages/ProfitAndLoss';
import CreateStockItem from './pages/CreateStockItem';
import DataTools from './pages/DataTools';

const App: React.FC = () => {
  const context = useContext(CompanyDataContext);

  if (context === undefined) {
    return <div>Loading...</div>; // Or some other loading state
  }
  
  const { companyData, loading } = context;

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen bg-slate-900">
            <div className="text-xl text-slate-300">Loading Application...</div>
        </div>
    );
  }

  return (
    <Routes>
      {companyData ? (
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/create-items" element={<CreateItems />} />
          <Route path="/post-entry" element={<PostEntry />} />
          <Route path="/view-report" element={<Reports />} />
          <Route path="/reports/day-book" element={<DayBook />} />
          <Route path="/reports/balance-sheet" element={<BalanceSheet />} />
          <Route path="/reports/profit-and-loss" element={<ProfitAndLoss />} />
          <Route path="/create-ledger" element={<CreateLedger />} />
          <Route path="/create-stock" element={<CreateStockItem />} />
          <Route path="/data-tools" element={<DataTools />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      ) : (
        <>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/create-company" element={<CreateCompany />} />
          <Route path="*" element={<Navigate to="/welcome" />} />
        </>
      )}
    </Routes>
  );
};

export default App;