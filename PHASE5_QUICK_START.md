# Phase 5 - Quick Start & Run Guide

## Prerequisites

### Required Software
- Node.js 16+ (`node --version`)
- PostgreSQL 12+ (`psql --version`)
- npm 7+ or yarn 4+

### Verify Setup
```bash
# Check Node
node --version  # Should be v16+

# Check npm
npm --version   # Should be v7+

# Check PostgreSQL
psql --version  # Should show version

# Check PostgreSQL is running
psql -U postgres -h localhost -c "SELECT version();"
```

---

## Setup Phase 5

### Step 1: Database Setup
```bash
# 1. Create database
createdb -U postgres agentcartdb

# 2. Run migrations (creates tables)
cd c:\Users\Anju\Desktop\AgentCart\backend
npm install  # Install dependencies if needed
npm run db:migrate

# 3. Seed test data
npm run db:seed

# 4. Verify setup
psql -U postgres -d agentcartdb -c "\dt"  # Should show all tables
```

### Step 2: Backend Setup
```bash
cd c:\Users\Anju\Desktop\AgentCart\backend

# Install dependencies
npm install

# Verify .env file exists
cat .env  # Should show:
#   PORT=4000
#   DB_NAME=agentcartdb
#   RAZORPAY_KEY_ID=rzp_test_1Aa00000000001

# Start backend
npm run dev
# Expected output: "listening on port 4000"
```

### Step 3: Frontend Setup
```bash
cd c:\Users\Anju\Desktop\AgentCart

# Install dependencies
npm install

# Start frontend
npm run dev
# Expected output: "Local: http://localhost:5173"
```

---

## QUICK START (Just Run It!)

### Option 1: PowerShell (Recommended)
```powershell
# Terminal 1: Database check
psql -U postgres -c "SELECT 1;"  # Should return 1

# Terminal 2: Backend
cd c:\Users\Anju\Desktop\AgentCart\backend
npm run dev

# Terminal 3: Frontend
cd c:\Users\Anju\Desktop\AgentCart
npm run dev

# Now open browser
Start-Process http://localhost:5173/buyer
```

### Option 2: Command Prompt
```cmd
# Terminal 1: Database check
psql -U postgres -c "SELECT 1;"

# Terminal 2: Backend
cd c:\Users\Anju\Desktop\AgentCart\backend
npm run dev

# Terminal 3: Frontend
cd c:\Users\Anju\Desktop\AgentCart
npm run dev

# Open browser manually to http://localhost:5173/buyer
```

---

## Verify Installation

### Check Backend Health
```bash
# Should return 200 OK
curl http://localhost:4000/api/health

# Should return backend info
curl http://localhost:4000/api
```

### Check Frontend
```bash
# In browser, visit:
http://localhost:5173

# Should load landing page
```

### Check Database
```bash
# Count products
psql -U postgres -d agentcartdb -c "SELECT COUNT(*) FROM products;"

# Should return: count > 0
```

---

## Test Phase 5 (Quick 5-minute test)

### Step 1: AI Buyer
1. Go to http://localhost:5173/buyer
2. Type: "I need a wine-colored wedding dress under ₹5,000, size M"
3. Press Enter

**Expected**: Products shown with AI recommendations

### Step 2: Select Product
1. Click on a recommended product
2. Go to ProductDetailPage

**Expected**: Product details loaded

### Step 3: Add to Cart
1. Select Size M
2. Select Wine color
3. Click "Add to Cart"

**Expected**: "Added to cart" message

### Step 4: Checkout
1. Go to http://localhost:5173/checkout
2. Fill customer info (pre-filled)
3. Click "Continue to Purchase Policy"

**Expected**: Policy evaluation shows APPROVED

### Step 5: Payment
1. Click "Proceed to Payment"
2. Click "Open Razorpay Checkout"

**Expected**: Razorpay modal opens

### Step 6: Test Payment
1. Use test card: 4111 1111 1111 1111
2. Use any future date: 12/25
3. Use any CVV: 123
4. Click Pay

**Expected**: Success! Order confirmation shown

---

## Troubleshooting

### Backend Won't Start

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:5432`
```bash
# Solution: Start PostgreSQL
# Windows: Services → postgresql-x64-XYZ → Start

# Or verify connection
psql -U postgres -h localhost
```

**Error**: `Cannot find module 'express'`
```bash
# Solution: Install dependencies
cd c:\Users\Anju\Desktop\AgentCart\backend
npm install
```

**Error**: `port 4000 already in use`
```bash
# Solution: Kill process on port 4000
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Or use different port
PORT=4001 npm run dev
```

### Frontend Won't Start

**Error**: `Error: EADDRINUSE: address already in use :::5173`
```bash
# Solution: Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use different port
npm run dev -- --port 5174
```

**Error**: `Cannot GET /buyer`
```bash
# Solution: Backend not running
# Make sure Terminal 2 has backend running
# Then refresh browser

http://localhost:5173/buyer
```

### Database Problems

**Error**: Database connection fails
```bash
# Check PostgreSQL running
pg_isready -h localhost -p 5432

# Restart PostgreSQL
# Windows: Services → postgresql-x64 → Restart

