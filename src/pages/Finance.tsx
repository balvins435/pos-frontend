// Finance.tsx
import Sidebar from '../components/Sidebar/Sidebar';
import Navbar from '../components/Navbar/Navbar';
import SalesSummary from '../components/Dashboard/SalesSummary';
import InventoryAlerts from '../components/Dashboard/InventoryAlerts';
import Charts from '../components/Dashboard/Charts';

const Finance = () => (
  <div className="flex">
    <Sidebar />
    <div className="flex-1">
      <Navbar />
      <div className="p-6">
        <SalesSummary />
        <InventoryAlerts />
        <Charts />
      </div>
    </div>
  </div>
);

export default Finance;
