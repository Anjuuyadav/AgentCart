# Phase 5 - Quick Reference Card

## URLs & Endpoints

### Frontend
```
http://localhost:5173              Landing page
http://localhost:5173/buyer        AI Buyer
http://localhost:5173/products     Product list
http://localhost:5173/cart         Shopping cart
http://localhost:5173/checkout     Checkout flow
http://localhost:5173/orders       Order history
```

### Backend API
```
BASE: http://localhost:4000/api

HEALTH
GET    /health                    ← Check backend

PRODUCTS
GET    /products                  ← List all
GET    /products/:id              ← Product details
GET    /inventory/:variantId      ← Stock check

CART
GET    /cart                      ← Get cart
POST   /cart/items                ← Add item
PUT    /cart/items/:id            ← Update item
DELETE /cart/items/:id            ← Remove item
DELETE /cart                      ← Clear cart

ORDERS
POST   /orders                    ← Create order
GET    /orders                    ← List orders
GET    /orders/:id                ← Order details

PAYMENTS ✨
POST   /payments/create-order     ← Create Razorpay order
POST   /payments/:orderId/capture ← Capture payment
POST   /payments/:orderId/failure ← Handle failure
GET    /payments/:orderId         ← Get payment status
POST   /payments/:orderId/test    ← Test payment

PURCHASE POLICY
POST   /purchase-policy/evaluate  ← Evaluate policy

AI & AUDIT
GET    /ai/sessions               ← AI sessions
POST   /ai/sessions/:id/actions   ← Log action
GET    /ai/sessions/:id           ← Session details
```

---

## Test Data

### Default Test User
```
Name:     Priya Sharma
Email:    priya.sharma@email.com
Address:  42, Green Park Extension, New Delhi - 110016
```

### Test Credit Card
```
Number:   4111 1111 1111 1111
Expiry:   Any future date (e.g., 12/25)
CVV:      Any 3 digits (e.g., 123)
Mode:     TEST MODE ONLY
```

### Test Product
```
Product:  Wine Satin Wedding Dress
ID:       dress_001
Price:    ₹4,299
Sizes:    S, M, L, XL
Colors:   Wine, Maroon, Burgundy
Stock:    10 units
```

---

## Environment Variables

### Backend (.env)
```
PORT=4000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=agentcartdb
DB_USER=postgres
DB_PASSWORD=postgresql
CORS_ORIGIN=http://localhost:5173
RAZORPAY_KEY_ID=rzp_test_1Aa00000000001
RAZORPAY_KEY_SECRET=test_secret_only_for_demo
```

### Frontend (Auto)
```
VITE_API_URL=http://localhost:4000/api
VITE_APP_NAME=AgentCart
```

---

## Quick Commands

### Setup
```bash
# Backend
cd backend && npm install && npm run db:migrate && npm run db:seed

# Frontend
cd .. && npm install
```

### Run
```bash
# Backend (Terminal 1)
cd backend && npm run dev

# Frontend (Terminal 2)
cd .. && npm run dev
```

### Test
```bash
# Build backend
cd backend && npm run build

# Build frontend
npm run build

# Check health
curl http://localhost:4000/api/health
```

### Database
```bash
# Connect
psql -U postgres -d agentcartdb

# List tables
\dt

# Query
SELECT COUNT(*) FROM orders;
SELECT COUNT(*) FROM payments;
```

---

## 5-Minute Test Flow

```
1. Go to http://localhost:5173/buyer
2. Type: "wine-colored wedding dress under ₹5,000 size M"
3. Press Enter → AI recommends product
4. Click product → ProductDetailPage
5. Select Size M, Color Wine
6. Click "Add to Cart"
7. Click "Go to Checkout" (or /checkout)
8. Fill form → Click "Continue to Purchase Policy"
9. See "APPROVED" → Click "Proceed to Payment"
10. Click "Open Razorpay Checkout"
11. Fill test card (4111 1111 1111 1111)
12. Click Pay
13. See "Success! Order created"
14. Check /orders for new order
```

---

## Files & Directories

### New Files (Phase 5)
```
PHASE5_IMPLEMENTATION.md          ← Complete guide
PHASE5_TESTING_GUIDE.md          ← 9 test scenarios
PHASE5_QUICK_START.md            ← Setup & run
PHASE5_STATUS_REPORT.md          ← Status & metrics
PHASE5_ARCHITECTURE.md           ← System design

backend/src/services/paymentService.ts
backend/src/controllers/paymentController.ts
backend/src/routes/payment.ts
src/services/paymentService.ts
src/pages/buyer/CheckoutPage.tsx
```

