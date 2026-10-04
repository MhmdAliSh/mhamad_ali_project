import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import localMenu from "../data/menu.json";

const API_BASE = "http://localhost:4000/api";

export default function Menu() {
  const { addItem } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingLocalMenu, setUsingLocalMenu] = useState(false);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const menusRes = await fetch(`${API_BASE}/menus`);
        if (!menusRes.ok) throw new Error("Menu service is unavailable.");
        const menus = await menusRes.json();
        if (!menus.length) {
          setItems([]);
          return;
        }
        const itemsRes = await fetch(
          `${API_BASE}/menus/${menus[0].id}/items`
        );
        if (!itemsRes.ok) throw new Error("Could not load menu items.");
        const menuItems = await itemsRes.json();
        setItems(menuItems);
      } catch (err) {
        console.error("Failed to load menu", err);
        setItems(localMenu);
        setUsingLocalMenu(true);
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-10 text-center">Our Menu</h1>

      {loading && <p className="text-center text-gray-600">Loading menu…</p>}
      {!loading && usingLocalMenu && (
        <p className="text-center text-gray-600 mb-6">
          Showing our saved menu. Live ordering may be unavailable.
        </p>
      )}
      {!loading && !usingLocalMenu && items.length === 0 && (
        <p className="text-center text-gray-600">Our menu is being prepared. Please check back soon.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-lg rounded-xl overflow-hidden hover:scale-[1.02] transition-transform"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-48 w-full object-cover"
            />

            <div className="p-5">
              <h2 className="text-xl font-bold mb-2">{item.name}</h2>
              <p className="text-gray-600 text-sm mb-3">{item.description}</p>

              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">${item.price}</span>

                <button
                  onClick={() => addItem(item)}
                  className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm active:scale-95 active:bg-orange-700 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
