import express from 'express';
const router = express.Router();
router.use(express.json());
import StripeController from '../Controllers/StripeController';

router.get('/pricing-plans', new StripeController().getPricingPlans);
router.post('/webhooks', (req: any, res: any) => {
  console.log('hit webhooks');
});
export = router;
