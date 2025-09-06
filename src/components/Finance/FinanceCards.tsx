// FinanceCards.tsx
import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  PiggyBank, 
  Receipt,
  ArrowUpIcon,
  ArrowDownIcon
} from 'lucide-react';

interface FinanceMetric {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

const FinanceCards: React.FC = () => {
  const metrics: FinanceMetric[] = [
    {
      title: 'Total Revenue',
      value: '$248,920',
      change: 15.2,
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-green-500',
      subtitle: 'This month'
    },
    {
      title: 'Net Profit',
      value: '$89,340',
      change: 8.7,
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-blue-500',
      subtitle: 'After expenses'
    },
    {
      title: 'Total Expenses',
      value: '$159,580',
      change: -3.2,
      icon: <Receipt className="h-6 w-6" />,
      color: 'bg-red-500',
      subtitle: 'Operating costs'
    },
    {
      title: 'Cash Flow',
      value: '$45,680',
      change: 12.1,
      icon: <PiggyBank className="h-6 w-6" />,
      color: 'bg-purple-500',
      subtitle: 'Available funds'
    },
    {
      title: 'Outstanding Invoices',
      value: '$23,456',
      change: -5.8,
      icon: <CreditCard className="h-6 w-6" />,
      color: 'bg-orange-500',
      subtitle: '18 pending'
    },
    {
      title: 'Monthly Growth',
      value: '12.4%',
      change: 2.3,
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-teal-500',
      subtitle: 'Revenue growth'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`${metric.color} p-3 rounded-lg`}>
              <div className="text-white">
                {metric.icon}
              </div>
            </div>
            <div className={`flex items-center text-sm font-medium ${
              metric.change >= 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {metric.change >= 0 ? (
                <ArrowUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 mr-1" />
              )}
              {Math.abs(metric.change)}%
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {metric.title}
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {metric.value}
            </p>
            {metric.subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {metric.subtitle}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FinanceCards;