// InventoryAlerts.tsx
import React from 'react';
import { AlertTriangle, Package, Clock } from 'lucide-react';

interface Alert {
  id: string;
  type: 'low-stock' | 'out-of-stock' | 'expiring';
  product: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
}

const InventoryAlerts: React.FC = () => {
  const alerts: Alert[] = [
    {
      id: '1',
      type: 'out-of-stock',
      product: 'iPhone 15 Pro',
      message: 'Out of stock',
      severity: 'high'
    },
    {
      id: '2',
      type: 'low-stock',
      product: 'Samsung Galaxy S24',
      message: 'Only 3 units left',
      severity: 'medium'
    },
    {
      id: '3',
      type: 'expiring',
      product: 'Product Warranty',
      message: 'Expires in 2 days',
      severity: 'medium'
    },
    {
      id: '4',
      type: 'low-stock',
      product: 'MacBook Air M2',
      message: 'Only 1 unit left',
      severity: 'high'
    }
  ];

  const getIcon = (type: Alert['type']) => {
    switch (type) {
      case 'out-of-stock':
        return <Package className="h-4 w-4 text-red-500" />;
      case 'low-stock':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'expiring':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-3">Inventory Alerts</h2>
      <ul className="space-y-2">
        {alerts.map((alert) => (
          <li
            key={alert.id}
            className={`flex items-center gap-3 p-3 rounded-xl border ${getSeverityColor(alert.severity)}`}
          >
            {getIcon(alert.type)}
            <div>
              <p className="font-medium">{alert.product}</p>
              <p className="text-sm">{alert.message}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InventoryAlerts;
