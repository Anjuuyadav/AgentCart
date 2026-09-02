# Phase 5 - Comprehensive Testing Guide
## AI Buyer → Commerce → Payment → Order Flow

---

## QUICK START TESTING (5 minutes)

### Setup
```bash
# Terminal 1: Backend
cd c:\Users\Anju\Desktop\AgentCart\backend
npm run dev

# Terminal 2: Frontend
cd c:\Users\Anju\Desktop\AgentCart
npm run dev

# Terminal 3: Database (if needed)
# Ensure PostgreSQL is running on localhost:5432
```

### Access URLs
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000/api
- Buyer: http://localhost:5173/buyer
- Cart: http://localhost:5173/cart
- Checkout: http://localhost:5173/checkout
- Orders: http://localhost:5173/orders

---

## TEST SCENARIO 1: Complete AI Buyer → Order Flow

### Step 1: AI Buyer Search (AIBuyerPage)
**URL**: `http://localhost:5173/buyer`

**Test Input**:
```
"I need a wine-colored wedding dress under ₹5,000, size M"
```

**Expected Output**:
```
✓ Requirement understood
✓ Occasion: Wedding
✓ Budget: ₹5,000
✓ Size: M
✓ Color: Wine
✓ AI Match: 82%
✓ Product: Wine Satin Wedding Dress
✓ Price: ₹4,299
✓ Available variants shown
```

### Step 2: Select Product
**Action**: Click on "Wine Satin Wedding Dress"
**Expected**: Navigate to ProductDetailPage

**On ProductDetailPage**:
- [ ] Product name visible
- [ ] Price: ₹4,299
- [ ] Rating and reviews
- [ ] Size selector (M available)
- [ ] Color selector (Wine available)
- [ ] Add to Cart button

### Step 3: Add to Cart
**Action**:
1. Select Size: M
2. Select Color: Wine
3. Click "Add to Cart"

**Expected**:
- [ ] Confirmation toast: "Added to cart"
- [ ] Cart count increased to 1
- [ ] Navigate to CartPage automatically (or manually)

### Step 4: Review Cart
**URL**: `http://localhost:5173/cart`

**Expected**:
- [ ] Product visible in cart
- [ ] Correct size (M) and color (Wine)
- [ ] Price: ₹4,299
- [ ] Quantity: 1
- [ ] Subtotal: ₹4,299
- [ ] Total: ₹4,299
- [ ] Checkout button visible

### Step 5: Proceed to Checkout
**Action**: Click "Proceed to Checkout" or navigate to `/checkout`

**Expected**: CheckoutPage loads with:
- [ ] Step 1: Customer Information form
- [ ] Pre-filled name: "Priya Sharma"
- [ ] Pre-filled email: "priya.sharma@email.com"
- [ ] Pre-filled address (can be edited)
- [ ] Order summary on right showing product

### Step 6: Policy Evaluation
**Action**: Click "Continue to Purchase Policy"

**Expected Form Validation**:
- [ ] Name required
- [ ] Email required (valid format)
- [ ] Address required (min 10 chars)

**Expected Policy Evaluation**:
```
✓ Budget limit: ₹5,000
✓ Cart total: ₹4,299
✓ Size M available
✓ Wine color available
✓ Inventory available
✓ AI purchase authorization

STATUS: APPROVED
```

### Step 7: Payment
**Action**: Click "Proceed to Payment"

**Expected**:
- [ ] Payment step shows
- [ ] Razorpay Test Mode badge visible
- [ ] Test card info shown: 4111 1111 1111 1111
- [ ] Total amount: ₹4,299
- [ ] Button: "Open Razorpay Checkout"

### Step 8: Razorpay TEST Payment
**Action**: Click "Open Razorpay Checkout"

**Razorpay Modal Should Show**:
- [ ] Modal title: "AgentCart"
- [ ] Amount: ₹4,299
- [ ] Customer email: priya.sharma@email.com
- [ ] Pay button

**Test Card Details**:
```
Card Number: 4111 1111 1111 1111
Expiry: Any future date (e.g., 12/25)
CVV: Any 3 digits (e.g., 123)
```

**Action**: Fill and submit test payment

**Expected**:
- [ ] Payment processing
- [ ] Success confirmation
- [ ] Modal closes
- [ ] Checkout page shows confirmation screen

