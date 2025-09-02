import { Pie } from 'react-chartjs-2';

const FinanceCharts = () => {
  const data = {
    labels: ['Sales', 'Expenses'],
    datasets: [{ data: [15000, 5000], backgroundColor: ['#10b981', '#ef4444'] }]
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-2">Finance Breakdown</h3>
      <Pie data={data} />
    </div>
  );
};

export default FinanceCharts;
