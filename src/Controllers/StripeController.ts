import { FreeTrial } from 'Interfaces/stripeInterfaces';
import moment from 'moment';
import UserServices from '../Services/UserServices';
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
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    const payload = req.rawBody;
    const signature = req.headers['stripe-signature'];
    try {
      const event = await new StripeServices().constructEvent({ payload, secret, signature });
      const event_type = event?.type;
      const data=event?.data?.object
      const stripeId=data?.customer;
      console.log({event_type,data})

      switch (event_type) {
        case 'customer.subscription.deleted':
          /*check if current ended subscription is of free trial
            if free trial and not subscribed to any other subscription then change status inactive

          */
        //  const trial_end=data?.trial_end
         const trial_end=data?.start_date
         console.log({t:moment.unix(trial_end)})

         if(moment.unix(trial_end) <= moment()){
          //show plan page
          // const user=await new UserServices().getUserData()
         }
          break;
        default:
          throw Error(`Unhandled Event ${event?.type}`);
      }
      return res.status(200);
    } catch (error: any) {
      console.log({error})
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
    const { pk, sk } = req.body;
    //get user
    const user = (await new UserServices().getUserData({ pk, sk }))?.Item;
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (!user?.stripeId) {
      return res.status(400).json({ success: false, message: 'User stripeId not found' });
    }
    try {
      const subscriptions = (
        await new StripeServices().getCustomerSubscriptions({
          customer: user.stripeId,
          status: 'all',
        })
      )?.data;
      const free_trial = subscriptions?.filter((itm: any) => itm?.metadata?.is_free_trial)[0];
      const free_trial_end_date = free_trial?.canceled_at;
      const end_month = moment(new Date(moment().endOf('month').endOf('day').format('YYYY-MM-DD hh:mm:ss')));
      const days_difference = Math.abs(end_month.diff(moment.unix(free_trial_end_date), 'days'));
      // const days_due = Math.abs(a.diff(b, 'days')) + 7;
      // const data = {
      //   customerId: user.stripeId,
      //   planId: id,
      //   billing_cycle_anchor: moment(moment().add(1, 'M').startOf('month').format('YYYY-MM-DD hh:mm:ss')).unix(),
      //   collection_method: 'send_invoice',
      //   due_date: moment(moment().add(1, 'M').startOf('month').format('YYYY-MM-DD hh:mm:ss')).unix(),
      //   proration_behavior: 'create_prorations',
      // };
      const scheduleData = {
        customer: user.stripeId,
        start_date: moment(new Date(moment().add(1, 'month').startOf('month').format('YYYY-MM-DD hh:mm:ss')))
          .endOf('day')
          .unix(), //start date of subsc schedule
        // start_date:free_trial_end_date,
        end_behavior: 'release',
        phases: [
          // {
          //   items: [
          //     {
          //       price: id,
          //     },
          //   ],
          //   proration_behavior: 'create_prorations',
          //   // start_date: moment().add(2, 'days').unix(),
          //   end_date: moment().endOf('month').unix(),
          //   invoice_settings: { days_until_due: 22 },

          //   collection_method: 'send_invoice',
          // },
          {
            items: [
              {
                price: id,
              },
            ],
            proration_behavior: 'create_prorations',
            collection_method: 'send_invoice',
            invoice_settings: { days_until_due: 0 },
            // start_date:moment().add(2, 'days').unix(),
            // end_date:moment().endOf('month').unix(),
          },
        ],
      };

      // //invoice
      const invoiceData = {
        customer: user.stripeId,
        collection_method: 'send_invoice',
        due_date: moment(new Date(moment().add(1, 'month').startOf('month').format('YYYY-MM-DD hh:mm:ss')))
          .endOf('day')
          .unix(),
      };
      let plan = free_trial?.items?.data[0]?.plan;
      plan.amount = (plan.amount / 30) * days_difference;
      const product = await new StripeServices().getProduct(plan.product);
      const invoiceItemData = {
        customer: user.stripeId,
        unit_amount_decimal: plan.amount,
        currency: plan.currency,
        description: product.name,
        period: {
          start: free_trial_end_date, //free trial end-date
          end: moment(new Date(moment().add(1, 'month').startOf('month').format('YYYY-MM-DD hh:mm:ss')))
            .endOf('day')
            .unix(),
        },
      };
      const invoice_item = await new StripeServices().createInvoiceItem(invoiceItemData);
      const invoice = await new StripeServices().createInvoice(invoiceData);
      if (invoice?.id) {
        await new StripeServices().finalizeInvoice(invoice?.id);
      }
      const scheduleSubsc = await new StripeServices().createSubscriptionSchedule(scheduleData);
      // const upcoming_invoice = await new StripeServices().getCustomerUpcomingInvoices(user.stripeId);
      return res.status(200).json({
        success: true,
        scheduleSubsc,
        invoice,
        invoice_item,
        subscriptions,
        invoiceData,
        invoiceItemData,

        message: 'Successfully subscribe to Plan',
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: 'Something went wrong, please try after sometime.', error: error });
    }
  }

  public async getInvoices(req: any, res: any) {
    const { sk, pk } = req.body;
    try {
      const user = (await new UserServices().getUserData({ sk, pk }))?.Item;
      // const user = { stripeId: 'cus_MmGRnFLxM7rmJl' };
      if (!user?.stripeId) {
        return res
          .status(404)
          .json({ success: false, message: 'Something went wrong', error: 'User Stripe Id not found' });
      }
      const data = {
        customer: user?.stripeId,
        limit: 10,
      };
      const invoices = await new StripeServices().getInvoices(data);
      return res?.status(200).json({ success: true, invoices, message: 'Successfully fetched invoices' });
    } catch (error) {
      return res?.status(500).json({ success: false, error, message: 'Something went wrong' });
    }
  }
}