### Modified Files (Phase 5)
```
backend/src/repositories/commonRepository.ts       (Added payment CRUD)
backend/src/repositories/orderRepository.ts        (Added status methods)
backend/src/repositories/inventoryRepository.ts    (Added deduct methods)
backend/src/services/inventoryService.ts          (Added deduct methods)
backend/src/services/aiBuyerService.ts            (Added logAction)
backend/src/index.ts                               (Added payment route)
backend/.env                                       (Added Razorpay keys)
src/pages/buyer/CheckoutPage.tsx                  (Complete rewrite)
```

---

## Key Methods

### Backend Payment Service
```typescript
createRazorpayOrder(params)          // Create order
capturePayment(orderId, payload)     // Capture successful payment
handlePaymentFailure(orderId, reason) // Handle failure
verifyPaymentSignature(payment_id, order_id, signature)
getPaymentForOrder(orderId)          // Retrieve payment
```

### Frontend Payment Service
```typescript
createRazorpayOrder(amount, receipt, notes)
capturePayment(orderId, payload)
handlePaymentFailure(orderId, reason)
openRazorpayCheckout(params)         // Open modal
loadRazorpayScript()                 // Load SDK
```

### Frontend AI Buyer Service
```typescript
logAction(request)                   // Log AI action with type, product, score
```

### Frontend Inventory Service
```typescript
deductForOrder(variantId, quantity)
deductForOrderItems(items)
reserveForCart(variantId, quantity)
releaseReserved(variantId, quantity)
```

---

## Common Errors & Fixes

### "Cannot find module"
```bash
# Run: npm install
cd backend && npm install
cd .. && npm install
```

### "Port already in use"
```bash
# Kill process on port
netstat -ano | findstr :4000   # Find PID
taskkill /PID <PID> /F         # Kill
```

### "Connection refused"
```bash
# Restart PostgreSQL
# Windows: Services → postgresql-x64-XYZ → Restart
```

### "Razorpay not loading"
```bash
# Check browser console (F12)
# Verify internet connection
# Clear cache: Ctrl+Shift+Delete
```

### "Checkout page blank"
```bash
# Verify backend running: curl http://localhost:4000/api/health
# Check frontend console: F12 → Console
# Verify cart has items
```

---

## Success Indicators

✅ Backend starts without errors
✅ Frontend loads on localhost:5173
✅ AI Buyer page accessible
✅ Can search products
✅ Can add to cart
✅ Can go to checkout
✅ Policy evaluates correctly
✅ Razorpay modal opens
✅ Payment processes
✅ Order created
✅ Order in history
✅ No console errors

---

## Database Verification Queries

```sql
-- Check latest order
SELECT order_number, payment_status, created_at 
FROM orders 
ORDER BY created_at DESC LIMIT 1;

-- Check payment
SELECT * FROM payments 
WHERE order_id = (SELECT id FROM orders ORDER BY created_at DESC LIMIT 1);

-- Check inventory
SELECT stock, reserved FROM inventory 
WHERE variant_id IN (SELECT id FROM product_variants 
WHERE product_id = 'dress_001');

-- Check AI action
SELECT action_type, product_name, match_score 
FROM ai_actions 
WHERE action_type = 'purchase' 
ORDER BY created_at DESC LIMIT 1;

-- Check audit log
SELECT event, status FROM audit_logs 
ORDER BY created_at DESC LIMIT 10;
```

---

## Documentation Map

| Document | Purpose | Read When |
|----------|---------|-----------|
| PHASE5_IMPLEMENTATION.md | Complete architecture & features | Want full overview |
| PHASE5_TESTING_GUIDE.md | 9 test scenarios with expected output | Ready to test |
| PHASE5_QUICK_START.md | Setup & run instructions | First time setup |
| PHASE5_STATUS_REPORT.md | Status, metrics, deployment info | Need status update |
| PHASE5_ARCHITECTURE.md | System design & data flows | Understanding design |
| **This file** | Quick reference | Need quick lookup |

---

## Phase 5 Status

✅ **Implementation**: COMPLETE
✅ **Integration**: COMPLETE
✅ **Documentation**: COMPLETE
✅ **Testing**: READY
🚀 **Demo Ready**: YES

---

## Next Steps

1. Run 5-minute test flow (above)
2. Follow PHASE5_TESTING_GUIDE.md for full testing
3. Check database with verification queries
4. Review PHASE5_ARCHITECTURE.md for understanding
5. Deploy backend: `npm start`
6. Deploy frontend: `npm run dev`

---

**Quick Reference Version**: 1.0
**Last Updated**: 2024-09-02
**Status**: Ready for Use ✅
