import { query, closePool, testConnection, getClient } from '../config/database.js';

const TABLES_IN_ORDER = [
  'audit_logs',
  'recommendations',
  'ai_insights',
  'ai_actions',
  'ai_sessions',
  'purchase_policies',
  'payments',
  'order_items',
  'orders',
  'cart_items',
  'carts',
  'inventory',
  'product_variants',
  'products',
  'merchants',
  'users',
];

async function runReset(mode: 'hard' | 'soft' = 'soft'): Promise<void> {
  console.log('\n========================================');
  console.log(`  AgentCart Database Reset (${mode.toUpperCase()})`);
  console.log('========================================\n');

  const connCheck = await testConnection();
  if (!connCheck.ok) {
    throw new Error(`Database not reachable: ${connCheck.message}`);
  }
  console.log(`✅ ${connCheck.message}\n`);

  const client = await getClient();
  try {
    await client.query('BEGIN');

    console.log('⚠️  Disabling triggers...');
    await client.query('SET CONSTRAINTS ALL DEFERRED');

    if (mode === 'hard') {
      console.log('🔥 Dropping all tables...');
      for (const table of [...TABLES_IN_ORDER, 'schema_migrations']) {
        await client.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
        console.log(`   ✅ Dropped: ${table}`);
      }

      console.log('\n🧼 Dropping enum types...');
      const enums = [
        'order_status', 'payment_status', 'policy_status',
        'recommendation_type', 'recommendation_status', 'insight_type',
        'audit_actor', 'audit_status', 'ai_session_type',
        'ai_action_type', 'cart_status',
      ];
      for (const e of enums) {
        await client.query(`DROP TYPE IF EXISTS ${e} CASCADE`);
      }
      console.log(`   ✅ Dropped ${enums.length} enum types`);

      await client.query('DROP FUNCTION IF EXISTS update_updated_at CASCADE');
      console.log(`   ✅ Dropped trigger function`);
    } else {
      console.log('🧹 Clearing all table data (soft reset)...');
      for (const table of TABLES_IN_ORDER) {
        await client.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
        console.log(`   ✅ Truncated: ${table}`);
      }
      await client.query('DELETE FROM schema_migrations');
      console.log(`   ✅ Cleared schema_migrations`);
    }

    await client.query('COMMIT');
    console.log('\n💾 Reset committed successfully\n');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Reset rolled back due to error');
    throw err;
  } finally {
    client.release();
  }

  console.log('========================================');
  console.log(`  Reset complete (${mode})`);
  console.log('========================================\n');
}

const modeArg = process.argv.find((a) => a === '--hard') ? 'hard' : 'soft';

if (
  process.argv[1]?.endsWith('reset.ts') ||
  import.meta.url.endsWith('reset.ts') ||
  process.argv.some((a) => a.includes('reset'))
) {
  runReset(modeArg)
    .then(() => {
      console.log('🎉 Database reset! Now run:');
      console.log('   npm run db:migrate');
      console.log('   npm run db:seed');
      process.exit(0);
    })
    .catch((err) => {
      console.error('\n💥 Reset failed:', (err as Error).message);
      process.exit(1);
    })
    .finally(() => closePool());
}

export { runReset };
