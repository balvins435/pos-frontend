import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  DollarSign, 
  Users, 
  Settings,
  BarChart3,
  FileText
} from 'lucide-react';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

const Sidebar: React.FC = () => {
  const navItems: NavItem[] = [
    {
      to: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: 'Dashboard'
    },
    {
      to: '/sales',
      icon: <ShoppingCart className="h-5 w-5" />,
      label: 'Sales',
      badge: 5
    },
    {
      to: '/inventory',
      icon: <Package className="h-5 w-5" />,
      label: 'Inventory'
    },
    {
      to: '/finance',
      icon: <DollarSign className="h-5 w-5" />,
      label: 'Finance'
    },
    {
      to: '/customers',
      icon: <Users className="h-5 w-5" />,
      label: 'Customers'
    },
    {
      to: '/reports',
      icon: <BarChart3 className="h-5 w-5" />,
      label: 'Reports'
    },
    {
      to: '/documents',
      icon: <FileText className="h-5 w-5" />,
      label: 'Documents'
    }
  ];

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="p-4">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.5rem] text-center">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Settings at bottom */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <Settings className="h-5 w-5" />
            <span className="font-medium">Settings</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;