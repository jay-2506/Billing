# 🧾 BillEase - Invoice Management System

A complete full-stack Billing / Invoice Management System built with Node.js, Express, MongoDB, and React.

## 🚀 Features

- **Customer Management**: CRUD operations for customers.
- **Product Management**: CRUD operations for products with GST support.
- **Invoice Generation**: Create professional invoices with dynamic product addition.
- **GST & Non-GST Support**: Toggle between GST and Composition Dealer modes.
- **PDF Download**: Download generated invoices as PDF.
- **Authentication**: Secure JWT-based login and registration.
- **Dashboard**: Quick stats and overview of your business.
- **API Documentation**: Integrated Swagger UI for API testing.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Frontend**: React (Vite), Tailwind CSS, Axios, React Router
- **Security**: JWT Authentication, BcryptJS
- **Utilities**: PDFKit (for PDF generation), Swagger (for docs)

## 📁 Project Structure

```text
/
├── backend/            # Express Server
│   ├── config/         # DB Configuration
│   ├── controllers/    # API logic
│   ├── models/         # Mongoose Schemas
│   ├── routes/         # API endpoints
│   ├── middleware/     # Auth & Error handling
│   └── utils/          # PDF generator
├── frontend/           # React App
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Application views
│   │   ├── services/   # API integration
│   │   └── context/    # State management
```

## ⚙️ Installation

### 1. Prerequisites
- Node.js installed
- MongoDB installed and running

### 2. Setup Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/billing-system
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
NODE_ENV=development
```

### 3. Setup Frontend
```bash
cd frontend
npm install
```

### 4. Run the Application
You can run both from the root using:
```bash
npm run dev
```
Or individually:
- Backend: `cd backend && npm run dev` (Runs on http://localhost:5000)
- Frontend: `cd frontend && npm run dev` (Runs on http://localhost:5173)

## 📖 API Documentation
Once the backend is running, visit:
[http://localhost:5000/api-docs](http://localhost:5000/api-docs)

## 📝 Sample API Request
**POST /api/auth/login**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response**
```json
{
  "_id": "...",
  "name": "Admin",
  "email": "admin@example.com",
  "token": "JWT_TOKEN_HERE"
}
```
