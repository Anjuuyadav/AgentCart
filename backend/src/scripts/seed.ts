import { getClient, closePool, query, testConnection } from '../config/database.js';
import {
  products,
  demoOrder,
  aiRecommendations,
  aiInsights,
  auditEvents,
  aiBuyerActivities,
  merchantMetrics,
  analyticsData,
} from '../seed/data.js';
import type { ProductVariant, AIInsight, AIRecommendation, AuditEvent, AIBuyerActivity, OrderTimelineEvent } from '../seed/types.js';

type SeedCounts = {
  users: number;
  merchants: number;
  products: number;
  variants: number;
  inventory: number;
  carts: number;
  cartItems: number;
  orders: number;
  orderItems: number;
  payments: number;
  purchasePolicies: number;
  aiSessions: number;
  aiActions: number;
  insights: number;
  recommendations: number;
  auditLogs: number;
};

const MERCHANT_STORE_NAME = 'AgentCart Fashion House';
const MERCHANT_EMAIL = 'merchant@agentcart.ai';
const CUSTOMER_NAME = 'Priya Sharma';
const CUSTOMER_EMAIL = 'priya.sharma@email.com';

function json(value: unknown): string {
  return JSON.stringify(value);
}

function mapAuditActor(actor: AuditEvent['actor']): string {
  switch (actor) {
    case 'AI Buyer':
      return 'ai_buyer';
    case 'AI Merchant':
      return 'ai_merchant';
    case 'System':
      return 'system';
    case 'Customer':
      return 'customer';
    case 'Merchant':
      return 'merchant';
    default:
      return 'system';
  }
}

function mapAIActionType(type: AIBuyerActivity['type']): string {
  switch (type) {
    case 'search':
    case 'view':
    case 'cart':
    case 'purchase':
    case 'compare':
      return type;
    default:
      return 'view';
  }
}

