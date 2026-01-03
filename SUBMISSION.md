# OdooFlow HR Management System

**Project Name:** OdooFlow HR
**Type:** Modern HR & Attendance System (Odoo-Inspired)
**Stack:** React, TailwindCSS, Node.js, Express, shadcn/ui.

## 🚀 Features
- **Authentication**: Role-based login (Employee vs. Admin) powered by JWT.
- **Employees**:
    - **Dashboard**: Real-time attendance stats and leave balances.
    - **Check-In/Out**: One-click daily attendance tracking.
    - **Leave Management**: Apply for leaves and track status (Verified by backend).
    - **Profile**: View personal details and employment info.
- **Admin**:
    - **Dashboard**: Overview of total employees and pending actions.
    - **Leave Approvals**: Approve or Reject leave requests instantly.
    - **Employee Directory**: View all registered staff.

## 🎨 Odoo Design Compliance
- **Color Palette**: Uses Odoo's signature Purple (Primary) and Teal (Secondary).
- **Clean UI**: Minimalist, card-based interface similar to Odoo Enterprise.
- **Response**: Fully responsive mobile-first design.

## 🛠️ How to Run
This project includes a fully integrated backend and frontend.

### Prerequisites
- Node.js (v18+)

### Start Command (One-Click)
**Windows:**
Double-click `start.bat` root directory.

**Manual Start:**
1. **Backend**:
   ```bash
   cd server
   npm install
   npm run dev
   ```
2. **Frontend**:
   ```bash
   # In a new terminal
   npm install
   npm run dev
   ```

## 📝 Credentials for Testing
**Admin Account:**
- **Email**: `admin@odooflow.com`
- **Password**: `admin123`
- **Role**: Select "HR / Admin" on signup

**Employee Account:**
- **Email**: `employee@odooflow.com`
- **Password**: `employee123`
- **Role**: Select "Employee" on signup

---
*Submitted for Odoo Web Development Hackathon*
