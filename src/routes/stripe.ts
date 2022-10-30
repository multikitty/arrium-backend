import express from 'express';
const router = express.Router();
router.use(express.json());

import { authSchema } from './../validationSchema/authSchema';
import { validationSchema } from './../Middlewares/validationSchema';
import { authentication } from './../Middlewares/authentication';
// import { SignupController } from "../Controllers/SignupController";
import StripeController from '../Controllers/StripeController';

// stripe routes
router.get('/pricing-plans', new StripeController().getPricingPlans);

export = router;
