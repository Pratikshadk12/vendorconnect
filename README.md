# 🛒 VendorConnect

<p align="center">

### Smart Platform Connecting Street Vendors with Nearby Customers

A modern full-stack web application that helps customers discover nearby street vendors, browse their products, and place orders seamlessly while enabling vendors to manage their business digitally.

---

## 📌 Problem Statement

Street vendors often struggle to reach customers due to the lack of digital visibility. Customers also find it difficult to locate nearby vendors selling the products they need.

VendorConnect bridges this gap by providing a location-based platform where customers can easily discover nearby vendors and vendors can expand their reach through a digital storefront.

---

# 🚀 Features

### 👤 Customer

- User Registration & Login
- JWT Authentication
- Browse Nearby Vendors
- Interactive Map View
- Search Vendors
- View Vendor Profiles
- Browse Products
- Add to Cart
- Place Orders
- View Order History
- Favorite Vendors
- Responsive UI

---

### 🏪 Vendor

- Vendor Login
- Vendor Dashboard
- Manage Products
- Accept Orders
- Track Customer Orders
- View Sales Overview
- Manage Availability

---

## 🛠 Tech Stack

### Frontend

- Next.js
- React.js
- Tailwind CSS
- Leaflet
- OpenStreetMap
- Axios

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication

- JWT
- bcrypt

### Tools

- Git
- GitHub
- VS Code
- Postman

---

# 🏗 System Architecture

```
                   Customer
                       │
                Next.js Frontend
                       │
                REST API Requests
                       │
              Express.js Backend
                       │
      JWT Authentication Middleware
                       │
                  MongoDB Atlas
                       │
          Vendor & Customer Database
```

---

# 📂 Project Structure

```
VendorConnect
│
├── frontend
│   ├── app
│   ├── components
│   ├── public
│   └── styles
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── config
│   └── server.js
│
├── assets
│
├── README.md
└── package.json
```

---

# 📸 Screenshots

> Add screenshots inside the **assets/** folder.

Example:

```
assets/

home.png

login.png

dashboard.png

vendor-list.png

map-view.png

cart.png

orders.png
```

Then display them like

```markdown
## Home Page

![Home](assets/home.png)

## Vendor List

![Vendor List](assets/vendor-list.png)

## Map View

![Map](assets/map-view.png)
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/Pratikshadk12/vendorconnect.git
```

Move inside the folder

```bash
cd vendorconnect
```

---

## Install Frontend

```bash
cd frontend

npm install
```

---

## Install Backend

```bash
cd backend

npm install
```

---

## Configure Environment Variables

Create a `.env` file inside backend.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection

JWT_SECRET=your_secret
```

---

## Run Backend

```bash
npm run dev
```

---

## Run Frontend

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

# 📡 API Overview

## Authentication

```
POST /api/auth/register

POST /api/auth/login
```

---

## Vendors

```
GET /api/vendors

GET /api/vendors/:id
```

---

## Orders

```
POST /api/orders

GET /api/orders
```

---

## Customers

```
GET /api/customers/profile
```

---

# 🧠 Challenges Faced

- Designing scalable backend APIs
- Implementing secure JWT authentication
- Integrating interactive maps
- Managing customer and vendor workflows
- Handling order management efficiently
- Building a responsive UI across devices

---

# 🌟 Future Scope

- Live vendor tracking
- Online payment integration
- Push notifications
- AI-based vendor recommendations
- Voice search
- Multi-language support
- Analytics Dashboard
- Rating & Review System
- Inventory Management
- Delivery Partner Integration

---

# 📈 Project Highlights

✅ Full Stack Development

✅ REST APIs

✅ Authentication

✅ MongoDB Database Design

✅ Responsive UI

✅ Interactive Maps

✅ Location-Based Search

---

# 👩‍💻 Author

**Pratiksha D K**

B.Tech (Artificial Intelligence & Machine Learning)

REVA University

GitHub: https://github.com/Pratikshadk12

LinkedIn: https://www.linkedin.com/in/pratiksha-d-korishettar

---

# ⭐ Support

If you found this project useful,

⭐ Star this repository

🍴 Fork it

📢 Share it

---

## 📄 License

This project is licensed under the MIT License.
