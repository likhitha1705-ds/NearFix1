# NearFix – Local Service Finder

NearFix is a clean, responsive, and full-stack local service finder web application designed to help residents find trusted local service professionals for essential household repairs (Electrician, Plumber, and AC Repair).

---

## 1. Technologies Used

- **Frontend:** React (JSX), JavaScript (ES6+), Regular CSS
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Database Management Tool:** MySQL Workbench
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs password hashing
- **Version Control:** Git & GitHub

> **Architecture Note:** Built using standard React and Vanilla CSS for maximum styling control, without Bootstrap, Tailwind CSS, or TypeScript. Simple Unicode symbols and CSS badges are used instead of human photos.

---

## 2. Project Folder Structure

```text
nearfix/
├── client/                     # React Frontend
│   ├── public/                 # Static assets & index.html
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ServiceCard, ProviderCard, ProtectedRoute
│   │   ├── pages/              # Home, Find Providers, Provider Details, Login, Register, Dashboards
│   │   ├── context/            # AuthContext (Role & Token management)
│   │   ├── services/           # API fetch client
│   │   ├── App.jsx             # React Router layout
│   │   ├── index.css           # Teal-blue design system & responsive styling
│   │   └── main.jsx            # Application entry
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js + Express Backend
│   ├── config/
│   │   └── db.js               # MySQL connection pool & parameterized query runner
│   ├── controllers/            # Auth, Category, Provider, Request, and Admin controllers
│   ├── middleware/             # JWT authentication & role-based access control
│   ├── routes/                 # Express API routes
│   ├── scripts/
│   │   └── initDb.js           # Automated MySQL database setup script
│   ├── server.js               # Express application entry & static serving
│   ├── .env                    # Environment configuration
│   ├── .env.example            # Environment configuration template
│   └── package.json
│
├── database/                   # MySQL Database Scripts
│   ├── schema.sql              # Database tables and constraints
│   └── seed.sql                # 3 fixed categories, 3 provider profiles & seed accounts
│
├── .gitignore
├── package.json                # Root convenience scripts
└── README.md                   # Documentation
```

---

## 3. Core Features & Service Providers

### 3 Fixed Service Categories
1. **Electrician** (⚡) — Electrical installation and repair.
2. **Plumber** (🔧) — Water leaks, taps, and pipe repairs.
3. **AC Repair** (❄️) — Air-conditioner servicing and repair.

### 3 Dedicated Provider Profiles
- **Rahul Sharma** — Electrician • Andheri West, Mumbai • 3 Years Experience
- **Amit Patil** — Plumber • Dadar, Mumbai • 4 Years Experience
- **Neha Deshmukh** — AC Repair • Bandra West, Mumbai • 3 Years Experience

---

## 4. Getting Started & Installation

### Prerequisites
- Node.js (v18 or higher)
- MySQL Server (v8.0) and MySQL Workbench

### Step 1: Install Dependencies
Open a terminal in the root directory:

```bash
# 1. Install server dependencies
cd server
npm install

# 2. Install client dependencies
cd ../client
npm install
```

---

## 5. MySQL Database Setup

### Option A: Using MySQL Workbench (GUI)
1. Open **MySQL Workbench** and connect to your local MySQL instance (`localhost:3306`).
2. Go to **File → Open SQL Script...** and select `database/schema.sql`.
3. Click the **Execute (⚡ Lightning Bolt)** button to create the `nearfix` database and tables.
4. Go to **File → Open SQL Script...** and select `database/seed.sql`.
5. Click **Execute (⚡)** to populate the categories, 3 provider profiles, and initial accounts.

### Option B: Automated via Script
Configure your MySQL password in `server/.env` (see below) and run from `server/`:
```bash
npm run init-db
```

---

## 6. Environment Configuration (`.env`)

In the `server/` directory, verify or edit `server/.env`:

```env
PORT=5000
NODE_ENV=development

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=nearfix

# JWT Secret
JWT_SECRET=nearfix_mumbai_secret_key_2026_jwt_token
JWT_EXPIRES_IN=7d
```

---

## 7. Running the Application

### Option 1: Run Full-Stack from Server (Single Port)
The Express server automatically serves the built React frontend at `http://localhost:5000`:

```bash
# In client/ (build frontend once)
cd client
npm run build

# In server/ (start backend + frontend)
cd ../server
npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser.

### Option 2: Run in Development Mode (with Hot Reload)
Run backend and frontend concurrently in two separate terminal tabs:

**Terminal 1 (Backend API):**
```bash
cd server
npm run dev
# Running on http://localhost:5000
```

**Terminal 2 (Frontend with Vite):**
```bash
cd client
npm run dev
# Running on http://localhost:3000 (proxies API requests to 5000)
```

---

## 8. User Roles & Seed Accounts

All passwords are encrypted with bcrypt:

| Role | Email | Password | Dashboard Access |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@nearfix.in` | `Admin@123` | `/admin-dashboard` |
| **Electrician Provider** | `rahul.sharma@nearfix.in` | `Provider@123` | `/provider-dashboard` |
| **Plumber Provider** | `amit.patil@nearfix.in` | `Provider@123` | `/provider-dashboard` |
| **AC Repair Provider** | `neha.deshmukh@nearfix.in` | `Provider@123` | `/provider-dashboard` |
| **Customer** | `customer@demo.in` | `Customer@123` | `/customer-dashboard` |

> New customers can also register at any time via the **/register** page.

---

## 9. Testing Checklist

1. **Homepage:** Browse the 3 service cards, search by service or locality, and view "How It Works".
2. **Find Providers:** Filter by service category (Electrician, Plumber, AC Repair) or Mumbai locality (Andheri West, Dadar, Bandra West).
3. **Provider Details:** Inspect experience, verified locality, contact details, and book a service visit.
4. **Authentication:** Register a new customer, log in with customer, provider, and admin accounts.
5. **Customer Dashboard:** Track your service requests and current status (Pending / Accepted / Completed).
6. **Provider Dashboard:** Toggle availability status (Available / Busy / On Leave) and manage incoming service bookings.
7. **Admin Dashboard:** View real-time category, provider, and customer stats; approve or deactivate service providers.
