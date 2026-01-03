# DayFlow Harmony - Backend API

## Overview
RESTful API backend for DayFlow Harmony employee management system.

## Tech Stack
- Node.js
- Express.js
- JWT Authentication
- bcryptjs for password hashing

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Configure environment variables:
Create a `.env` file with:
```
PORT=3001
JWT_SECRET=your-secret-key
NODE_ENV=development
```

3. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `PATCH /api/employees/:id` - Update employee

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance/checkin` - Check in
- `POST /api/attendance/checkout` - Check out

### Leaves
- `GET /api/leaves` - Get leave requests
- `POST /api/leaves` - Create leave request
- `PATCH /api/leaves/:id` - Update leave status
- `DELETE /api/leaves/:id` - Delete leave request

## Default Credentials
- Admin: `admin@dayflow.com` / `admin123`
- Employee: `employee@dayflow.com` / `admin123`
