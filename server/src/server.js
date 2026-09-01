const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const app = require('./app');
const db = require('./config/db');

const PORT = process.env.PORT || 5000;

// Test DB Connection on startup
db.query('SELECT NOW() as connected_at')
  .then((res) => {
    console.log(`[Database] PostgreSQL connected successfully at ${res.rows[0].connected_at}`);
    
    app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`  AgentCart Server running on port ${PORT}`);
      console.log(`  Domain: Creator Gear / YouTube Starter`);
      console.log(`  Mode: Phase 1 — Foundation Only`);
      console.log(`  URL: http://localhost:${PORT}`);
      console.log(`=========================================`);
    });
  })
  .catch((err) => {
    console.error('[Database] Failed to connect to PostgreSQL:', err.message);
    process.exit(1);
  });
