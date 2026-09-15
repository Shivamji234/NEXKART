# NEXKART — Haute Horlogerie & Luxury Fashion Commerce

> **"The new standard of everyday luxury."**

**NEXKART** is a production-grade, full-stack luxury fashion and lifestyle e-commerce web platform engineered using the MERN stack (MongoDB, Express.js, React.js, Node.js). NEXKART combines architectural minimalism, tailored editorial visual aesthetics, secure OTP-backed authentication, real-time Razorpay test/sandbox payments, Cash on Delivery support, multi-faceted faceted search, a live order fulfillment tracker, and an executive administration console.

---

## 1. Distinctive Highlights & Features

- **Luxury Visual Identity**: Bespoke minimalist design language inspired by haute couture fashion houses, styled with subtle gold champagne accents, deep charcoal palettes, and bespoke typography.
- **Resilient Database Layer**: Built for zero-friction execution. Seamlessly connects to MongoDB Atlas or local MongoDB instances. If local MongoDB is unavailable, NEXKART automatically initializes an embedded in-memory MongoDB engine with complete aggregation and index support.
- **Enterprise-Grade Authentication**:
  - Registration with 6-digit cryptographic OTP generation and 10-minute expiry.
  - Development test OTP display banner and server terminal logging for instantaneous local testing without requiring active SMTP credentials.
  - Production Nodemailer support with luxury HTML email templates.
  - Forgot Password flow with security OTP verification and password reset.
  - JWT authorization with HTTP authorization headers and bcrypt password hashing (10 salt rounds).
- **Product Architecture**:
  - 24+ pre-seeded luxury products across **Men**, **Women**, **Footwear**, **Accessories**, **Kids**, and **Haute Horlogerie**.
  - Multi-image galleries with zoom lens, size selection swatches, color picker, and real-time inventory validation.
  - Verified Customer Reviews with star ratings breakdown and purchase verification guards.
- **Faceted Search & Discovery**:
  - Real-time debounced search bar with autocomplete suggestions.
  - Multi-filter sidebar: Category, Subcategory, Price slider, Brands, Sizes, Colors, In-stock, and Privilege Sales.
  - Sorting: Newest arrivals, Price low-to-high, Price high-to-low, Highest rated, Most popular, and Biggest discounts.
- **Shopping Bag & Wishlist**:
  - Persistent bag for authenticated patrons and guest storage in localStorage.
  - Dynamic free white-glove delivery progress bar (threshold: ₹2,999).
  - Promo coupon validation engine (`LUXURY20`, `FIRST10`, `NEX500`).
  - Slide-in side drawer and dedicated full-page cart view.
  - One-click move from wishlist to shopping bag.
- **Multi-Step Checkout & Payment Processing**:
  - Step 1: Address selection with multi-address management (Home, Work, Other).
  - Step 2: Order summary & promo coupon calculation.
  - Step 3: Payment method selection:
    - **Razorpay Sandbox / Test Mode**: Supports UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Wallets.
    - **Cash on Delivery (COD)**: With safety cap checks.
  - Server-side cryptographic HMAC-SHA256 signature verification (never trusts frontend alone).
  - Zero sensitive payment credentials (CVV, PINs, card numbers) stored on servers.
- **Live Order Timeline Tracker**:
  - Step-by-step visual tracker: `Order Placed` &rarr; `In Atelier Preparation` &rarr; `Bespoke Packed` &rarr; `Dispatched with Courier` &rarr; `Out for Delivery` &rarr; `Delivered`.
  - Self-service order cancellation with reason selector (restores inventory automatically).
  - 14-day atelier return and exchange request workflow.
- **Executive Administration Console (`/admin`)**:
  - Role-protected administrative access (`role === 'admin'`).
  - Key Performance Indicator metrics: Total Revenue, Total Orders, Total Products, Total Users, Low Stock Alerts, and Pending Returns.
  - Product CRUD with SKU generator, image upload links, stock controls, and feature badges.
  - Order Fulfillment manager with status updates that immediately reflect on the patron's live tracker.
  - Patron accounts management with role promotion and account deactivation.
  - Promotional coupon generator.
  - Return requests review and refund status processing.

---

## 2. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, React Router v6, Tailwind CSS, Lucide Icons, Axios, Vite |
| **Backend** | Node.js, Express.js, REST API Architecture |
| **Database** | MongoDB, Mongoose ODM (with embedded MongoDB Memory Server fallback) |
| **Payments** | Razorpay SDK (Test/Sandbox Mode) & Cash on Delivery |
| **Authentication**| JWT (JSON Web Tokens), bcryptjs, Secure OTP Service |
| **Security** | Helmet HTTP headers, CORS, Express Rate Limiting |
| **Email** | Nodemailer with luxury HTML formatting & console simulation |

---

## 3. Architecture & Directory Layout

