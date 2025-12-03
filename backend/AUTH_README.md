# Vehicle Tracker Authentication API

Complete JWT-based authentication system with role-based access control.

## 🔐 Authentication Features

- ✅ User registration with automatic login
- ✅ Secure login with JWT tokens
- ✅ Dual token system (access + refresh tokens)
- ✅ HTTP-only cookies for refresh tokens
- ✅ Token refresh endpoint
- ✅ Secure logout with token cleanup
- ✅ Role-based access control (USER, ADMIN)
- ✅ Password hashing with bcryptjs
- ✅ CORS and Helmet security

## 📁 Project Structure

```
backend/src/
├── config/
│   └── database.ts              # Prisma client
├── controllers/
│   ├── authController.ts        # Auth logic (register, login, logout, refresh)
│   ├── userController.ts        # User CRUD
│   └── vehicleController.ts     # Vehicle CRUD
├── middlewares/
│   └── authMiddleware.ts        # verifyToken, checkRole
├── routes/
│   ├── authRoutes.ts            # /api/auth/*
│   ├── userRoutes.ts            # /api/users/*
│   └── vehicleRoutes.ts         # /api/vehicles/*
└── index.ts                     # Main server
```

## 🚀 Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your JWT secrets:
   ```bash
   # Generate secure secrets using:
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

3. **Run database migrations:**
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

## 🔑 API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "USER"  // Optional: USER (default) or ADMIN
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
**Note:** Refresh token is sent as HTTP-only cookie

---

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### Refresh Access Token
```http
POST /api/auth/refresh
Cookie: refreshToken=<refresh_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Access token refreshed",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### Logout
```http
POST /api/auth/logout
Cookie: refreshToken=<refresh_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "is_active": true,
    "created_at": "2025-12-03T...",
    "updated_at": "2025-12-03T..."
  }
}
```

---

### Vehicle Endpoints

All vehicle endpoints require authentication.

#### Get All Vehicles (USER & ADMIN)
```http
GET /api/vehicles
Authorization: Bearer <access_token>
```

#### Get Vehicle by ID (USER & ADMIN)
```http
GET /api/vehicles/:id
Authorization: Bearer <access_token>
```

#### Create Vehicle (ADMIN only)
```http
POST /api/vehicles
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Toyota Avanza",
  "fuel_level": 75.5,
  "odometer": 15000,
  "latitude": -6.2088,
  "longitude": 106.8456,
  "speed": 60,
  "status": "ACTIVE"
}
```

#### Update Vehicle (ADMIN only)
```http
PUT /api/vehicles/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "fuel_level": 80.0,
  "speed": 65
}
```

#### Delete Vehicle (ADMIN only)
```http
DELETE /api/vehicles/:id
Authorization: Bearer <access_token>
```

---

### User Endpoints

All user endpoints require ADMIN role.

#### Get All Users (ADMIN only)
```http
GET /api/users
Authorization: Bearer <access_token>
```

#### Get User by ID (ADMIN only)
```http
GET /api/users/:id
Authorization: Bearer <access_token>
```

#### Create User (ADMIN only)
```http
POST /api/users
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "Jane Doe",
  "role": "USER"
}
```

#### Update User (ADMIN only)
```http
PUT /api/users/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "is_active": false
}
```

#### Delete User (ADMIN only)
```http
DELETE /api/users/:id
Authorization: Bearer <access_token>
```

---

## 🔒 Role-Based Access Control

### USER Role
- ✅ Can view all vehicles
- ✅ Can view vehicle details
- ❌ Cannot create/update/delete vehicles
- ❌ Cannot access user management endpoints

### ADMIN Role
- ✅ Full access to all endpoints
- ✅ Can CRUD vehicles
- ✅ Can CRUD users

---

## 🔐 Token System

### Access Token
- **Lifetime:** 15 minutes
- **Storage:** Client-side (memory/localStorage)
- **Usage:** Sent in `Authorization: Bearer <token>` header
- **Payload:** `{ id, email, role }`

### Refresh Token
- **Lifetime:** 7 days
- **Storage:** HTTP-only cookie (secure in production)
- **Usage:** Automatically sent with requests to `/api/auth/refresh`
- **Payload:** `{ id, email, role }`
- **Database:** Stored in `users.refresh_token` column

---

## 🛡️ Security Features

1. **Password Hashing:** bcryptjs with salt rounds = 10
2. **HTTP-Only Cookies:** Prevents XSS attacks on refresh token
3. **CORS:** Configured with credentials support
4. **Helmet:** Security headers
5. **Token Expiration:** Short-lived access tokens
6. **Token Validation:** Database verification for refresh tokens
7. **Role Verification:** Middleware-based access control

---

## 🧪 Testing with cURL

### Register and Login
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123","name":"Admin User","role":"ADMIN"}' \
  -c cookies.txt

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}' \
  -c cookies.txt

# Save the accessToken from the response
```

### Access Protected Endpoints
```bash
# Get current user
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get all vehicles
curl http://localhost:5000/api/vehicles \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Create vehicle (ADMIN only)
curl -X POST http://localhost:5000/api/vehicles \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Honda Civic","fuel_level":85,"odometer":20000,"latitude":-6.2,"longitude":106.8,"speed":70}'
```

### Refresh Token
```bash
# Refresh access token using cookie
curl -X POST http://localhost:5000/api/auth/refresh \
  -b cookies.txt
```

### Logout
```bash
# Logout
curl -X POST http://localhost:5000/api/auth/logout \
  -b cookies.txt
```

---

## 🐛 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access token expired"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error fetching users",
  "error": "Database connection failed"
}
```

---

## 📝 Notes

- Refresh tokens are automatically sent as cookies
- Access tokens must be included in the `Authorization` header
- All passwords are hashed before storage
- Tokens include user data (id, email, role) in the payload
- On logout, refresh token is removed from database and cookie is cleared
- Default role is USER if not specified during registration
