const CheckoutPanel = ({ total }: { total: number }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
    <h3 className="text-lg font-bold mb-2">Checkout</h3>
    <p>Total: KES {total}</p>
    <button className="bg-green-500 text-white px-4 py-2 rounded">Complete Sale</button>
  </div>
);

export default CheckoutPanel;
