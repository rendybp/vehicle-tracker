# Vehicle Tracker

Vehicle Tracker is a comprehensive vehicle tracking and management system designed to monitor fleet usage in real-time. It features a modern, responsive frontend and a robust backend API with role-based access control.

## 🚀 Features

- **Real-time Vehicle Tracking**: Monitor vehicle locations and status (Active, Inactive, Maintenance).
- **Role-Based Access Control**:
  - **Admin**: Full control over vehicles (CRUD) and user management.
  - **User**: View vehicle status and details.
- **Authentication**: Secure JWT-based authentication with auto-login and refresh tokens.
- **Interactive Dashboard**: Visual overview of fleet status with maps and statistics.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, Prisma (PostgreSQL), JWT, Swagger UI.
- **Frontend**: React, Vite, TypeScript, TailwindCSS, Framer Motion, Leaflet (Maps).

## 📥 Cloning the Repository

To get started, clone the repository to your local machine:

```bash
git clone https://github.com/rendybp/vehicle-tracker.git
cd vehicle-tracker
```

## ⚙️ Installation & Setup

### 1. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

#### Environment Configuration

Create a `.env` file in the `backend` directory (copy from `.env.example`) and configure your database connection and secrets:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/vehicle_tracker?schema=public"
ACCESS_TOKEN_SECRET="your_access_token_secret"
REFRESH_TOKEN_SECRET="your_refresh_token_secret"
CLIENT_URL="http://localhost:5173" # Frontend URL
PORT=5000
```

You can generate secrets using: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

#### Database Setup & Seeding

Run the following commands to generate the Prisma client, push the schema to the database, and seed it with initial data:

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to the database
npm run db:push

# Seed the database with default users and vehicles
npm run db:seed
```

### 2. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd ../frontend
npm install
```

## 🏃‍♂️ Running the Application

You need to run both the backend and frontend servers.

### Start Backend

In the `backend` directory:

```bash
npm run dev
```

_Server will start on `http://localhost:5000`_

### Start Frontend

In the `frontend` directory:

```bash
npm run dev
```

_Application will be available at `http://localhost:5173` (or the port shown in your terminal)_

## 📚 API Documentation

The backend includes comprehensive API documentation generated with Swagger.

Once the backend server is running, you can access the interactive API docs at:
👉 **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

## 🔑 Default Credentials

The database seeder creates the following default accounts:

### Admin Account

- **Email**: `rendibuana@gmail.com`
- **Password**: `Admin123#`
  _Has full access to all features including user and vehicle management._

### User Accounts

- **Email**: `budi.santoso@gmail.com`
- **Password**: `User123!`
  _Can view dashboards and vehicle details._

---

## 💡 Troubleshooting

- **Database Connection**: Ensure your PostgreSQL server is running and the credentials in `.env` are correct.
- **Prisma Client**: If you encounter errors related to Prisma Client, try running `npm run db:generate` again.
- **CORS Errors**: Ensure the `CLIENT_URL` in your backend `.env` matches the URL where your frontend is running.
