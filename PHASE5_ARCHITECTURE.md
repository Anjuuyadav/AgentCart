# Phase 5 Architecture & Data Flow

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (React + Vite)                       │
│                        http://localhost:5173                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  AIBuyerPage          ProductDetailPage        CartPage             │
│      ↓                    ↓                       ↓                  │
│  Recommend            Select Variant           Review Items         │
│  AI Match             Add to Cart               Total Price          │
│      ↓                    ↓                       ↓                  │
│      └─────────────────── CheckoutPage ────────────────┘           │
│                           ↓                                          │
│                    Form → Policy → Payment → Confirmation           │
│                                                                     │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                    HTTP APIs (JSON-RPC)
                           │
┌──────────────────────────▼──────────────────────────────────────────┐
│                    EXPRESS.JS BACKEND                               │
│                    http://localhost:4000/api                        │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                      ROUTES                                  │  │
│  │  /health              /products          /cart               │  │
│  │  /ai                  /orders            /payments ✨         │  │
│  │  /purchase-policy     /inventory                             │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                           ↓                                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    CONTROLLERS                               │  │
│  │  healthController    productController    cartController     │  │
│  │  aiSessionController orderController    paymentController ✨ │  │
│  │  purchasePolicyController  inventoryController              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                           ↓                                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                     SERVICES                                 │  │
│  │  aiSessionService      cartService      orderService        │  │
│  │  purchasePolicyService inventoryService paymentService ✨   │  │
│  │  auditService          aiBuyerService   productService       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                           ↓                                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                   REPOSITORIES                               │  │
│  │  userRepository     cartRepository      orderRepository      │  │
│  │  inventoryRepository productRepository paymentRepository ✨  │  │
│  │  commonRepository (now includes payment CRUD)               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                           ↓                                         │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                      SQL Queries
                           │
┌──────────────────────────▼──────────────────────────────────────────┐
│                      PostgreSQL Database                            │
│                     localhost:5432/agentcartdb                      │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Tables:                                                             │
│  ├─ users              (Customer data)                              │
│  ├─ products           (Product catalog)                            │
│  ├─ product_variants   (Size, color options)                        │
│  ├─ inventory          (Stock levels, reserved)                     │
│  ├─ carts              (Shopping carts)                             │
│  ├─ cart_items         (Items in cart)                              │
│  ├─ orders            (Order records) - payment_status field ✨     │
│  ├─ order_items       (Items in order)                              │
│  ├─ payments          (Payment records) ✨                          │
│  ├─ purchase_policies (Policy rules)                                │
│  ├─ ai_sessions       (AI buyer sessions)                           │
│  ├─ ai_actions        (AI action logs)                              │
│  └─ audit_logs        (System audit trail)                          │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘

✨ = New or Modified in Phase 5
```

---

## Complete Payment Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CHECKOUT FLOW (4 Steps)                          │
└─────────────────────────────────────────────────────────────────────┘

STEP 1: Customer Information
┌──────────────────────────────┐
│ Form Collection              │
│ - Name                       │
│ - Email                      │
│ - Shipping Address           │
└───────────┬──────────────────┘
            │ Continue
            ▼
STEP 2: Purchase Policy
┌──────────────────────────────┐
│ Policy Evaluation            │
│ ✓ Budget Check               │
│ ✓ Inventory Check            │
│ ✓ Variant Check              │
│ ✓ Authorization              │
│ Status: APPROVED/REJECTED    │
└───────────┬──────────────────┘
            │ Proceed to Payment
            │ (if approved)
            ▼
STEP 3: Payment
┌──────────────────────────────┐
│ 1. Backend creates order     │
│    POST /orders              │
│    ├─ orderRepository.create │
│    ├─ orderItems added       │
│    └─ payment_status=pending │
│                              │
│ 2. Create Razorpay order     │
│    POST /payments/create-... │
│    ├─ paymentService         │
│    └─ Returns order details  │
│                              │
│ 3. Frontend opens modal      │
│    ├─ paymentService         │
│    ├─ loadRazorpayScript()   │
│    └─ openCheckout()         │
│                              │
│ 4. User pays in modal        │
│    ├─ Test card: 4111...     │
│    └─ Razorpay processes     │
│                              │
│ 5. Frontend captures payment │
│    POST /payments/capture    │
│    ├─ Verify signature       │
│    ├─ Check amount           │
│    ├─ Duplicate prevention   │
│    └─ Update payment status  │
│                              │
│ 6. Backend handles capture   │
│    ├─ paymentService         │
│    ├─ Verify payment data    │
│    ├─ Update order status    │
│    ├─ Deduct inventory       │
│    ├─ Log AI action          │
│    ├─ Create audit log       │
│    └─ Return success         │
└───────────┬──────────────────┘
            │ Payment Success
            ▼
STEP 4: Confirmation
┌──────────────────────────────┐
│ Success Screen               │
│ ✓ Order #AC-XXXXX created    │
│ ✓ Payment processed          │
│ ✓ Inventory updated          │
│ ✓ Logged and audited         │
│                              │
│ View Order Details           │
│ or continue shopping         │
└──────────────────────────────┘
```