### Step 9: Order Confirmation
**Expected Confirmation Screen**:
```
✓ Payment Successful!
✓ Order confirmed
✓ Order Number: AC-10429 (or similar)
✓ View Order Details button
```

### Step 10: Order Verification
**Action**: Click "View Order Details" or navigate to `/orders/AC-10429`

**Expected**:
- [ ] Order number: AC-10429
- [ ] Status: Processing
- [ ] Payment status: Success
- [ ] Total amount: ₹4,299
- [ ] Product: Wine Satin Wedding Dress
- [ ] Size: M
- [ ] Color: Wine
- [ ] Timeline showing: Order Placed, Payment Confirmed, Processing
- [ ] Customer info displayed

### Step 11: Verify All Orders
**URL**: `http://localhost:5173/orders`

**Expected**:
- [ ] Order AC-10429 in list
- [ ] Order status: Processing
- [ ] Payment status: Success
- [ ] Amount: ₹4,299

---

## TEST SCENARIO 2: Policy Rejection

### Setup
Same as Scenario 1, but with different budget

### Test Input to AI Buyer
```
"I need a wine-colored wedding dress under ₹3,000, size M"
```

### Expected at Policy Step
```
✗ Budget limit: ₹3,000
✗ Cart total: ₹4,299
✗ Product exceeds budget by ₹1,299

STATUS: REJECTED
```

**Expected**: "Proceed to Payment" button disabled

---

## TEST SCENARIO 3: Inventory Depletion

### Setup
1. Complete purchase in Scenario 1
2. Check inventory in database

### Database Verification
```sql
SELECT i.stock, i.reserved, (i.stock - i.reserved) as available
FROM inventory i
JOIN product_variants v ON v.id = i.variant_id
WHERE v.product_id = 'dress_001' 
  AND v.size = 'M' 
  AND v.color = 'Wine';
```

**Expected**:
- [ ] Stock reduced by 1
- [ ] Example: Before: 10, After: 9

---

## TEST SCENARIO 4: Payment Failure

### Step 1-7: Same as Scenario 1

### Step 8: Use Invalid Card
**Action**: In Razorpay modal, enter invalid details

**Invalid Card Numbers**:
```
4000 0000 0000 0002 (will be declined)
5555 5555 5555 4444 (will be declined)
```

**Expected**:
- [ ] Razorpay shows error
- [ ] Transaction declines
- [ ] Modal closes
- [ ] Checkout shows error message
- [ ] "Try Again" button available

### Step 9: Database Check
```sql
SELECT * FROM payments 
WHERE order_id = (SELECT id FROM orders ORDER BY created_at DESC LIMIT 1)
LIMIT 1;
```

**Expected**:
- [ ] Payment status: failed
- [ ] Payment record created
- [ ] No amount deducted from inventory

---

## TEST SCENARIO 5: Duplicate Prevention

### Step 1-8: Start payment like Scenario 1

### Step 9: Rapid Clicking
**Action**: 
1. Wait for Razorpay to open
2. Complete payment
3. Check if second payment attempt is blocked

**Expected**:
- [ ] Only ONE payment record created
- [ ] Duplicate payment rejected
- [ ] Error message shown

### Database Verification
```sql
SELECT COUNT(*) FROM payments 
WHERE order_id = (SELECT id FROM orders WHERE order_number = 'AC-10429');
```

**Expected Result**: COUNT = 1

---

## TEST SCENARIO 6: Page Refresh Persistence

### Step 1-6: Complete up to Policy step

### Action: Refresh Page (F5)
**Expected**:
- [ ] Checkout step maintained
- [ ] Form data preserved
- [ ] Cart still visible in sidebar
- [ ] No loss of state

### Step 7: Continue Payment
**Expected**: Flow continues normally

---

## TEST SCENARIO 7: Variant Availability Check

### Step 1: AI Buyer Search
```
"I need a wedding dress in size XL and color Black"
```

### Step 2-6: Try to add to cart

**Expected at Policy Step**:
```
✗ Size XL not available (or whatever size is out of stock)
✗ Color Black not available

STATUS: REJECTED
```

---

## TEST SCENARIO 8: AI Action Logging

### Complete Scenario 1 Purchase

### Database Verification
```sql
SELECT action_type, product_id, product_name, match_score, revenue
FROM ai_actions
WHERE action_type = 'purchase'
ORDER BY created_at DESC
LIMIT 1;
```

