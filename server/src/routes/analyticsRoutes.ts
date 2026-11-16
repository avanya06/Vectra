import express from 'express';
import { trackClick, getDashboardStats } from '../controllers/analyticsController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Public: Track click
router.post('/track', trackClick);

// Protected: Get Dashboard Stats
router.get('/dashboard', authenticateToken, getDashboardStats);

export default router;
