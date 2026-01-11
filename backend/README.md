# Italica – Backend API

## Overview

Node.js + Express + MySQL backend that powers menus, cart, orders, contact submissions,
and admin item management. All APIs are namespaced under `/api/*` and the server runs
on port `4000` by default.

## Stack

- Node.js (LTS)
- Express
- MySQL 8
- mysql2
- dotenv
- cors
- uuid

## Setup

1. Install dependencies:
```
npm install
```

2. Configure environment:
```
cp .env.example .env
```

3. Create the database and use schema to initialize the tables:

4. Start the API server:
```
npm run start
```

## Environment Variables

- `PORT` (default: 4000)
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_PORT`
- `CORS_ORIGIN` (Vite dev server, e.g. `http://localhost:5173`)

## Database Model

- `menus` Single default menu (id=1) for all items.
- `menu_items` Menu items with name, description, price, image data URL, availability.
- `carts` Guest carts keyed by UUID (cookie-based).
- `cart_items` Items inside a cart with quantity.
- `orders` Placed orders with order code, phone, total, status.
- `order_items` Line items for an order.
- `order_status_events` Status history (updated when tracking).
- `contact_messages` Contact form submissions.

## API Endpoints

### Menu
- `GET /api/menus`
- `GET /api/menus/:menuId/items`

### Cart (guest, cookie-based)
- `POST /api/cart/init`
- `GET /api/cart`
- `POST /api/cart/items`
- `PATCH /api/cart/items/:itemId`
- `DELETE /api/cart/items/:itemId`
- `DELETE /api/cart`

### Orders
- `POST /api/orders`
- `GET /api/orders/track?orderCode=&phone=`

### Contact
- `POST /api/contact`

### Admin (open access, URL-based only)
- `GET /api/admin/items`
- `POST /api/admin/items`
- `PATCH /api/admin/items/:id`
- `DELETE /api/admin/items/:id`

## Admin Behavior

- Items are tied to a single default menu (id=1) created by schema.
- Images are stored in `menu_items.image_url` as data URLs.

## Notes

- The cart uses a `cartId` cookie; if the cart is missing in the DB, a new cart is created.
- JSON body limit is increased to accept data URLs from image uploads.
