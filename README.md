# 🍽️ QuickDine — Restaurant Discovery & Reservation Platform

> **Discover. Reserve. Dine.**

QuickDine is a modern **full-stack restaurant discovery and reservation platform** built to connect diners with restaurants through a seamless search and booking experience.

The platform supports **three distinct user roles — Diners, Restaurant Owners, and Administrators** — with role-based access control and dedicated workflows for each type of user.

Diners can discover restaurants, explore detailed restaurant information, and reserve tables, while restaurant owners and administrators can manage listings, reservations, and platform operations through dedicated dashboards.

---

## ✨ Key Features

### 👥 For Diners

* 🔍 Search and discover restaurants
* 📍 Explore restaurant details
* 🖼️ View restaurant images and information
* 📅 Book restaurant tables
* ✅ Complete booking and confirmation flow
* 👤 Secure user authentication
* 📋 Manage reservation-related workflows

### 🏪 For Restaurant Owners

* 🔐 Secure owner authentication
* 📊 Dedicated owner dashboard
* 🏪 Manage restaurant listings
* 🖼️ Upload restaurant images
* 📅 Manage reservations
* 📈 Monitor restaurant activity

### 🛡️ For Administrators

* 🔐 Secure admin authentication
* 📊 Dedicated administration dashboard
* 🏪 Manage restaurant listings
* 👥 Manage platform users
* 📅 Monitor reservations
* ⚙️ Manage platform-level operations

---

# 🛠️ Tech Stack

## Frontend

* **React 19** — Component-based UI development
* **TypeScript** — Type-safe frontend development
* **Vite** — Fast development and production build tool
* **Tailwind CSS** — Responsive and utility-first styling
* **React Router DOM** — Client-side routing
* **Axios** — API communication
* **React Hot Toast** — User notifications
* **Lucide React** — Modern icon system

## Backend

* **Node.js** — JavaScript runtime
* **Express.js** — REST API framework
* **MongoDB** — NoSQL database
* **Mongoose** — MongoDB object modeling
* **JWT** — Authentication and authorization
* **Bcrypt.js** — Password hashing
* **Multer** — File upload handling

---

# 🏗️ Application Architecture

QuickDine follows a **client-server architecture** where the React frontend communicates with a Node.js and Express backend through RESTful APIs.

```text
                         ┌─────────────────────┐
                         │      QUICKDINE      │
                         │ Restaurant Platform │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
           ┌────────▼────────┐             ┌────────▼────────┐
           │    FRONTEND     │             │     BACKEND     │
           │ React + Vite    │◄───────────►│ Node + Express  │
           │ TypeScript      │    REST     │                 │
           └─────────────────┘     API     └────────┬────────┘
                                                    │
                                      ┌─────────────▼─────────────┐
                                      │          MongoDB          │
                                      │         Mongoose          │
                                      └───────────────────────────┘
```

---

# 🔐 Role-Based Access Control

QuickDine implements role-based access control to ensure that users can only access features and resources permitted for their role.

```text
                         Authentication
                               │
                 ┌─────────────┼─────────────┐
                 │             │             │
              Diner          Owner         Admin
                 │             │             │
                 ▼             ▼             ▼
             Booking       Restaurant      Platform
             & Search      Management      Management
```

Protected routes are handled through the frontend `ProtectedRoute` component, while backend authentication uses JWT-based authorization.

---

# 📂 Project Structure

```text
QuickDine-FullStack/
│
└── QuickDine-main/
    │
    ├── README.md
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── tsconfig.app.json
    ├── tsconfig.node.json
    │
    ├── src/
    │   ├── App.tsx
    │   ├── main.tsx
    │   │
    │   ├── pages/
    │   │   ├── Home
    │   │   ├── Search
    │   │   ├── RestaurantDetail
    │   │   ├── BookingConfirmation
    │   │   ├── Dashboard
    │   │   ├── admin/
    │   │   └── owner/
    │   │
    │   ├── components/
    │   │   └── ProtectedRoute
    │   │
    │   ├── context/
    │   │   └── Authentication / Global State
    │   │
    │   ├── lib/
    │   ├── assets/
    │   └── public/
    │
    ├── backend/
    │   ├── src/
    │   │   ├── controllers/
    │   │   ├── models/
    │   │   ├── routes/
    │   │   ├── middleware/
    │   │   ├── seed.js
    │   │   └── server.js
    │   │
    │   ├── package.json
    │   └── README.md
    │
    ├── .env.example
    ├── LICENSE.md
    ├── CONTRIBUTING.md
    └── CODE_OF_CONDUCT.md
```

---

# 🔄 How QuickDine Works

## 🍽️ Diner Flow

```text
Visit QuickDine
      ↓
Search Restaurants
      ↓
Explore Restaurant Details
      ↓
Select Restaurant
      ↓
Choose Booking Details
      ↓
Confirm Reservation
      ↓
Booking Completed
```

## 🏪 Restaurant Owner Flow

```text
Owner Login
      ↓
Owner Dashboard
      ↓
Manage Restaurant Listing
      ↓
Upload Restaurant Images
      ↓
View Reservations
      ↓
Manage Restaurant Operations
```

## 🛡️ Admin Flow

