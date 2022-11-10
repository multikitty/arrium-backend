import express from 'express';
const router = express.Router();
router.use(express.json());
import StripeController from '../Controllers/StripeController';

router.get('/pricing-plans', new StripeController().getPricingPlans);
router.post('/select-plan/:id', new StripeController().onSelectPlan);
router.post('/webhooks', new StripeController().handleStripeEvents);

export = router;
