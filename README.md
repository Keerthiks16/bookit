
# 🌍 BookIt: Experiences & Slots

**BookIt** is a full-stack web application built for an intern assignment. It allows users to browse travel experiences, check availability, and book slots.  
The platform also includes a complete **Admin Panel** for managing experiences, images, and time slots.

This repository contains both the **Frontend (React + TypeScript)** and **Backend (Node.js + Express)** code.

---

## ✨ Features

### 🧳 User Features
- **Browse Experiences:** View a grid of all available experiences.
- **Search:** Filter experiences by title or location in real-time.
- **View Details:** See detailed information, available dates, and time slots for an experience.
- **Slot Selection:** Select an available date and time. Sold-out and limited-availability slots are clearly marked.
- **Booking Flow:** A multi-step booking process (Details → Checkout → Result).
- **Authentication:** Secure user registration and login using **JWT**.
- **Protected Routes:** User-specific pages like *My Bookings* and *Checkout* are protected.
- **Promo Codes:** Apply a promo code at checkout for discounts.
- **Map View:** `/explore` page displays all experiences on an interactive **Leaflet map**.

### 🛠️ Admin Features
- **Admin Dashboard:** A central hub for all admin-only actions.
- **Role-Based Access:** Only users with the *admin role* can access the admin panel.
- **Create Experience:** Add new experiences with **image upload (Cloudinary)** and **location inputs (lat/long)**.
- **Manage Slots:** Add and manage time slots (date, time, capacity) for each experience.
- **Error Handling:** Clear error messages for issues like duplicate slots or file size limits.

---

## 🚀 Tech Stack

### 🧩 Backend (Server)
- **Runtime:** Node.js  
- **Framework:** Express.js  
- **Database:** MongoDB (with Mongoose)  
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs for password hashing  
- **File Storage:** Cloudinary for image uploads  
- **Middleware:** cors, multer (for file handling)

### 💻 Frontend (Client)
- **Framework:** React 18 (with Vite)  
- **Language:** TypeScript  
- **Styling:** Tailwind CSS  
- **Routing:** react-router-dom v6  
- **State Management:** Zustand  
- **API Client:** Axios  
- **Mapping:** react-leaflet & leaflet  
- **Icons:** lucide-react

---

## 🏁 Setup and Installation

You must run both the **server** and **client** in separate terminal windows.

---

### ⚙️ 1. Backend Setup (Server)

Navigate to the server directory:

```bash
cd server
````

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
# Create a file named .env in the server root
```

Copy the contents of `.env.example` (if present) or use the template below.

Run the server:

```bash
npm run dev
```

The server will be running at **[http://localhost:5001](http://localhost:5001)**.

#### 🧾 Server `.env` Template

```env
# Server Port
PORT=5001

# MongoDB connection string
MONGO_URI=your_mongodb_connection_string_here

# JWT Secret
JWT_SECRET=your_super_secret_key_for_tokens

# Cloudinary credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

### 💻 2. Frontend Setup (Client)

Navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
# Create a file named .env.local in the client root
```

Run the client:

```bash
npm run dev
```

The client will be running at **[http://localhost:5173](http://localhost:5173)**.

#### 🧾 Client `.env.local` Template

```env
# Local backend API URL
VITE_API_URL=http://localhost:5001/api
```

---

## 🔑 API Endpoints

All endpoints are prefixed with `/api`.

### 🔐 Auth

| Method | Endpoint         | Description                     |
| ------ | ---------------- | ------------------------------- |
| POST   | `/auth/register` | Create a new user               |
| POST   | `/auth/login`    | Log in a user and receive a JWT |

### 🧭 Experiences & Slots

| Method | Endpoint                           | Description                                                          |
| ------ | ---------------------------------- | -------------------------------------------------------------------- |
| GET    | `/experiences`                     | Get all experiences                                                  |
| GET    | `/experiences/:id`                 | Get a single experience and its available slots                      |
| POST   | `/experiences`                     | *(Admin Only)* Create a new experience (expects FormData with image) |
| POST   | `/experiences/:experienceId/slots` | *(Admin Only)* Add a new slot to an experience                       |

### 📅 Bookings

| Method | Endpoint                | Description                                           |
| ------ | ----------------------- | ----------------------------------------------------- |
| POST   | `/bookings`             | *(User Only)* Create a new booking                    |
| GET    | `/bookings/my-bookings` | *(User Only)* Get all bookings for the logged-in user |

### 💸 Promo Codes

| Method | Endpoint          | Description                            |
| ------ | ----------------- | -------------------------------------- |
| POST   | `/promo/validate` | *(User Only)* Validate a promo code    |
| POST   | `/promo`          | *(Admin Only)* Create a new promo code |

---

## 📸 Screenshots (Optional)

*Add your project screenshots here (e.g., homepage, booking flow, admin dashboard).*

---

