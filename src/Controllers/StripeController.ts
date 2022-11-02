import { FreeTrial } from 'Interfaces/stripeInterfaces';
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
    const secret = 'whsec_5c8ab2ae2abfa7702530c569e177ebc2f569c7fa99442085bb87996b468398aa';
    const payload = req.body;
    const signature = req.headers['stripe-signature'];
    try {
      const event = await new StripeServices().constructEvent({ payload, secret, signature });
      console.log({ event_type: event?.type });
      console.log({ event_object: event?.data?.object });
    } catch (error) {
      console.log({ error });
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
}
