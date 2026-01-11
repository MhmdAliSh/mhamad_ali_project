import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartBadge() {
  const { cart } = useCart();

  // calculate total quantity
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <Link
      to="/cart"
      className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white w-14 h-14 
                 flex items-center justify-center rounded-full shadow-xl transition-all"
    >
      <div className="relative">
        <span className="text-2xl">🛒</span>

        {count > 0 && (
          <span
            className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold 
                       rounded-full px-2 py-0.5"
          >
            {count}
          </span>
        )}
      </div>
    </Link>
  );
}
