// FinanceCharts.tsx
import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const FinanceCharts: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  const revenueData = [
    { month: 'Jul', revenue: 45000, expenses: 32000, profit: 13000 },
    { month: 'Aug', revenue: 52000, expenses: 38000, profit: 14000 },
    { month: 'Sep', revenue: 48000, expenses: 35000, profit: 13000 },
    { month: 'Oct', revenue: 61000, expenses: 42000, profit: 19000 },
    { month: 'Nov', revenue: 55000, expenses: 40000, profit: 15000 },
    { month: 'Dec', revenue: 67000, expenses: 45000, profit: 22000 }
  ];

  const cashFlowData = [
    { week: 'Week 1', inflow: 25000, outflow: 18000, net: 7000 },
    { week: 'Week 2', inflow: 32000, outflow: 22000, net: 10000 },
    { week: 'Week 3', inflow: 28000, outflow: 25000, net: 3000 },
    { week: 'Week 4', inflow: 35000, outflow: 20000, net: 15000 }
  ];

  const expenseBreakdown = [
    { name: 'Payroll', value: 45000, color: '#3B82F6' },
    { name: 'Rent', value: 12000, color: '#10B981' },
    { name: 'Utilities', value: 8000, color: '#F59E0B' },
    { name: 'Marketing', value: 15000, color: '#EF4444' },
    { name: 'Supplies', value: 10000, color: '#8B5CF6' },
    { name: 'Other', value: 7000, color: '#6B7280' }
  ];

  const profitMarginData = [
    { quarter: 'Q1 2024', margin: 18.5 },
    { quarter: 'Q2 2024', margin: 21.2 },
    { quarter: 'Q3 2024', margin: 19.8 },
    { quarter: 'Q4 2024', margin: 23.4 }
  ];

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Financial Analytics
        </h2>
        <div className="flex items-center space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
          </select>
        </div>
      </div>

      {/* Revenue vs Expenses Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Revenue vs Expenses
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                className="text-gray-600 dark:text-gray-400" 
              />
              <YAxis 
                className="text-gray-600 dark:text-gray-400"
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgb(31 41 55)', 
                  border: '1px solid rgb(75 85 99)',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stackId="1"
                stroke="#10B981" 
                fill="#10B981"
                fillOpacity={0.6}
                name="Revenue"
              />
              <Area 
                type="monotone" 
                dataKey="expenses" 
                stackId="2"
                stroke="#EF4444" 
                fill="#EF4444"
                fillOpacity={0.6}
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Weekly Cash Flow
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="week" 
                  className="text-gray-600 dark:text-gray-400" 
                />
                <YAxis 
                  className="text-gray-600 dark:text-gray-400"
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgb(31 41 55)', 
                    border: '1px solid rgb(75 85 99)',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
                <Legend />
                <Bar dataKey="inflow" fill="#10B981" name="Inflow" />
                <Bar dataKey="outflow" fill="#EF4444" name="Outflow" />
                <Bar dataKey="net" fill="#3B82F6" name="Net" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Expense Breakdown
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent !== undefined ? (percent * 100).toFixed(0) : '0'}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Profit Margin Trend */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Profit Margin Trend
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={profitMarginData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="quarter" 
                className="text-gray-600 dark:text-gray-400" 
              />
              <YAxis 
                className="text-gray-600 dark:text-gray-400"
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgb(31 41 55)', 
                  border: '1px solid rgb(75 85 99)',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`${value}%`, 'Profit Margin']}
              />
              <Line 
                type="monotone" 
                dataKey="margin" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FinanceCharts;