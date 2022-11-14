import express from 'express';
import { authentication } from '../Middlewares/authentication';
const router = express.Router();
router.use(express.json());
import StripeController from '../Controllers/StripeController';

router.get('/pricing-plans', new StripeController().getPricingPlans);
router.post(
  '/select-plan/:id',
  //  authentication('driver'),
  new StripeController().onSelectPlan
);
router.get('/get-invoices', authentication('driver'), new StripeController().getInvoices);
router.post('/webhooks', new StripeController().handleStripeEvents);

export = router;