```
NEXKART3.0/
├── backend/
│   ├── config/
│   │   ├── db.js              # Resilient MongoDB connector & fallback
│   │   └── razorpay.js        # Razorpay SDK configuration
│   ├── controllers/
│   │   ├── authController.js  # Registration, OTP, login, password reset
│   │   ├── productController.js # Catalog, search, filters, suggestions
│   │   ├── cartController.js  # Shopping bag & coupon discount logic
│   │   ├── wishlistController.js
│   │   ├── orderController.js # Order placement, cancellation, returns
│   │   ├── paymentController.js # Razorpay orders & HMAC verification
│   │   ├── couponController.js
│   │   ├── addressController.js
│   │   ├── reviewController.js
│   │   ├── notificationController.js
│   │   ├── contactController.js
│   │   └── adminController.js # Executive dashboard & management
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT protect & admin role guard
│   │   └── errorMiddleware.js # Centralized error handling
│   ├── models/                # User, Product, Category, Order, Cart, Wishlist,
│   │                          # Payment, Review, Coupon, Address, OTP, Notification
│   ├── routes/                # Express API endpoints
│   ├── utils/
│   │   ├── emailService.js    # Luxury email formatter & sender
│   │   └── otpService.js      # Cryptographic OTP generator & verifier
│   ├── seeder.js              # Database seeder with 24+ luxury products
│   ├── server.js              # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # Navbar, Footer, ProductCard, QuickViewModal,
│   │   │                      # CartDrawer, OrderTimeline, Toast, AdminSidebar
│   │   ├── context/           # AuthContext, CartContext, WishlistContext, NotificationContext
│   │   ├── layouts/           # MainLayout, AdminLayout
│   │   ├── pages/
│   │   │   ├── admin/         # AdminDashboard, AdminProducts, AdminOrders, AdminUsers, AdminCoupons, AdminReturns
│   │   │   ├── HomePage.jsx
│   │   │   ├── ShopPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── WishlistPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── OrderSuccessPage.jsx
│   │   │   ├── OrderTrackingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── VerifyOtpPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── OrdersHistoryPage.jsx
│   │   │   ├── NotificationsPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   └── PolicyPages.jsx
│   │   ├── services/          # Axios API endpoints
│   │   ├── utils/             # Formatters
│   │   ├── App.jsx            # Router configuration
│   │   ├── main.jsx           # Application mounting
│   │   └── index.css          # Tailwind & luxury aesthetics
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── .env.example
└── README.md
```

---

## 4. Quick Start & Execution Guide

### Prerequisites
- Node.js (v18 or higher recommended; verified on Node v24)
- npm (v9 or higher)

### 1. Configure Environment Variables
Copy `.env.example` to `backend/.env`:
```bash
cp .env.example backend/.env
```
Default values for local development are pre-configured in `backend/.env`.

### 2. Seed Database (Optional)
The server **automatically seeds the database** on startup if no products exist. You can also run the seeder manually:
```bash
cd backend
npm run seed
```

### 3. Run Backend Server
```bash
cd backend
npm start
```
The API server will launch on `http://localhost:5000`.

### 4. Run Frontend Client
In a separate terminal:
```bash
cd frontend
npm run dev
```
The client storefront will launch on `http://localhost:5173`.

---

## 5. Demo Credentials & Test Accounts

NEXKART includes pre-configured demo credentials. On the **Login Page**, you can also click the **1-Click Demo Customer** or **1-Click Demo Admin** buttons to autofill credentials instantly!

| Role | Email | Password | Access Rights |
|---|---|---|---|
| **Administrator** | `admin@nexkart.com` | `Admin@123456` | Full Admin Console (`/admin`), Product CRUD, Order Status Updates, User Management |
| **Customer Patron**| `customer@nexkart.com`| `Customer@123456`| Storefront Shopping, Bag, Checkout, Order Tracking, Profile |

---

## 6. Sample Promotional Coupons

Apply these coupons in the shopping bag or during checkout:

| Coupon Code | Privilege Discount | Minimum Order Spend | Maximum Cap |
|---|---|---|---|
| `LUXURY20` | **20% OFF** | ₹5,000 | ₹3,000 |
| `FIRST10` | **10% OFF** | ₹1,500 | ₹1,500 |
| `NEX500` | **Flat ₹500 Instant Savings** | ₹2,999 | ₹500 |

---

## 7. Security Best Practices Implemented

- **HMAC-SHA256 Payment Verification**: Razorpay signatures are strictly validated on the backend.
- **Zero Sensitive Data Storage**: CVV codes, full card numbers, and banking credentials are never requested or stored.
- **Secure Hashed OTPs**: OTPs are salted and hashed with bcrypt, bounded by a 10-minute expiry and rate-limited to 5 incorrect attempts.
- **Brute-Force Throttling**: Express rate limiters guard `/api/auth` endpoints.
- **Input Sanitization & Validation**: Form bodies are sanitized against MongoDB query injection and XSS vectors.
- **HTTP Security Headers**: Powered by Helmet.

---

## 8. License & Atelier Notice

© 2026 NEXKART Private Limited. Designed and engineered for luxury e-commerce excellence. All rights reserved.
