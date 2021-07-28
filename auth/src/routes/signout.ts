import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res, next) => {
	req.session = null;
	res.status(200).json({ message: 'Succesfully Logged Out' });
});

export { router as signoutRouter };
