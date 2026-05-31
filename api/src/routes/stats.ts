import { Router } from 'express';
import * as db from '../db/repository.js';
import { asyncHandler } from '../middleware/async-handler.js';

const router = Router();

router.get('/summary', asyncHandler(async (_req, res) => {
  const data = await db.getStatsSummary();
  res.json({ data });
}));

router.get('/dashboard', asyncHandler(async (_req, res) => {
  const data = await db.getDashboardStats();
  res.json({ data });
}));

export default router;
