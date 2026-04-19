import express from 'express';
import { placeBid, getItemBids } from '../controllers/bidController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:itemId').get(getItemBids).post(protect, placeBid);

export default router;