---

## Payment Processing Sequence

```
Frontend (React)          Backend (Express)         Database (PostgreSQL)
     │                          │                           │
     │─ Add to Cart ────────────>│                           │
     │                          │─ Save to DB ─────────────>│
     │                          │                           │
     │─ Go to Checkout ─────────>│                           │
     │                          │─ Retrieve Cart ──────────>│
     │                          │<─ Cart Items ─────────────│
     │<─ Cart Info ──────────────│                           │
     │                          │                           │
     │─ Fill Form ──────────────>│                           │
     │                          │─ Evaluate Policy ────────>│
     │                          │<─ Pass/Fail ──────────────│
     │<─ Policy Result ──────────│                           │
     │                          │                           │
     │─ Proceed to Payment ─────>│─ Create Order ──────────>│
     │                          │<─ Order ID ────────────────│
     │                          │                           │
     │                          │─ Insert Order ──────────>│
     │                          │─ Insert Order Items ───>│
     │                          │<─ Success ─────────────────│
     │<─ Order Details ──────────│                           │
     │                          │                           │
     │─ Create Razorpay Order ─>│─ Mock Razorpay Order ────>│
     │<─ Razorpay Details ──────│                           │
     │                          │                           │
     │─ Open Razorpay Modal ────>│                           │
     │  (User fills card)        │                           │
     │  (User confirms)          │                           │
     │                          │                           │
     │─ Capture Payment ────────>│─ Verify Signature ──────>│
     │  (payment_id,            │                           │
     │   order_id,              │─ Check Duplicate ──────────│
     │   signature)             │<─ Check Result ─────────────│
     │                          │                           │
     │                          │─ Update Payment Status →│
     │                          │  (SET status='success')   │
     │                          │<─ Confirmed ───────────────│
     │                          │                           │
     │                          │─ Update Order Status ───>│
     │                          │  (SET status='confirmed')│
     │                          │<─ Confirmed ───────────────│
     │                          │                           │
     │                          │─ Deduct Inventory ────────>│
     │                          │  (UPDATE stock WHERE qty>=req)
     │                          │<─ Updated ──────────────────│
     │                          │                           │
     │                          │─ Log AI Action ─────────>│
     │                          │  (INSERT ai_action)        │
     │                          │<─ Logged ─────────────────│
     │                          │                           │
     │                          │─ Create Audit Log ─────>│
     │                          │  (INSERT audit_log)       │
     │                          │<─ Logged ─────────────────│
     │                          │                           │
     │<─ Payment Success ───────│                           │
     │                          │                           │
     │─ Clear Cart ─────────────>│─ Delete Cart Items ────>│
     │                          │<─ Cleared ──────────────────│
     │                          │                           │
     │─ Load Orders ────────────>│─ Fetch Orders ────────────>│
     │                          │<─ Orders List ──────────────│
     │<─ Orders ────────────────│                           │
     │                          │                           │
     │─ Show Confirmation ──────>│                           │
     │                          │                           │
     │─ Redirect to Order ──────>│─ Fetch Order Details ──────>│
     │                          │<─ Complete Order Data ──────│
     │<─ Order Page ────────────│                           │
```

