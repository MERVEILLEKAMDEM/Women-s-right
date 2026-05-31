import { Router } from 'express';
import { REGIONS, THEMES } from '../types.js';
import * as db from '../db/repository.js';
import { asyncHandler } from '../middleware/async-handler.js';

const router = Router();

router.get('/', asyncHandler(async (_req, res) => {
  const themeCounts = await db.getThemeCounts();
  res.json({
    data: {
      regions: REGIONS,
      themes: THEMES,
      themeCounts,
    },
  });
}));

export default router;
