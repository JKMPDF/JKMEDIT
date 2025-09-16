
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  return (
    <div className="text-center bg-slate-800/50 p-10 rounded-lg">
      <h1 className="text-3xl font-bold text-indigo-400 mb-4">{title}</h1>
      <p className="text-slate-300 mb-6">This feature is under construction.</p>
      <Link to="/">
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
};

export default PlaceholderPage;