**Expected**:
- [ ] Action type: purchase
- [ ] Product ID: dress_001
- [ ] Product name: Wine Satin Wedding Dress
- [ ] Match score: 82
- [ ] Revenue: 4299

---

## TEST SCENARIO 9: Audit Logging

### Complete Scenario 1 Purchase

### Database Verification
```sql
SELECT event, status, related_order_number, actor
FROM audit_logs
WHERE related_order_number IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;
```

**Expected Events**:
- [ ] ai_buyer session created
- [ ] product.viewed
- [ ] cart.item_added
- [ ] purchase_policy.evaluated
- [ ] order.created
- [ ] payment.captured
- [ ] order.confirmed

---

## PERFORMANCE TESTS

### Test 1: Load Time
**Metric**: Time from click Checkout to Razorpay modal opening

**Threshold**: < 3 seconds
**Method**:
1. Open DevTools (F12)
2. Go to Network tab
3. Click Checkout button
4. Note time until Razorpay loads

### Test 2: Database Query Performance
**Query**: Check order creation with items

```sql
-- Verify order and items created efficiently
SELECT COUNT(*) FROM orders WHERE created_at > NOW() - INTERVAL '1 minute';
SELECT COUNT(*) FROM order_items WHERE created_at > NOW() - INTERVAL '1 minute';
```

**Expected**: Both complete in < 100ms

---

## BROWSER CONSOLE CHECKS

### After completing purchase, check console for:

✓ No JavaScript errors
✓ No 404 errors in Network tab
✓ All API calls return 2xx/3xx status
✓ No XHR failures

---

## COMMON ISSUES & SOLUTIONS

### Issue 1: Razorpay not loading
**Solution**:
- Check browser console for errors
- Verify internet connection
- Clear browser cache
- Restart browser

### Issue 2: Checkout page blank
**Solution**:
- Verify backend running on :4000
- Check /api/health returns 200
- Clear localStorage: `localStorage.clear()`

### Issue 3: Payment says failed but order created
**Solution**:
- Check payment status in database
- Verify inventory not deducted
- Try payment again

### Issue 4: Cart empty on checkout
**Solution**:
- Add item again
- Verify localStorage has cart data
- Check backend /api/cart returns items

---

## AUTOMATED TEST CHECKLIST

### Cart Operations ✓
- [ ] Add product to cart
- [ ] Update quantity
- [ ] Remove item
- [ ] Clear cart
- [ ] Persist on refresh

### Policy Engine ✓
- [ ] Approve valid purchases
- [ ] Reject budget overages
- [ ] Check inventory
- [ ] Verify size/color
- [ ] Audit each evaluation

### Order Management ✓
- [ ] Create order with items
- [ ] Generate order number (AC-XXXXX)
- [ ] Store timeline
- [ ] Set payment_status = pending
- [ ] Link to cart

### Payment Flow ✓
- [ ] Create Razorpay order
- [ ] Open checkout modal
- [ ] Process test payment
- [ ] Verify signature
- [ ] Update payment_status = success
- [ ] Capture payment details

### Post-Payment ✓
- [ ] Update inventory
- [ ] Log AI action
- [ ] Create audit log
- [ ] Clear cart
- [ ] Show confirmation
- [ ] Persist order

### Error Handling ✓
- [ ] Handle payment failure
- [ ] Release inventory on failure
- [ ] Show meaningful errors
- [ ] Allow retry
- [ ] Log all failures

---

## SUCCESS CRITERIA

✅ All 9 test scenarios pass
✅ No console errors
✅ Database records created correctly
✅ Payment processed successfully
✅ Inventory updated
✅ Logs created
✅ Order visible in order history
✅ Policy enforcement working
✅ Duplicate prevention working
✅ End-to-end flow smooth

---

## SIGN-OFF CHECKLIST

- [ ] All 9 test scenarios completed
- [ ] No critical bugs found
- [ ] Database integrity verified
- [ ] Payment flow tested
- [ ] Error cases handled
- [ ] Documentation complete
- [ ] Demo ready for presentation
- [ ] Performance acceptable
- [ ] Ready for Phase 6

---

**Test Version**: 1.0
**Last Updated**: 2026-09-02
**Status**: Ready for Execution
