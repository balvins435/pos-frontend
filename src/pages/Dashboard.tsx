"use client";
import React from "react";
import SalesSummary from "../components/Dashboard/SalesSummary";
import InventoryAlerts from "../components/Dashboard/InventoryAlerts";
import Charts from "../components/Dashboard/Charts";
import useAutoLogout from "../hooks/useAutoLogouts";

const Dashboard: React.FC = () => {
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // window.location.href = "/login";
  };

  // Auto logout after 30 mins inactivity
  useAutoLogout(logout, 30);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Sales Summary - stack on mobile, grid on larger screens */}
      <div className="w-full">
        <SalesSummary />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <Charts />
        </div>

        {/* Inventory Alerts */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <InventoryAlerts />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
