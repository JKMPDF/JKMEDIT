import React, { useContext } from 'react';
import { CompanyDataContext } from '../context/CompanyDataContext';
import Button from './Button';
import { ExportIcon, LogoutIcon } from './Icon';

const Header: React.FC = () => {
  const context = useContext(CompanyDataContext);

  if (!context) return null;

  const { companyData, exportDataAsJson, logout } = context;

  return (
    <header className="bg-slate-800 shadow-lg p-4 flex justify-between items-center sticky top-0 z-10 border-b border-slate-700">
      <div className="text-xl md:text-2xl font-bold text-indigo-400">
        {companyData?.details.name || 'JKM Edit'}
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <Button onClick={exportDataAsJson} variant="secondary">
          <ExportIcon className="w-5 h-5 mr-2" />
          <span className="hidden sm:inline">Export Company</span>
        </Button>
        <Button onClick={logout} variant="danger">
           <LogoutIcon className="w-5 h-5 mr-2" />
           <span className="hidden sm:inline">Close</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;