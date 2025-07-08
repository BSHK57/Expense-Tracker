# Expense Tracker Project

This repository contains a full-stack Expense Tracker application with a React frontend and a Node.js/Express backend.

## Folder Structure

- **backend/**
  - `index.js`: Main server file for the backend API.
  - `.env`: Environment variables (not committed to version control).
  - `package.json`: Backend dependencies and scripts.
  - `node_modules/`: Backend dependencies (ignored by git).

- **expense-tracker/**
  - `package.json`: Frontend dependencies and scripts.
  - `tailwind.config.js`: Tailwind CSS configuration.
  - `public/`: Static assets (HTML, icons, manifest, etc.).
  - `src/`: React source code
    - `App.js`: Main React app component and router.
    - `components/`: Reusable UI components (charts, header, protected route, etc.).
    - `contexts/`: React context providers for authentication and transactions.
    - `pages/`: Main app pages (Dashboard, Login, Register).
    - `App.css`, `index.css`: Styling files.
    - `main.js`, `index.js`: Entry points.
    - `App.test.js`, `setupTests.js`, `reportWebVitals.js`: Testing and performance files.

## Getting Started

### How to Run

#### Backend
1. Navigate to the `backend` folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file with your environment variables (see `.env.example` if available).
4. Start the backend server:
   ```sh
   npm start
   ```
   The backend will run by default on `http://localhost:5000`.

#### Frontend
1. Open a new terminal and navigate to the `expense-tracker` folder:
   ```sh
   cd expense-tracker
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the React development server:
   ```sh
   npm start
   ```
   The frontend will run by default on `http://localhost:3000`.

## API Endpoints

### Authentication
- `POST /api/auth/register` — Register a new user
  - Body: `{ email, password }`
- `POST /api/auth/login` — Login and receive JWT token
  - Body: `{ email, password }`
  - Response: `{ token, user }`
- `GET /api/auth/me` — Get current user profile (requires Authorization header)

### Transactions
- `GET /api/transactions` — Get all transactions for the authenticated user
- `POST /api/transactions` — Add a new transaction
  - Body: `{ amount, description, type }`
- `DELETE /api/transactions/:id` — Delete a transaction by ID

All protected routes require the `Authorization: Bearer <token>` header.

## Features
- User authentication (register, login, protected routes)
- Add, view, and manage transactions
- Dashboard with charts and stats
- Responsive UI with Tailwind CSS

---

Feel free to contribute or open issues for improvements!
