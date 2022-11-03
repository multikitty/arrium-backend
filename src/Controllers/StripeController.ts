import { FreeTrial } from 'Interfaces/stripeInterfaces';
import moment from 'moment';
import { SignupServices } from '../Services/SignupServices';
import StripeServices from '../Services/StripeServices';

export default class StripeController {
  async getPricingPlans(req: any, res: any) {
    const { getAll = false, active = true, name = '', plan_type } = req.query;
    try {
      const data = await new StripeServices().getPricingPlans({ getAll, active, name, plan_type });
      return res.status(200).json({ data, error: false, message: 'Successfully fetched pricing plans' });
    } catch (err: any) {
      return res.status(500).json({ error: true, message: err?.message });
    }
  }

  async createCustomerStripe(email: string, name: string) {
    try {
      const res = await new StripeServices().createCustomer(email, name);
      return res;
    } catch (error: any) {
      throw Error(error?.message);
    }
  }

  async handleStripeEvents(req: any, res: any) {
    const secret = 'whsec_gBHiboRyWj46FTEFxmsD68uS6HCQKTRV';
    const payload = req.rawBody;
    const signature = req.headers['stripe-signature'];
    try {
      const event = await new StripeServices().constructEvent({ payload, secret, signature });
      const event_type = event?.type;
      console.log({ event_type: event?.type });
      console.log({ event_object: event?.data?.object });
      switch (event_type) {
        case 'customer.subscription.deleted':
          /*check if current ended subscription is of free trial
            if free trial and not subscribed to any other subscription then change status inactive

          */

          console.log({ t: event?.object });
          break;
        default:
          throw Error(`Unhandled Event ${event?.type}`);
      }
    } catch (error: any) {
      console.log({ error: error?.message });
      res.end();
    }
  }

  public async subscribeToFreeTrial(data: FreeTrial) {
    const { pk, sk } = data;
    //create stripe Customer id
    const {
      Item: { firstname, lastname, email },
    }: any = await SignupServices.signupSendMailService({
      pk,
      sk,
    });
    const stripe_customer = await new StripeServices().createCustomer(email, `${firstname} ${lastname}`);
    //get all areas plan id from stripe
    let plans = await new StripeServices().getPricingPlans({
      active: true,
      getAll: false,
      plan_type: 'Basic',
      name: 'All Areas',
    });
    if (!plans?.length) {
      throw Error('Plan not found');
    }
    plans = plans[0]?.default_price;
    await new StripeServices().subscribeToPlan({ customerId: stripe_customer.id, planId: plans, isFreeTrial: true });
    const user = await new StripeServices().updateStripeClientId({
      pk,
      sk,
      stripeId: stripe_customer.id,
    });
    return user;
  }
  public async onSelectPlan(req: any, res: any) {
    const { id } = req.params;
    //get user from req.user
    const customerId = 'cus_MjG1DZdnDypH5E';
    const customer = await new StripeServices().createCustomer('ans4asif@gmail.com', 'John Doe');
    try {
      const data = {
        customerId: customer.id,
        planId: id,
        billing_cycle_anchor: moment().add(7, 'days').unix(),
      };
      //subscribe to plan
      const subscription = await new StripeServices().subscribeToPlan(data);
      return res.status(200).json({
        success: true,
        subscription,
        message: 'Successfully subscribe to Plan',
      });
      //create pro-ratd invoice
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: 'Something went wrong, please try after sometime.', error: error });
    }
  }
}