async function runSeed(): Promise<SeedCounts> {
  const counts: SeedCounts = {
    users: 0,
    merchants: 0,
    products: 0,
    variants: 0,
    inventory: 0,
    carts: 0,
    cartItems: 0,
    orders: 0,
    orderItems: 0,
    payments: 0,
    purchasePolicies: 0,
    aiSessions: 0,
    aiActions: 0,
    insights: 0,
    recommendations: 0,
    auditLogs: 0,
  };

  console.log('\n========================================');
  console.log('  AgentCart Database Seed');
  console.log('========================================\n');

  const connCheck = await testConnection();
  if (!connCheck.ok) {
    throw new Error(`Database not reachable: ${connCheck.message}`);
  }
  console.log(`✅ ${connCheck.message}\n`);

  const client = await getClient();
  try {
    await client.query('BEGIN');
    console.log('🔒 Transaction started\n');

    // --------------------------------------------------------
    // 1. USERS (customer + merchant users)
    // --------------------------------------------------------
    console.log('📋 Seeding users...');
    const defaultPreferences = {
      budgetLimit: 5000,
      preferredSizes: ['M'],
      preferredColors: ['Wine', 'Burgundy'],
      preferredCategories: ['wedding-dresses', 'earrings'],
      autoApproveUnderBudget: true,
      aiPersonalization: true,
      notifications: true,
    };

    const userRes = await client.query(
      `INSERT INTO users (email, name, phone, default_address, preferences)
       VALUES ($1, $2, $3, $4, $5::jsonb)
       ON CONFLICT (email) DO UPDATE SET
         name = EXCLUDED.name,
         default_address = EXCLUDED.default_address,
         preferences = EXCLUDED.preferences
       RETURNING id`,
      [
        CUSTOMER_EMAIL,
        CUSTOMER_NAME,
        '+91 98765 43210',
        '42, Green Park Extension, New Delhi - 110016',
        json(defaultPreferences),
      ]
    );
    const customerUserId = userRes.rows[0].id;
    counts.users = 1;
    console.log(`   ✅ Customer user: ${CUSTOMER_EMAIL}`);

    const merchantUserRes = await client.query(
      `INSERT INTO users (email, name, phone, preferences)
       VALUES ($1, $2, $3, $4::jsonb)
       ON CONFLICT (email) DO UPDATE SET
         name = EXCLUDED.name,
         preferences = EXCLUDED.preferences
       RETURNING id`,
      [
        MERCHANT_EMAIL,
        MERCHANT_STORE_NAME,
        '+91 98111 11111',
        json({ role: 'merchant' }),
      ]
    );
    const merchantUserId = merchantUserRes.rows[0].id;
    counts.users += 1;
    console.log(`   ✅ Merchant user: ${MERCHANT_EMAIL}`);
    console.log(`   Total users: ${counts.users}\n`);

    // --------------------------------------------------------
    // 2. MERCHANTS
    // --------------------------------------------------------
    console.log('🏬 Seeding merchants...');
    const merchantSettings = {
      storeName: MERCHANT_STORE_NAME,
      email: MERCHANT_EMAIL,
      aiRecommendationsEnabled: true,
      autoApproveBundles: false,
      crossSellEnabled: true,
      theme: 'light' as const,
    };

    const merchantRes = await client.query(
      `INSERT INTO merchants (user_id, store_name, email, phone, settings)
       VALUES ($1, $2, $3, $4, $5::jsonb)
       ON CONFLICT (email) DO UPDATE SET
         store_name = EXCLUDED.store_name,
         settings = EXCLUDED.settings
       RETURNING id`,
      [
        merchantUserId,
        MERCHANT_STORE_NAME,
        MERCHANT_EMAIL,
        '+91 98111 11111',
        json(merchantSettings),
      ]
    );
    const merchantId = merchantRes.rows[0].id;
    counts.merchants = 1;
    console.log(`   ✅ Merchant: ${MERCHANT_STORE_NAME}\n`);

    // --------------------------------------------------------
    // 3. PRODUCTS + VARIANTS + INVENTORY
    // --------------------------------------------------------
    console.log('👗 Seeding products, variants, and inventory...');

    const variantIdMap: Record<string, { variantId: string; sku: string }> = {};

    for (const product of products) {
      // Product
      await client.query(
        `INSERT INTO products
         (id, merchant_id, name, description, price, original_price, category,
          image, images, rating, review_count, tags, specifications, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, $11, $12::jsonb, $13::jsonb, true)
         ON CONFLICT (id) DO UPDATE SET
           merchant_id = EXCLUDED.merchant_id,
           name = EXCLUDED.name,
           description = EXCLUDED.description,
           price = EXCLUDED.price,
           original_price = EXCLUDED.original_price,
           category = EXCLUDED.category,
           image = EXCLUDED.image,
           images = EXCLUDED.images,
           rating = EXCLUDED.rating,
           review_count = EXCLUDED.review_count,
           tags = EXCLUDED.tags,
           specifications = EXCLUDED.specifications`,
        [
          product.id,
          merchantId,
          product.name,
          product.description,
          product.price,
          product.originalPrice ?? null,
          product.category,
          product.image,
          json(product.images),
          product.rating,
          product.reviewCount,
          json(product.tags),
          json(product.specifications),
        ]
      );
      counts.products++;

      // Variants
      for (const variant of product.variants) {
        const vRes = await client.query(
          `INSERT INTO product_variants (product_id, size, color, sku, price_override)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (sku) DO UPDATE SET
             product_id = EXCLUDED.product_id,
             size = EXCLUDED.size,
             color = EXCLUDED.color
           RETURNING id, sku`,
          [product.id, variant.size, variant.color, variant.sku, null]
        );
        const variantId = vRes.rows[0].id;
        variantIdMap[variant.sku] = { variantId, sku: variant.sku };
        counts.variants++;

        // Inventory
        await client.query(
          `INSERT INTO inventory (variant_id, product_id, stock, reserved)
           VALUES ($1, $2, $3, 0)
           ON CONFLICT (variant_id) DO UPDATE SET
             product_id = EXCLUDED.product_id,
             stock = EXCLUDED.stock`,
          [variantId, product.id, variant.stock]
        );
        counts.inventory++;
      }
    }
    console.log(`   ✅ Products: ${counts.products}`);
    console.log(`   ✅ Variants: ${counts.variants}`);
    console.log(`   ✅ Inventory records: ${counts.inventory}\n`);

    // --------------------------------------------------------
    // 4. CARTS + CART ITEMS (demo order cart)
    // --------------------------------------------------------
    console.log('🛒 Seeding carts and cart items...');
    const cartRes = await client.query(
      `INSERT INTO carts (user_id, session_id, status, created_at, updated_at)
       VALUES ($1, $2, $3::cart_status, NOW(), NOW())
       RETURNING id`,
      [customerUserId, 'demo-session-wedding-001', 'checked_out']
    );
    const cartId = cartRes.rows[0].id;
    counts.carts = 1;

    const demoVariant = products[0].variants.find(
      (v: ProductVariant) => v.size === 'M' && v.color === 'Wine'
    );
    const demoVariantId = demoVariant ? variantIdMap[demoVariant.sku]?.variantId : null;

    await client.query(
      `INSERT INTO cart_items
       (cart_id, product_id, variant_id, quantity, unit_price, size, color)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        cartId,
        demoOrder.productId,
        demoVariantId ?? null,
        demoOrder.quantity,
        products[0].price,
        demoOrder.size,
        demoOrder.color,
      ]
    );
    counts.cartItems = 1;
    console.log(`   ✅ Carts: ${counts.carts}, Cart items: ${counts.cartItems}\n`);

    // --------------------------------------------------------
    // 5. ORDERS + ORDER ITEMS + PAYMENTS + PURCHASE POLICIES
    // --------------------------------------------------------
    console.log('📦 Seeding orders, payments, and policies...');

    const orderTimelineJson = demoOrder.timeline.map((evt: OrderTimelineEvent) => ({
      id: evt.id,
      label: evt.label,
      timestamp: evt.timestamp instanceof Date ? evt.timestamp.toISOString() : new Date().toISOString(),
      status: evt.status,
    }));

    const orderRes = await client.query(
      `INSERT INTO orders
       (order_number, user_id, cart_id, total_amount, status, payment_status,
        customer_name, customer_email, shipping_address, is_ai_buyer_order, ai_match_score, timeline)
       VALUES ($1, $2, $3, $4, $5::order_status, $6::payment_status,
               $7, $8, $9, $10, $11, $12::jsonb)
       ON CONFLICT (order_number) DO UPDATE SET
         total_amount = EXCLUDED.total_amount,
         customer_name = EXCLUDED.customer_name,
         customer_email = EXCLUDED.customer_email,
         shipping_address = EXCLUDED.shipping_address,
         is_ai_buyer_order = EXCLUDED.is_ai_buyer_order,
         ai_match_score = EXCLUDED.ai_match_score,
         timeline = EXCLUDED.timeline
       RETURNING id, order_number`,
      [
        demoOrder.orderNumber,
        customerUserId,
        cartId,
        demoOrder.amount,
        demoOrder.status,
        demoOrder.paymentStatus,
        demoOrder.customerName,
        demoOrder.customerEmail,
        demoOrder.shippingAddress,
        demoOrder.isAiBuyerOrder,
        demoOrder.aiMatchScore ?? null,
        json(orderTimelineJson),
      ]
    );
    const orderId = orderRes.rows[0].id;
    const orderNumber = orderRes.rows[0].order_number;
    counts.orders = 1;

    // Order items
    await client.query(
      `INSERT INTO order_items
       (order_id, product_id, variant_id, quantity, unit_price, product_name, product_image, size, color)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        orderId,
        demoOrder.productId,
        demoVariantId ?? null,
        demoOrder.quantity,
        products[0].price,
        demoOrder.productName,
        demoOrder.productImage,
        demoOrder.size,
        demoOrder.color,
      ]
    );
    counts.orderItems = 1;

    // Payment
    await client.query(
      `INSERT INTO payments (order_id, amount, method, status, transaction_id, raw_response)
       VALUES ($1, $2, $3, $4::payment_status, $5, $6::jsonb)`,
      [
        orderId,
        demoOrder.amount,
        'razorpay_test',
        'success',
        `rzp_test_demo_${Date.now()}`,
        json({ mode: 'demo', gateway: 'mock_razorpay' }),
      ]
    );
    counts.payments = 1;

    // Purchase policy
    const policyChecks = [
      { id: 'c1', label: 'Budget limit satisfied', passed: true },
      { id: 'c2', label: 'Product available', passed: true },
      { id: 'c3', label: 'Size available', passed: true },
      { id: 'c4', label: 'Merchant trusted', passed: true },
      { id: 'c5', label: 'Purchase authorized', passed: true },
    ];
    await client.query(
      `INSERT INTO purchase_policies
       (order_id, cart_id, user_id, status, checks, evaluated_by)
       VALUES ($1, $2, $3, $4::policy_status, $5::jsonb, $6)`,
      [
        orderId,
        cartId,
        customerUserId,
        'approved',
        json(policyChecks),
        'system_demo',
      ]
    );
    counts.purchasePolicies = 1;
    console.log(`   ✅ Orders: ${counts.orders}`);
    console.log(`   ✅ Order items: ${counts.orderItems}`);
    console.log(`   ✅ Payments: ${counts.payments}`);
    console.log(`   ✅ Purchase policies: ${counts.purchasePolicies}\n`);

    // --------------------------------------------------------
    // 6. AI SESSIONS + AI ACTIONS (Buyer activities)
    // --------------------------------------------------------
    console.log('🤖 Seeding AI sessions and actions...');

    const aiSessionRes = await client.query(
      `INSERT INTO ai_sessions
       (user_id, session_type, initial_query, requirements, status, started_at, created_at)
       VALUES ($1, $2::ai_session_type, $3, $4::jsonb, $5, NOW(), NOW())
       RETURNING id`,
      [
        customerUserId,
        'buyer',
        'I need a wine-colored wedding dress under ₹5,000, size M.',
        json({
          occasion: 'Wedding',
          budget: 5000,
          size: 'M',
          color: 'Wine',
        }),
        'completed',
      ]
    );
    const aiSessionId = aiSessionRes.rows[0].id;
    counts.aiSessions = 1;

    for (const activity of aiBuyerActivities) {
      await client.query(
        `INSERT INTO ai_actions
         (ai_session_id, user_id, action_type, query, product_id, product_name,
          match_score, revenue, metadata, created_at)
         VALUES ($1, $2, $3::ai_action_type, $4, $5, $6, $7, $8, $9::jsonb, $10)`,
        [
          aiSessionId,
          customerUserId,
          mapAIActionType(activity.type),
          activity.query ?? null,
          activity.productId ?? null,
          activity.productName ?? null,
          activity.matchScore ?? null,
          activity.revenue ?? null,
          json({ source: 'demo_seed' }),
          activity.timestamp instanceof Date ? activity.timestamp : new Date(activity.timestamp),
        ]
      );
      counts.aiActions++;
    }
    console.log(`   ✅ AI sessions: ${counts.aiSessions}`);
    console.log(`   ✅ AI actions: ${counts.aiActions}\n`);

    // --------------------------------------------------------
    // 7. AI INSIGHTS + RECOMMENDATIONS
    // --------------------------------------------------------
    console.log('💡 Seeding AI insights and recommendations...');

    const insightIdMap: Record<string, string> = {};

    for (const insight of aiInsights as (AIInsight & { id?: string })[]) {
      const iRes = await client.query(
        `INSERT INTO ai_insights
         (merchant_id, type, title, description, impact, metadata, created_at)
         VALUES ($1, $2::insight_type, $3, $4, $5, $6::jsonb, $7)
         RETURNING id`,
        [
          merchantId,
          insight.type,
          insight.title,
          insight.description,
          insight.impact,
          json({ source: 'demo', metrics: merchantMetrics, analytics: analyticsData }),
          insight.createdAt instanceof Date ? insight.createdAt : new Date(insight.createdAt),
        ]
      );
      if (insight.id) insightIdMap[insight.id] = iRes.rows[0].id;
      counts.insights++;
    }

    for (const rec of aiRecommendations as (AIRecommendation & { id?: string })[]) {
      const linkedInsightId = rec.id === 'rec-001' ? insightIdMap['insight-001'] : null;
      await client.query(
        `INSERT INTO recommendations
         (merchant_id, ai_insight_id, type, title, description, product_ids,
          expected_impact, revenue_impact, status, created_at)
         VALUES ($1, $2, $3::recommendation_type, $4, $5, $6, $7, $8,
                 $9::recommendation_status, $10)`,
        [
          merchantId,
          linkedInsightId ?? null,
          rec.type,
          rec.title,
          rec.description,
          rec.productIds,
          rec.expectedImpact,
          rec.revenueImpact,
          rec.status,
          rec.createdAt instanceof Date ? rec.createdAt : new Date(rec.createdAt),
        ]
      );
      counts.recommendations++;
    }
    console.log(`   ✅ AI insights: ${counts.insights}`);
    console.log(`   ✅ Recommendations: ${counts.recommendations}\n`);

    // --------------------------------------------------------
    // 8. AUDIT LOGS
    // --------------------------------------------------------
    console.log('📜 Seeding audit logs...');

    for (const event of auditEvents as (AuditEvent & { id?: string })[]) {
      await client.query(
        `INSERT INTO audit_logs
         (actor, event, status, related_order_id, related_order_number,
          related_product_id, related_product_name, metadata, created_at)
         VALUES ($1::audit_actor, $2, $3::audit_status, $4, $5, $6, $7, $8::jsonb, $9)`,
        [
          mapAuditActor(event.actor),
          event.event,
          event.status,
          event.relatedOrder ? orderId : null,
          event.relatedOrder ?? null,
          null,
          event.relatedProduct ?? null,
          json({ seed: true, seed_id: event.id }),
          event.timestamp instanceof Date ? event.timestamp : new Date(event.timestamp),
        ]
      );
      counts.auditLogs++;
    }
    console.log(`   ✅ Audit logs: ${counts.auditLogs}\n`);

    // --------------------------------------------------------
    // COMMIT
    // --------------------------------------------------------
    await client.query('COMMIT');
    console.log('💾 Transaction committed\n');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Transaction rolled back due to error');
    throw err;
  } finally {
    client.release();
  }

  console.log('========================================');
  console.log('  Seed Summary');
  console.log('========================================');
  const entries = Object.entries(counts) as [keyof SeedCounts, number][];
  for (const [k, v] of entries) {
    if (v > 0) {
      console.log(`  ${k.padEnd(20)}: ${v}`);
    }
  }
  console.log('========================================\n');

  return counts;
}

if (
  process.argv[1]?.endsWith('seed.ts') ||
  import.meta.url.endsWith('seed.ts') ||
  process.argv.some((a) => a.includes('seed'))
) {
  runSeed()
    .then(() => {
      console.log('🎉 Seed complete!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('\n💥 Seed failed:', (err as Error).message);
      process.exit(1);
    })
    .finally(() => closePool());
}

export { runSeed };
