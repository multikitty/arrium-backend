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
      // console.log({ event_type: event?.type });
      // console.log({ event_object: event?.data?.object });
      switch (event_type) {
        case 'customer.subscription.deleted':
          /*check if current ended subscription is of free trial
            if free trial and not subscribed to any other subscription then change status inactive

          */

          // console.log({ t: event?.object });
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
    // const customer = { id: 'cus_MklJSIHYrQRmxK' };
    const customer = await new StripeServices().createCustomer('cin@gmail.com', 'cin Doe');
    try {
      var a = moment().add(7, 'days');
      var b = moment().endOf('month');
      // console.log({ a, b });
      const days_due = Math.abs(a.diff(b, 'days')) + 7;
      const data = {
        customerId: customer.id,
        planId: id,
        billing_cycle_anchor: moment(moment().add(1, 'M').startOf('month').format('YYYY-MM-DD hh:mm:ss')).unix(),
        collection_method: 'send_invoice',
        // days_until_due: days_due,
        // days_until_due: 23,
        due_date: moment(moment().add(1, 'M').startOf('month').format('YYYY-MM-DD hh:mm:ss')).unix(),
        proration_behavior: 'create_prorations',
      };
      const scheduleData = {
        customer: customer.id,
        start_date: moment().subtract(2, 'days').unix(),
        end_behavior: 'release',
        phases: [
          {
            items: [
              {
                price: id,
              },
            ],
            // iterations: 12,
          },
        ],
      };
      //subscribe to plan
      const subscription = await new StripeServices().subscribeToPlan(data);
      console.log({ subscriptionId: subscription?.id, subscript_ivoice_id: subscription.latest_invoice });
      const invoice_id = subscription.latest_invoice;
      const up_data = {
        due_date: moment(moment().add(1, 'M').startOf('month').format('YYYY-MM-DD hh:mm:ss')).unix(),
      };
      console.log({ date: moment(moment().add(1, 'M').startOf('month').format('YYYY-MM-DD hh:mm:ss')) });
      // const updateInvoice = await new StripeServices().updateInvoice(invoice_id, up_data);
      //invoice
      const invoiceData = {
        customer: customer.id,
        collection_method: 'send_invoice',
        due_date: moment().add(1, 'month').startOf('month').startOf('day').unix(),
        // subscription: subscription.id,
        // days_until_due: days_due,
        // days_until_due: 23,
      };

      const invoiceItemData = {
        customer: customer.id,
        // invoice: invoice.id,
        price: id,
        // due_date: moment().endOf('month').unix(),
        period: {
          start: moment().add(7, 'days').unix(),
          end: moment().endOf('month').unix(),
        },
      };
      // const invoice_item = await new StripeServices().createInvoiceItem(invoiceItemData);
      // const invoice = await new StripeServices().createInvoice(invoiceData);

      // console.log({ invoiceid: invoice.id });
      // const scheduleSubsc = await new StripeServices().createSubscriptionSchedule(scheduleData);
      return res.status(200).json({
        success: true,
        subscription,
        // scheduleSubsc,
        // invoice,
        // invoice_item,
        // updateInvoice,
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
