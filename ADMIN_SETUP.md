# Admin Setup Guide

## Admin Credentials

**Email:** `admin@campus.com`  
**Password:** `Admin@123`

---

## Setup Instructions

### 1. Run the Seed Script

To create the admin user in the database, run:

```bash
cd backend
npx ts-node seedAdmin.ts
```

This will:
- Create a new admin user if it doesn't exist
- Grant admin privileges to the email if the user already exists
- Output confirmation message

### 2. Backend Changes

The following files have been updated:

- **models/User.ts** - Added `isAdmin` field (Boolean, default: false)
- **controllers/authController.ts** - Returns `isAdmin` in login/register responses
- **middleware/authMiddleware.ts** - Added `adminOnly` middleware for route protection
- **routes/adminRoutes.ts** - All admin routes now protected with `protect` and `adminOnly` middleware

### 3. Frontend Changes

The following files have been updated:

- **context/AuthContext.tsx** - Added `isAdmin` field to User interface and context
- **Login.tsx** - Passes `isAdmin` from response to context
- **Register.tsx** - Passes `isAdmin` from response to context
- **components/AdminRoute.tsx** - New component to protect admin routes
- **App.tsx** - Admin route now wrapped with AdminRoute protection

---

## How to Access Admin Panel

1. Login with admin credentials:
   - Email: `soumyamohan12106@gmail.com`
   - Password: `Admin@123`

2. Navigate to `/admin` route or click admin link in navbar

3. Only users with `isAdmin: true` can access the admin panel

---

## Admin Features

- Dashboard with stats and charts
- User management (view, block, delete)
- Interview monitoring with filters
- Job management (CRUD operations)
- Analytics and reports
- Settings and configuration

---

## Security Notes

- All admin routes require authentication token
- Admin middleware checks `isAdmin` flag on every request
- Non-admin users are redirected to home page
- Backend validates admin status on all admin endpoints
