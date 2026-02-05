# LUXE - E-Commerce Platform Documentation

## Project Overview
LUXE is a premium e-commerce platform built with React (Vite) and Node.js (Express), featuring a modern dark/gold aesthetic, secure payments, and a robust admin dashboard.

## Key Features

### 1. User Authentication
- **Google Sign-In:** Integrated OAuth for seamless login/signup.
- **Guest Access:** Browse products and search without logging in.
- **JWT Auth:** Secure session management.

### 2. Shopping Experience
- **Mobile Responsive:** Optimized layouts for mobile devices (2-column grids, vertical scrolling).
- **Search:** Real-time search bar in header filtering products by name/category.
- **Wishlist:**
    - Real-time wishlist count in header.
    - Add/Remove items directly from product cards.
    - Persistent state across sessions.
- **Cart:** Full cart functionality with quantity adjustments.

### 3. Payment & Checkout
- **Razorpay Integration:** Secure online payments using `react-razorpay`.
- **Cash on Delivery (COD):** Option available for all orders.
- **Order Tracking:** Users can track status (Pending, Shipped, Delivered).

### 4. Returns & Exchanges
- **Eligibility:** 
    - Orders must be `DELIVERED`.
    - Return window: **3 days** from delivery date.
- **Process:**
    - Users initiate return/exchange from "Order History".
    - Status tracking: `REQUESTED` -> `APPROVED` / `REJECTED`.
    - Visual badges indicate current return status.

### 5. Admin Dashboard
- **Order Management:** View orders, change status (Shipped/Delivered).
- **Payment Insights:**
    - New "Payment" column showing **Mode** (Online/COD) and **Status** (Paid/Pending).
    - Transaction IDs visible for online payments.
- **Analytics:** Basic stats on sales and user activity.

## Technical Architecture

### Frontend
- **Framework:** React + Vite
- **Styling:** Tailwind CSS + Shadcn UI
- **State Management:** TanStack Query (React Query)
- **Icons:** Lucide React

### Backend
- **Server:** Node.js + Express
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** Passport.js + Google Strategy
- **Payment:** Razorpay API

## Deployment & Setup
- **Environment Variables:**
    - `DATABASE_URL`: PostgreSQL connection string.
    - `RAZORPAY_KEY_ID`: Payment gateway key.
    - `GOOGLE_CLIENT_ID`: OAuth credential.
- **Run Locally:**
    - Frontend: `npm run dev` (Port 5000/3000)
    - Backend: Starts concurrently or via `npm run server`.

## Recent Updates
- **v1.1 (Mobile Optimization):**
    - Home page product grids updated to 2-column layout on mobile.
    - Added vertical scrolling for "Featured" and "New Arrivals".
- **v1.1 (Admin):**
    - Fixed delivery date logic to enable returns.
    - Added granular payment details to admin order list.
