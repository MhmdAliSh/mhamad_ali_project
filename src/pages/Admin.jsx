import { useEffect, useState } from "react";

const API_BASE = "http://localhost:4000/api";

export default function Admin() {
  const [message, setMessage] = useState("");
  const [items, setItems] = useState([]);
  const [itemEdits, setItemEdits] = useState({});
  const [itemForm, setItemForm] = useState({
    name: "",
    description: "",
    price: "",
    isActive: true,
  });
  const [itemFile, setItemFile] = useState(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/items`);
        const data = await res.json();
        setItems(data);
        const edits = {};
        data.forEach((item) => {
          edits[item.id] = {
            name: item.name || "",
            description: item.description || "",
            price: item.price || "",
            imageUrl: item.imageUrl || "",
            isActive: item.isActive ?? true,
          };
        });
        setItemEdits(edits);
      } catch (err) {
        console.error("Failed to load items", err);
      }
    };

    loadItems();
  }, []);

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

  const handleItemFileChange = async (itemId, file) => {
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setItemEdits((prev) => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          imageUrl: dataUrl,
        },
      }));
    } catch (err) {
      console.error("Failed to read image file", err);
    }
  };

  const handleCreateItem = async (event) => {
    event.preventDefault();
    try {
      let imageUrl = "";
      if (itemFile) {
        imageUrl = await readFileAsDataUrl(itemFile);
      }
      const payload = {
        name: itemForm.name,
        description: itemForm.description,
        price: Number(itemForm.price),
        imageUrl,
        isActive: itemForm.isActive,
      };
      const res = await fetch(`${API_BASE}/admin/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Failed to create item");
        return;
      }
      setMessage("Item created.");
      setItemForm({
        name: "",
        description: "",
        price: "",
        isActive: true,
      });
      setItemFile(null);
      const newItem = { id: data.id, ...payload };
      setItems((prev) => [...prev, newItem]);
      setItemEdits((prev) => ({
        ...prev,
        [data.id]: {
          name: newItem.name || "",
          description: newItem.description || "",
          price: newItem.price || "",
          imageUrl: newItem.imageUrl || "",
          isActive: newItem.isActive ?? true,
        },
      }));
    } catch (err) {
      console.error("Create item failed", err);
    }
  };

  const handleUpdateItem = async (itemId) => {
    try {
      const payload = itemEdits[itemId];
      const res = await fetch(`${API_BASE}/admin/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: payload.name,
          description: payload.description,
          price: Number(payload.price),
          imageUrl: payload.imageUrl,
          isActive: payload.isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Failed to update item");
        return;
      }
      setMessage("Item updated.");
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                name: payload.name,
                description: payload.description,
                price: Number(payload.price),
                imageUrl: payload.imageUrl,
                isActive: payload.isActive,
              }
            : item
        )
      );
    } catch (err) {
      console.error("Update item failed", err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const res = await fetch(`${API_BASE}/admin/items/${itemId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error || "Failed to delete item");
        return;
      }
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      setMessage("Item deleted.");
    } catch (err) {
      console.error("Delete item failed", err);
    }
  };

  return (
    <div className="p-10 max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center">Admin Panel</h1>

      {message && (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded">
          {message}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <h2 className="text-2xl font-semibold">Items</h2>

        <form onSubmit={handleCreateItem} className="grid md:grid-cols-5 gap-3">
          <input
            className="border rounded px-3 py-2"
            placeholder="Name"
            value={itemForm.name}
            onChange={(e) =>
              setItemForm((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Description"
            value={itemForm.description}
            onChange={(e) =>
              setItemForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Price"
            value={itemForm.price}
            onChange={(e) =>
              setItemForm((prev) => ({ ...prev, price: e.target.value }))
            }
          />
          <input
            className="border rounded px-3 py-2"
            type="file"
            accept="image/*"
            onChange={(e) => setItemFile(e.target.files?.[0] || null)}
          />
          <button className="py-2 bg-green-500 text-white rounded">
            Add Item
          </button>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={itemForm.isActive}
              onChange={(e) =>
                setItemForm((prev) => ({
                  ...prev,
                  isActive: e.target.checked,
                }))
              }
            />
            Available
          </label>
        </form>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 grid md:grid-cols-6 gap-2 items-center"
            >
              <input
                className="border rounded px-3 py-2"
                value={itemEdits[item.id]?.name || ""}
                onChange={(e) =>
                  setItemEdits((prev) => ({
                    ...prev,
                    [item.id]: {
                      ...prev[item.id],
                      name: e.target.value,
                    },
                  }))
                }
              />
              <input
                className="border rounded px-3 py-2"
                value={itemEdits[item.id]?.description || ""}
                onChange={(e) =>
                  setItemEdits((prev) => ({
                    ...prev,
                    [item.id]: {
                      ...prev[item.id],
                      description: e.target.value,
                    },
                  }))
                }
              />
              <input
                className="border rounded px-3 py-2"
                value={itemEdits[item.id]?.price || ""}
                onChange={(e) =>
                  setItemEdits((prev) => ({
                    ...prev,
                    [item.id]: {
                      ...prev[item.id],
                      price: e.target.value,
                    },
                  }))
                }
              />
              <input
                className="border rounded px-3 py-2"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleItemFileChange(item.id, e.target.files?.[0] || null)
                }
              />
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={itemEdits[item.id]?.isActive ?? true}
                  onChange={(e) =>
                    setItemEdits((prev) => ({
                      ...prev,
                      [item.id]: {
                        ...prev[item.id],
                        isActive: e.target.checked,
                      },
                    }))
                  }
                />
                Available
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateItem(item.id)}
                  className="px-3 py-2 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteItem(item.id)}
                  className="px-3 py-2 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
