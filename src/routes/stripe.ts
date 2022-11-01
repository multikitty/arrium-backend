import express from 'express';
const router = express.Router();
router.use(express.json());
import StripeController from '../Controllers/StripeController';

// stripe routes
router.get('/pricing-plans', new StripeController().getPricingPlans);

export = router;
