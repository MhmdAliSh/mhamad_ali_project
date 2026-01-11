
# Italica – Restaurant Menu Website (Frontend)

## Overview

Italica is a modern, responsive restaurant site built with React, Vite, and TailwindCSS.
The frontend integrates with a Node/Express/MySQL backend for menu, cart, and orders, and
includes a standalone admin page for content management.

## Routes

- `/` Home page
- `/about` About page
- `/menu` Menu listing from the backend
- `/cart` Cart page (backend cart API)
- `/contact` Contact page
- `/track` Order tracking (local progression)
- `/admin` Admin-only page (URL access only, no navbar/cart/footer)

## Components and Responsibilities

- `src/App.jsx` Route layout and hides navbar/cart/footer on `/admin`.
- `src/components/Navbar.jsx` Top navigation (no Admin or Cart link).
- `src/components/CartBadge.jsx` Floating cart count badge (hidden on `/admin`).
- `src/components/Footer.jsx` Site footer (hidden on `/admin`).
- `src/context/CartContext.jsx` Central cart state; calls `/api/cart/*` endpoints.
- `src/pages/Home.jsx` Static hero/landing content.
- `src/pages/About.jsx` Restaurant story and static content.
- `src/pages/Menu.jsx` Fetches menus + items from `/api/menus` and `/api/menus/:menuId/items`.
- `src/pages/Cart.jsx` Cart view and checkout; places orders via `/api/orders`.
- `src/pages/TrackOrder.jsx` Reads `currentOrder` from localStorage and advances status over time.
- `src/pages/Contact.jsx` Static contact information.
- `src/pages/Admin.jsx` Standalone admin page with CRUD for items and image upload.

## Data Flow

- Menu items are fetched from the backend. Images are stored as data URLs for admin uploads.
- Cart uses a guest cookie managed by the backend (`cartId`) and is stored in MySQL.
- On checkout, `/api/orders` returns an `orderCode`. The frontend stores it in
  `localStorage` as `currentOrder`, then redirects to `/track`.
- Tracking uses local status progression (no backend polling).

## Running the Frontend

1. Install dependencies:
```
npm install
```

2. Start the dev server:
```
npm run dev
```

3. Make sure the backend is running on `http://localhost:4000` and CORS allows your Vite origin.

## Screens (Optional)

<img width="1916" height="908" alt="home" src="https://github.com/user-attachments/assets/3f8cecd0-6c8a-43d1-9ade-5301b8bc9178" />
<img width="1886" height="896" alt="menu" src="https://github.com/user-attachments/assets/28b68f47-725f-470e-91b0-fd98e004374a" />
<img width="1863" height="892" alt="CART" src="https://github.com/user-attachments/assets/036cd9e5-b05c-4f4f-91bc-bc204d6b5bda" />
<img width="1902" height="824" alt="ABOUT" src="https://github.com/user-attachments/assets/878f5540-795e-48f8-8446-140cb6449735" />


