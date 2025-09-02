const ProductCard = ({ product }: any) => (
  <div className="border p-4 rounded shadow">
    <h4>{product.name}</h4>
    <p>Price: KES {product.price}</p>
    <button className="bg-blue-500 text-white px-2 py-1 rounded">Add to Cart</button>
  </div>
);

export default ProductCard;
