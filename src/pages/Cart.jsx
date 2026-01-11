import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, addItem, decreaseQty, removeItem, clearCart, total } =
    useCart();
  const API_BASE = "http://localhost:4000/api";
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
        <p className="text-gray-600">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Cart</h1>

      <div className="space-y-6">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white shadow p-4 rounded-lg"
          >
            <div>
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-gray-600">${item.price} each</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => decreaseQty(item.id)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                -
              </button>

              <span className="text-lg font-semibold">{item.qty}</span>

              <button
                onClick={() => addItem(item)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                +
              </button>
            </div>

            <span className="text-lg font-bold">${item.price * item.qty}</span>

            <button
              onClick={() => removeItem(item.id)}
              className="text-red-500 font-bold ml-4"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-10 border-t pt-4">
        <h2 className="text-xl font-bold">Total:</h2>
        <span className="text-2xl font-bold text-green-600">${total}</span>
      </div>

      <button
        onClick={clearCart}
        className="mt-6 w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg"
      >
        Clear Cart
      </button>
      <button
        onClick={async () => {
          try {
            const phoneInput = window.prompt(
              "Enter phone number for tracking:",
              ""
            );
            const phone = phoneInput && phoneInput.trim() ? phoneInput.trim() : "guest";
            const res = await fetch(`${API_BASE}/orders`, {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ phone }),
            });
            const data = await res.json();
            if (!res.ok) {
              alert(data.error || "Failed to place order.");
              return;
            }
            const newOrder = {
              orderCode: data.orderCode,
              status: data.status,
              phone: data.phone,
            };
            localStorage.setItem("currentOrder", JSON.stringify(newOrder));
            await clearCart();
            alert("Order placed! Tracking started.");
            navigate("/track");
          } catch (err) {
            console.error("Failed to place order", err);
          }
        }}
        className="mt-4 w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
      >
        Place Order
      </button>
      <a
        href="/track"
        className="mt-4 block w-full text-center py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
      >
        Track Your Order
      </a>
    </div>
  );
}