---

## Data Model Relationships

```
users (1)
  ├─ (Many) carts
  │  └─ cart_items
  │     └─ product_variants
  │        ├─ products
  │        └─ inventory
  │
  ├─ (Many) orders ✨ (payment_status)
  │  └─ order_items
  │     └─ product_variants
  │
  ├─ (Many) payments ✨
  │  └─ orders
  │
  ├─ (Many) purchase_policies
  │  └─ policy evaluations
  │
  ├─ (Many) ai_sessions
  │  └─ ai_actions
  │     ├─ products (optional)
  │     └─ audit trail
  │
  └─ (Many) audit_logs
     ├─ events
     └─ related orders


Key Relationships:
- order.id ──────────> order_items.order_id (1:M)
- order.payment_id ──> payments.id (1:1)
- payments.order_id ─> orders.id (M:1)
- cart.user_id ──────> users.id (M:1)
- order.user_id ────> users.id (M:1)
- ai_session.user_id > users.id (M:1)
- ai_action.session_id > ai_sessions.id (M:1)
```

---

## File Organization

```
backend/src/
├── controllers/
│   ├── paymentController.ts ✨ (NEW)
│   │   └── Methods:
│   │       ├── createRazorpayOrder()
│   │       ├── capturePayment()
│   │       ├── handlePaymentFailure()
│   │       ├── getPaymentForOrder()
│   │       └── createTestPayment()
│   │
│   ├── orderController.ts
│   ├── cartController.ts
│   └── ...
│
├── services/
│   ├── paymentService.ts ✨ (NEW)
│   │   └── Methods:
│   │       ├── createRazorpayOrder()
│   │       ├── capturePayment()
│   │       ├── verifyPaymentSignature()
│   │       ├── handlePaymentFailure()
│   │       └── ...
│   │
│   ├── inventoryService.ts ✨ (ENHANCED)
│   │   └── New Methods:
│   │       ├── deductForOrder()
│   │       ├── deductForOrderItems()
│   │       ├── releaseReserved()
│   │       └── reserveForCart()
│   │
│   ├── orderService.ts
│   ├── cartService.ts
│   └── ...
│
├── repositories/
│   ├── commonRepository.ts ✨ (ENHANCED)
│   │   └── New: paymentRepository
│   │       ├── create()
│   │       ├── findByOrderId()
│   │       └── updateStatus()
│   │
│   ├── orderRepository.ts ✨ (ENHANCED)
│   │   └── New Methods:
│   │       ├── updatePaymentStatus()
│   │       └── updateOrderStatus()
│   │
│   ├── inventoryRepository.ts ✨ (ENHANCED)
│   │   └── New Methods:
│   │       ├── deductStock()
│   │       ├── reserveStock()
│   │       └── releaseReserved()
│   │
│   └── ...
│
├── routes/
│   ├── payment.ts ✨ (NEW)
│   ├── orders.ts
│   ├── cart.ts
│   └── ...
│
└── index.ts ✨ (ENHANCED)
    └── Imports & registers paymentRouter


src/ (Frontend)
├── services/
│   ├── paymentService.ts ✨ (NEW)
│   │   └── Methods:
│   │       ├── createRazorpayOrder()
│   │       ├── capturePayment()
│   │       ├── handlePaymentFailure()
│   │       ├── openRazorpayCheckout()
│   │       └── ...
│   │
│   ├── aiBuyerService.ts ✨ (ENHANCED)
│   │   └── New: logAction()
│   │
│   ├── orderService.ts
│   ├── cartService.ts
│   └── ...
│
└── pages/buyer/
    ├── CheckoutPage.tsx ✨ (COMPLETE REWRITE)
    │   └── Features:
    │       ├── Form step (customer info)
    │       ├── Policy step (evaluation)
    │       ├── Payment step (Razorpay)
    │       ├── Confirmation step
    │       └── Error handling
    │
    ├── CartPage.tsx
    ├── AIBuyerPage.tsx
    └── ...
```

