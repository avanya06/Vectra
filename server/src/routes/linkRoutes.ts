import express from 'express';
import { createLink, getLinks, updateLink, deleteLink, getPublicLinks } from '../controllers/linkController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Protected Routes (Dashboard)
router.post('/', authenticateToken, createLink);
router.get('/', authenticateToken, getLinks);
router.put('/:id', authenticateToken, updateLink);
router.delete('/:id', authenticateToken, deleteLink);

// Public Route (The Smart Hub)
router.get('/public/:username', getPublicLinks);

export default router;