```text
Admin Login
      ↓
Admin Dashboard
      ↓
Manage Platform Data
      ↓
Manage Restaurants
      ↓
Manage Users
      ↓
Monitor Reservations
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have the following installed:

* **Node.js**
* **npm**
* **MongoDB**
* **Git**

---

## 1. Clone the Repository

```bash
git clone https://github.com/Huzaifa-falak/Quick-Dine.git
cd QuickDine-FullStack/QuickDine-main
```

---

# ⚙️ Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Configure the required environment variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Add any additional variables listed in:

```text
backend/.env.example
```

### Seed Demo Data

Populate the database with demo users, restaurants, and related data:

```bash
npm run seed
```

### Start Backend

For development:

```bash
npm run dev
```

The backend runs by default on:

```text
http://localhost:5000
```

---

# 💻 Frontend Setup

From the `QuickDine-main` directory:

```bash
npm install
```

Create the frontend environment file:

```bash
cp .env.example .env
```

Configure the required Vite environment variables and API base URL according to the project's `.env.example`.

Start the frontend:

```bash
npm run dev
```

The frontend runs by default on:

```text
http://localhost:5173
```

---

# 🌐 Local Development

| Service  | URL                     |
| -------- | ----------------------- |
| Frontend | `http://localhost:5173` |
| Backend  | `http://localhost:5000` |
| Database | MongoDB                 |

---

# 📋 Environment Variables

## Backend

Create:

```text
backend/.env
```

Example:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Additional environment variables can be found in:

```text
backend/.env.example
```

## Frontend

Create the frontend environment file based on:

```text
.env.example
```

Configure the API base URL and any required Vite environment variables.

> ⚠️ Never commit real API keys, database credentials, JWT secrets, or other sensitive configuration values to GitHub.

---

# 📦 NPM Scripts

## Frontend

| Command         | Description                                 |
| --------------- | ------------------------------------------- |
| `npm run dev`   | Start Vite development server               |
| `npm run build` | Type-check and build production application |
| `npm run lint`  | Run ESLint                                  |

## Backend

| Command         | Description                      |
| --------------- | -------------------------------- |
| `npm run dev`   | Start backend with Nodemon       |
| `npm run start` | Start backend in production mode |
| `npm run seed`  | Populate database with demo data |

---

# 🔑 Demo Accounts

The project includes demo accounts for testing different role-based workflows.

| Role      | Email                 | Password    |
| --------- | --------------------- | ----------- |
| 🛡️ Admin | `admin@quickdine.com` | `Admin@123` |
| 🏪 Owner  | `owner@example.com`   | `Owner@123` |
| 👤 Diner  | `alex@example.com`    | `User@123`  |

> ⚠️ These credentials are intended for local/demo usage only. Change or disable demo credentials before deploying the application to production.

---

# 🔒 Security

QuickDine implements several security practices:

* 🔐 JWT-based authentication
* 🛡️ Role-based authorization
* 🔒 Protected frontend routes
* 🔑 Password hashing with Bcrypt.js
* 🗝️ Environment-based secret management
* 📁 Controlled file upload handling
* 🚫 Separation of sensitive configuration from source code

---

# 📈 Performance & Development Practices

QuickDine uses modern development practices to maintain a scalable and maintainable codebase:

* ⚡ Vite-powered development environment
* 🧩 Reusable React components
* 🛡️ Protected route architecture
* 📦 Modular backend structure
* 🗄️ Mongoose-based data modeling
* 🔌 RESTful API communication
* 🎨 Utility-first responsive styling
* 🧹 ESLint-based code quality checks
* 🔄 Environment-based configuration

---

# 🧠 What This Project Demonstrates

QuickDine demonstrates practical experience with:

* Full-stack application architecture
* React 19 and TypeScript
* Node.js and Express.js
* MongoDB and Mongoose
* REST API development
* JWT authentication
* Role-based authorization
* Protected routes
* File upload handling
* Dashboard development
* Reservation workflows
* State management
* API integration
* Environment configuration
* Database seeding
* Responsive UI development

---

# 🔮 Future Improvements

Potential improvements for future versions include:

* ⭐ Restaurant ratings and reviews
* 🔍 Advanced search and filtering
* 📍 Location-based restaurant discovery
* ❤️ Favorites and saved restaurants
* 🔔 Booking notifications
* 📧 Email confirmation system
* 💳 Online payment integration
* 📊 Advanced restaurant analytics
* 📱 Mobile application
* 🌐 Production deployment and CI/CD

---

# 🤝 Contributing

Contributions are welcome and appreciated.

To contribute:

1. Fork the repository
2. Create a new feature branch
3. Make your changes
4. Test your changes
5. Commit your changes
6. Push your branch
7. Open a Pull Request

Before contributing, please review:

* `CONTRIBUTING.md`
* `CODE_OF_CONDUCT.md`

---

# 📄 License

This project is licensed under the **MIT License**.

See the `LICENSE.md` file for complete license information.

---

# 👨‍💻 Author

## Huzaifa Falak

**MERN Stack Developer**

I build modern, scalable, and user-focused web applications using JavaScript, TypeScript, React, Node.js, Express, and MongoDB.

### Connect With Me

* 🌐 GitHub: `https://github.com/Huzaifa-falak`


---

# ⭐ Support

If you found QuickDine interesting or useful, consider giving the repository a **⭐ Star**.

Your support is appreciated!

---

<div align="center">

# 🍽️ QuickDine

### Discover. Reserve. Dine.

**Built with ❤️ using React, TypeScript, Node.js, Express & MongoDB**

</div>