---

## Error Handling Flow

```
┌────────────────────────────────────────────────┐
│         ERROR SCENARIOS & RECOVERY             │
└────────────────────────────────────────────────┘

1. Payment Failure
   User pays with invalid card
   │
   Razorpay declines
   │
   Frontend receives error
   │
   POST /payments/:orderId/failure
   │
   Backend logs failure (audit)
   │
   Order remains in system (payment_status=failed)
   │
   Inventory NOT deducted
   │
   Show retry option
   │
   User can try again

2. Duplicate Payment Prevention
   User clicks pay twice rapidly
   │
   Two payment_ids received
   │
   Backend checks existing payment for order
   │
   If payment exists and successful → reject
   │
   If payment failed → allow retry
   │
   Returns conflict error

3. Inventory Deduction Failure
   Inventory insufficient
   │
   SQL UPDATE fails (stock < quantity)
   │
   Exception thrown
   │
   Transaction rolls back
   │
   Order remains created (no payment deducted)
   │
   Customer notified
   │
   Can retry with different quantity

4. Payment Capture Error
   Network fails during capture
   │
   Frontend retries with same payment_id
   │
   Backend idempotency check:
   │  - Already processed? Return success
   │  - Not processed? Process now
   │
   Customer gets correct result either way

5. Logging Failure (Silent Fail)
   AI action logging fails
   │
   Backend catches error
   │
   Logs to stderr (not visible to user)
   │
   Payment & order processing continues
   │
   User never sees logging error
   │
   System still works correctly
```

---

## Performance Characteristics

```
Operation                    Target Time    Method
──────────────────────────────────────────────────────
Cart Add                     < 100ms        Direct DB
Payment Creation            < 1s           Mock Razorpay
Payment Capture             < 2s           Verify + DB
Inventory Deduction         < 200ms        SQL UPDATE
Order Creation              < 500ms        Multi-insert
Policy Evaluation           < 300ms        DB queries
Page Load (Checkout)        < 2s           React render
Razorpay Modal Open         < 3s           Script load
Complete Payment Flow       < 10s          End-to-end
```

---

## Security Layers

```
┌──────────────────────────────────────────────┐
│            SECURITY IMPLEMENTATION           │
└──────────────────────────────────────────────┘

1. Payment Processing
   ├─ Razorpay signature verification
   ├─ Amount validation
   ├─ Order ID validation
   ├─ Duplicate payment detection
   └─ TEST MODE only (no real funds)

2. Data Integrity
   ├─ Database transactions
   ├─ Row-level locking (FOR UPDATE)
   ├─ Foreign key constraints
   ├─ Check constraints
   └─ Audit logging

3. Inventory Safety
   ├─ Atomic UPDATE operations
   ├─ No race conditions (SQL-level)
   ├─ Reservation system
   ├─ Release on rollback
   └─ Stock validation

4. API Security
   ├─ CORS enabled
   ├─ Request validation
   ├─ Error messages sanitized
   ├─ No sensitive data in logs
   └─ Rate limiting ready

5. Audit Trail
   ├─ All operations logged
   ├─ User tracking
   ├─ Timestamp for all records
   ├─ Before/after values captured
   └─ Event classification
```

---

## Deployment Checklist

```
PRE-DEPLOYMENT
□ TypeScript builds: npm run build
□ No console errors
□ No TypeScript errors
□ Environment variables set
□ Database migrations run
□ Test data seeded

DEPLOYMENT
□ Backend starts: npm start
□ Frontend builds: npm run build
□ Database connection works
□ Health endpoint responds
□ All routes accessible

POST-DEPLOYMENT
□ Cart operations work
□ Policy evaluation works
□ Razorpay modal opens
□ Test payment succeeds
□ Order created
□ Inventory updated
□ Logs created

VERIFICATION
□ No 500 errors
□ No 404 errors
□ Database data consistent
□ Performance acceptable
□ User feedback clear
```

---

**Architecture Version**: 1.0  
**Phase 5 Ready**: ✅  
**Demo Validated**: ✅  
