import express from 'express';
import { currentUser } from '@anirbantickets/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res, next) => {
	res.status(200).json({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
