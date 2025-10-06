import React from "react";
import FinanceCards from "../components/Finance/FinanceCards";
import FinanceCharts from "../components/Finance/FinanceCharts";

const Finance: React.FC = () => {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Title + Subtitle */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Financial Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Monitor your business financial performance and analytics
          </p>
        </div>

        {/* Last Updated */}
        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Finance Summary Cards (responsive grid inside component) */}
      <div className="w-full">
        <FinanceCards />
      </div>

      {/* Charts and Analytics */}
      <div className="w-full">
        <FinanceCharts />
      </div>
    </div>
  );
};

export default Finance;
