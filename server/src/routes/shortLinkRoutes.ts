import express from 'express';
import { createShortLink, redirectShortLink } from '../controllers/shortLinkController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Create short link (Optional auth if you want to track who made it)
// We'll allow public creation for now or check if token exists optionally.
// For simplicity in this hackathon, let's make it public or use auth if available.
// But the prompt implies the USER uses it. So let's use authenticateToken but maybe make it optional?
// For now, let's assume logged-in users generate it from dashboard.
router.post('/', authenticateToken, createShortLink);

// Redirect (Public)
router.get('/:code', redirectShortLink);

export default router;
