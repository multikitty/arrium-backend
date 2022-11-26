import express from 'express';
import { authentication } from '../Middlewares/authentication';
const router = express.Router();
router.use(express.json());
import StripeController from '../Controllers/StripeController';

router.get('/pricing-plans', authentication('driver'), new StripeController().getPricingPlans);
router.post('/select-plan/:id', authentication('driver'), new StripeController().onSelectPlan);
router.get('/get-invoices', authentication('driver'), new StripeController().getInvoices);
router.get('/get-invoices-admin', authentication('admin'), new StripeController().getInvoicesAdmin);
router.post('/webhooks', new StripeController().handleStripeEvents);
router.post('/create-stripe-customer', authentication('driver'), new StripeController().createStripeCustomer);
export = router;
