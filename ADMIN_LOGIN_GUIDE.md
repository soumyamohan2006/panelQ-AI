# Admin Login Portal - Setup Guide

## Overview

A dedicated admin login page has been created at `/admin-login` with a professional, secure interface separate from the regular user login.

---

## Admin Credentials

**Email:** `admin@campus.com`  
**Password:** `Admin@123`

---

## How to Access Admin Portal

### Method 1: Direct URL
Navigate to: `http://localhost:5173/admin-login`

### Method 2: From Navbar
1. Go to home page
2. Click **"Admin"** link in the navbar (orange text, visible when not logged in)
3. You'll be redirected to the admin login page

### Method 3: After Login
1. Login with admin credentials
2. You'll be automatically redirected to `/admin` dashboard

---

## Admin Login Page Features

✅ **Dedicated Admin Interface**
- Separate login page from regular users
- Professional dark theme with orange accents
- Security badge and admin branding

✅ **Security Checks**
- Validates admin privileges on login
- Shows error if non-admin account is used
- Backend middleware protects all admin routes

✅ **User Experience**
- Smooth animations and transitions
- Clear error messages
- Links to user login and home page
- Responsive design for all devices

---

## Files Created/Modified

### New Files
- **AdminLogin.tsx** - Dedicated admin login component with professional UI
- **ADMIN_SETUP.md** - Admin setup documentation

### Modified Files
- **App.tsx** - Added `/admin-login` route and updated navbar hide list
- **Navbar.tsx** - Added "Admin" link visible to non-logged-in users
- **User.ts** - Added `isAdmin` field to schema
- **authController.ts** - Returns `isAdmin` in responses
- **authMiddleware.ts** - Added `adminOnly` middleware
- **adminRoutes.ts** - Protected all routes with admin middleware
- **AuthContext.tsx** - Added `isAdmin` to context
- **Login.tsx** - Passes `isAdmin` from response
- **Register.tsx** - Passes `isAdmin` from response
- **AdminRoute.tsx** - Protects admin panel access

---

## Setup Instructions

### 1. Create Admin User

Run the seed script in the backend:

```bash
cd backend
npx ts-node seedAdmin.ts
```

Output:
```
✅ Admin user created: soumyamohan12106@gmail.com
📝 Password: Admin@123
```

### 2. Start Backend & Frontend

```bash
# Terminal 1 - Backend
cd backend
npm install
nodemon index.js

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

### 3. Access Admin Portal

1. Open `http://localhost:5173`
2. Click **"Admin"** in navbar
3. Login with credentials above
4. You'll be redirected to `/admin` dashboard

---

## Security Features

🔒 **Backend Protection**
- All admin routes require valid JWT token
- `adminOnly` middleware checks `isAdmin` flag
- Non-admin users get 403 Forbidden response

🔒 **Frontend Protection**
- `AdminRoute` component redirects non-admins to home
- Admin status checked before rendering admin panel
- Separate login page validates admin privileges

🔒 **Error Handling**
- Clear error messages for failed login
- Specific error if non-admin account tries to access admin
- Secure password hashing with bcrypt

---

## Admin Dashboard Access

After successful admin login, you can access:

- **Dashboard** - Stats, charts, user growth, interview trends
- **User Management** - View, block, delete users
- **Interview Monitoring** - Filter and monitor interviews
- **Job Management** - Create, edit, delete job postings
- **Analytics** - Score distribution, skill analysis
- **Reports** - Generate and download reports
- **Notifications** - Send announcements
- **Settings** - Configure API keys and interview settings

---

## Troubleshooting

### "Admin access required" Error
- Ensure you're using the correct admin email
- Check that the seed script was run successfully
- Verify the user has `isAdmin: true` in database

### Can't Access Admin Panel
- Make sure you're logged in with admin account
- Check browser console for errors
- Verify backend is running and accessible

### Seed Script Fails
- Ensure MongoDB connection is working
- Check `.env` file has correct `MONGO_URI`
- Run from backend directory: `npx ts-node seedAdmin.ts`

---

## Changing Admin Password

To change the admin password:

1. Login to admin account
2. Go to Settings section
3. Update password (feature can be added)

Or manually update in MongoDB:
```javascript
db.users.updateOne(
  { email: "soumyamohan12106@gmail.com" },
  { $set: { password: "new_hashed_password" } }
)
```

---

## Notes

- Admin login page is hidden from navbar when logged in
- Only users with `isAdmin: true` can access admin features
- Admin credentials are separate from regular user accounts
- All admin actions are logged (can be implemented)
