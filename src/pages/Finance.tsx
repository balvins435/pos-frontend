import React from 'react';
import FinanceCards from '../components/Finance/FinanceCards';
import FinanceCharts from '../components/Finance/FinanceCharts';

const Finance: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Financial Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor your business financial performance and analytics
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Finance Summary Cards */}
      <FinanceCards />

      {/* Charts and Analytics */}
      <FinanceCharts />
    </div>
  );
};

export default Finance;