# Reset database
psql -U postgres -d agentcartdb -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
npm run db:migrate
npm run db:seed
```

**Error**: Tables don't exist
```bash
# Run migrations
cd c:\Users\Anju\Desktop\AgentCart\backend
npm run db:migrate

# Verify
psql -U postgres -d agentcartdb -c "\dt"
```

### Payment Not Working

**Error**: Razorpay modal doesn't open
```
Check browser console (F12)
Look for errors related to Razorpay script
Make sure backend is running
Verify RAZORPAY_KEY_ID in .env
```

**Error**: Payment says "failed" after clicking Pay
```
This is normal in test mode sometimes
Click "Try Again" or restart checkout
Verify test card format: 4111 1111 1111 1111
```

---

## Environment Variables Reference

### Backend (.env)
```
# Server
PORT=4000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=agentcartdb
DB_USER=postgres
DB_PASSWORD=postgresql

# CORS
CORS_ORIGIN=http://localhost:5173

# Razorpay (TEST MODE ONLY)
RAZORPAY_KEY_ID=rzp_test_1Aa00000000001
RAZORPAY_KEY_SECRET=test_secret_only_for_demo
```

### Frontend (Vite)
```
# Uses default development server on 5173
# VITE_API_URL automatically uses http://localhost:4000/api
```

---

## Useful Commands

### Database
```bash
# Connect to database
psql -U postgres -d agentcartdb

# List tables
\dt

# Count records
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM orders;
SELECT COUNT(*) FROM payments;

# Check latest order
SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;

# Check payment for order
SELECT * FROM payments WHERE order_id = '<order_id>';

# Check inventory
SELECT * FROM inventory WHERE product_id = 'dress_001';

# Exit
\q
```

### Backend
```bash
# Start in dev mode
npm run dev

# Build
npm run build

# Start production build
npm run start

# Run migrations
npm run db:migrate

# Seed data
npm run db:seed

# Reset database
npm run db:reset
```

### Frontend
```bash
# Start dev server
npm run dev

# Build
npm run build

# Preview build
npm run preview
```

---

## File Structure Reference

```
AgentCart/
├── backend/
│   ├── src/
│   │   ├── services/
│   │   │   ├── paymentService.ts (NEW - Phase 5)
│   │   │   ├── orderService.ts
│   │   │   ├── cartService.ts
│   │   │   └── ...
│   │   ├── controllers/
│   │   │   ├── paymentController.ts (NEW - Phase 5)
│   │   │   ├── orderController.ts
│   │   │   └── ...
│   │   ├── routes/
│   │   │   ├── payment.ts (NEW - Phase 5)
│   │   │   ├── orders.ts
│   │   │   └── ...
│   │   ├── repositories/
│   │   │   ├── commonRepository.ts (Updated - paymentRepository)
│   │   │   ├── orderRepository.ts (Updated - updatePaymentStatus)
│   │   │   ├── inventoryRepository.ts (Updated - deductStock)
│   │   │   └── ...
│   │   ├── index.ts (Updated - payment routes)
│   │   └── config/
│   │       └── database.ts
│   ├── .env (Updated - Razorpay keys)
│   └── package.json
├── src/
│   ├── services/
│   │   ├── paymentService.ts (NEW - Phase 5)
│   │   ├── aiBuyerService.ts (Updated - logAction)
│   │   ├── orderService.ts
│   │   └── ...
│   ├── pages/
│   │   ├── buyer/
│   │   │   ├── CheckoutPage.tsx (Completely rewritten - Phase 5)
│   │   │   ├── AIBuyerPage.tsx
│   │   │   ├── CartPage.tsx
│   │   │   └── ...
│   │   └── ...
│   ├── App.tsx (No changes needed - routing already set up)
│   └── ...
├── PHASE5_IMPLEMENTATION.md (NEW - Comprehensive docs)
├── PHASE5_TESTING_GUIDE.md (NEW - Testing procedures)
├── PHASE5_QUICK_START.md (NEW - This file)
└── ...
```

---

## Success Indicators

✅ Backend starts without errors
✅ Frontend loads on localhost:5173
✅ Can access AI Buyer page
✅ Can search with AI Buyer
✅ Can add products to cart
✅ Can go to checkout
✅ Can complete payment
✅ Order shows in orders list
✅ Database has payment record
✅ No console errors

---

## Getting Help

### Check Logs
```bash
# Backend logs are in terminal
# Look for any errors or warnings

# Frontend logs in browser console (F12)
# Look for any red errors
```

### Verify Connectivity
```bash
# Backend to Database
curl http://localhost:4000/api/health/db

# Frontend to Backend
curl http://localhost:4000/api/products

# In browser console:
fetch('http://localhost:4000/api/health')
  .then(r => r.json())
  .then(console.log)
```

### Database Verification
```bash
# Connect directly
psql -U postgres -d agentcartdb

# Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

# Check data exists
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM orders;
```

---

## Next Steps After Setup

1. ✅ Verify all systems running
2. ✅ Run Quick Test (5 minutes)
3. ✅ Run Full Test Suite (PHASE5_TESTING_GUIDE.md)
4. ✅ Review Implementation (PHASE5_IMPLEMENTATION.md)
5. ✅ Prepare for presentation/demo

---

**Quick Start Version**: 1.0
**Last Updated**: 2026-09-02
**Status**: Ready to Use
