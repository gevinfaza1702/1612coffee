import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const addToCart = () => {
    addItem({
      key: `prod:${product.slug}`,
      type: "product",
      name: product.name,
      price: product.price,
      qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 700);
  };

  return (
    <div className="border rounded-lg p-3 flex flex-col justify-between bg-white shadow-sm">
      <div>
        <img src={product.image} alt={product.name} className="rounded mb-2" />
        <h3 className="font-semibold text-[var(--coffee)]">{product.name}</h3>
        <p className="text-sm text-slate-600">{product.beanType}</p>
        <p className="font-bold text-[var(--coffee)]">
          Rp {product.price.toLocaleString("id-ID")}
        </p>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-center mb-3">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="px-2 border rounded-l"
          >
            -
          </button>
          <input
            type="text"
            value={qty}
            readOnly
            className="w-10 text-center border-t border-b"
          />
          <button
            onClick={() => setQty(qty + 1)}
            className="px-2 border rounded-r"
          >
            +
          </button>
        </div>

        <button
          onClick={addToCart}
          className={`w-full rounded py-2 text-white transition ${
            added ? "bg-green-600 scale-105" : "bg-[var(--coffee)] hover:bg-[#5c3217]"
          }`}
        >
          {added ? "✅ Ditambahkan!" : "Tambah"}
        </button>
      </div>
    </div>
  );
}
