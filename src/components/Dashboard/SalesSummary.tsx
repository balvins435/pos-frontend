// SalesSummary.tsx
import React from 'react';
import { DollarSign, ShoppingCart, Users, TrendingUp, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface MetricCard {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const SalesSummary: React.FC = () => {
  const metrics: MetricCard[] = [
    {
      title: 'Total Revenue',
      value: '$124,562',
      change: 12.5,
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-green-500'
    },
    {
      title: 'Total Sales',
      value: '1,234',
      change: 8.2,
      icon: <ShoppingCart className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      title: 'New Customers',
      value: '186',
      change: -2.4,
      icon: <Users className="h-6 w-6" />,
      color: 'bg-purple-500'
    },
    {
      title: 'Growth Rate',
      value: '15.3%',
      change: 5.1,
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {metric.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {metric.value}
              </p>
            </div>
            <div className={`${metric.color} p-3 rounded-lg`}>
              <div className="text-white">
                {metric.icon}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className={`flex items-center ${metric.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {metric.change >= 0 ? (
                <ArrowUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 mr-1" />
              )}
              <span className="text-sm font-medium">
                {Math.abs(metric.change)}%
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              vs last month
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SalesSummary;