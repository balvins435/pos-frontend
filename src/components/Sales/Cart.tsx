const Cart = ({ items }: any) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
    <h3 className="text-lg font-bold mb-2">Cart</h3>
    <ul>
      {items.map((item: any, i: number) => (
        <li key={i}>{item.name} x {item.quantity}</li>
      ))}
    </ul>
  </div>
);

export default Cart;
