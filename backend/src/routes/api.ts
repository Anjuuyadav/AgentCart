import { Router } from 'express';

const router = Router();

// Placeholder routes for future backend integration.
// Currently returns 501 to signal "not yet implemented" so frontend
// services can later swap mock implementations for API calls.

router.get('/products', (_req, res) => {
  res.status(501).json({
    ok: false,
    error: 'Not implemented in Phase 1. Use mockData for now.',
    hint: 'Frontend uses src/services/productService.ts backed by src/data/mockData.ts. Swap for fetch("/api/v1/products") in Phase 2.',
  });
});

export { router as v1Router };
