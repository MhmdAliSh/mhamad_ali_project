import { useEffect, useState } from "react";

const statuses = [
  "Order confirmed",
  "Order placed",
  "Order is being delivered",
];

export default function TrackOrder() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("currentOrder"));
    setOrder(saved);
  }, []);

  useEffect(() => {
    if (!order) return;

    const interval = setInterval(() => {
      setOrder((prev) => {
        if (!prev) return prev;

        const current = statuses.indexOf(prev.status);

        if (current === statuses.length - 1) {
          clearInterval(interval);
          return prev;
        }

        const updated = { ...prev, status: statuses[current + 1] };
        localStorage.setItem("currentOrder", JSON.stringify(updated));
        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [order]);

  if (!order) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Track Order</h1>
        <p>You have no active order.</p>
      </div>
    );
  }

  const currentIndex = statuses.indexOf(order.status);

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Tracking Order #{order.orderCode || order.id}
      </h1>

      <div className="space-y-6">
        {statuses.map((s, i) => (
          <div key={s} className="flex items-center gap-4">
            <div
              className={`w-6 h-6 rounded-full border-2 
              ${
                i <= currentIndex
                  ? "bg-green-500 border-green-500"
                  : "border-gray-400"
              }`}
            />

            <p
              className={`text-lg ${
                i <= currentIndex
                  ? "text-green-600 font-semibold"
                  : "text-gray-500"
              }`}
            >
              {s}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-gray-700">
        Current Status: <span className="font-bold">{order.status}</span>
      </p>
    </div>
  );
}
