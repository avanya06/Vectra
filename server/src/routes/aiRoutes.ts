import express from 'express';
import { generateRules } from '../controllers/aiController';

const router = express.Router();

router.post('/generate-rules', generateRules);

export default router;
