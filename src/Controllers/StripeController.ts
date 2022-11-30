import { FreeTrial } from 'Interfaces/stripeInterfaces';
import moment from 'moment';
import UserServices from '../Services/UserServices';
import { SignupServices } from '../Services/SignupServices';
import StripeServices from '../Services/StripeServices';

export default class StripeController {
  async createStripeCustomer(req: any, res: any) {
    const { sk, pk } = req.body;
    try {
      const exis_user = (await new UserServices().getUserData({ sk, pk }))?.Item;
      const stripeCust = await new StripeServices().createCustomer(
        'zeus@arrium.com',
        'Zeus Thunder',
        exis_user?.customerID
      );
      const cus = await new UserServices().updateProfile({ sk, pk, fieldName: 'stripeID', fieldValue: stripeCust?.id });
      return res.status(200).json({ exis_user, stripeCust, cus });
    } catch (err) {
      return res.status(500).json({ error: err, message: 'Something went wrong' });
    }
  }
  async getPricingPlans(req: any, res: any) {
    const { getAll = false, active = true, name = '', plan_type, country } = req.query;
    try {
      const data = await new StripeServices().getPricingPlans({ getAll, active, name, plan_type, country });
      return res.status(200).json({ data, error: false, message: 'Successfully fetched pricing plans' });
    } catch (err: any) {
      return res.status(500).json({ error: true, message: err?.message });
    }
  }

  async createCustomerStripe(email: string, name: string, customerId: number) {
    try {
      const res = await new StripeServices().createCustomer(email, name, customerId);
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
      const data = event?.data?.object;
      const stripeId = data?.customer;
      console.log({ event_type, data });

      switch (event_type) {
        case 'customer.subscription.deleted':
          /*check if current ended subscription is of free trial
            if free trial and not subscribed to any other subscription then change status inactive
          */
          console.log('**user');
          //TODO get user by stripeId
          const user = (await new UserServices().getUserData({ sk: 'driver#900037', pk: 'UK-900037' }))?.Item;
          console.log({ user, t: data?.trial_end, s: data?.ended_at });
          // should be true trial_end
          if (stripeId && !data?.trial_end && user && data?.ended_at) {
            let scheduled_subscriptions = (await new StripeServices().getSubscriptionSchedules(user.stripeID))?.data;
            if (scheduled_subscriptions?.length) {
              scheduled_subscriptions = scheduled_subscriptions.filter((itm: any) => itm?.status !== 'canceled');
              if (!scheduled_subscriptions?.length) {
                //make user status inactive
                const update_user = {
                  sk: user.sk,
                  pk: user.pk,
                  fieldName: 'accountStatus',
                  fieldValue: 'inActive',
                };
                await new UserServices().updateProfile(update_user);
              }
            }
            console.log('&****', { scheduled_subscriptions });
            //set user status inactive if not selected a plan

            //show plan page
          }
          //  const trial_end=data?.trial_end
          const trial_end = data?.start_date;
          // console.log({ t: moment.unix(trial_end) });

          if (moment.unix(trial_end) <= moment()) {
            //show plan page
            // const user=await new UserServices().getUserData()
          }
          break;
        case 'invoice.created':
          console.log({ lines: data?.lines?.data, price_obj: data?.lines?.data[0]?.price });
          if (!data?.paid) {
            const plan_type = data?.lines?.data[0]?.price?.metadata['plan type'];
            const productId = data?.lines?.data[0]?.price?.product;
            const product = await new StripeServices().getProduct(productId);
            const invoice_id = data.id;
            const invoice_data = {
              description: `${plan_type[0].toUpperCase() + plan_type.slice(1)}: ${product?.name} (${moment
                .unix(data?.lines?.data[0]?.period?.start)
                .format('MMM DD,YYYY')} - ${moment.unix(data?.lines?.data[0]?.period?.end).format('MMM DD,YYYY')})`,
            };

            console.log({ invoice_data });
            const up_invoice = await new StripeServices().updateInvoice(data?.id, invoice_data);
            if (data?.subscription) {
              const sub_id = data.subscription;
              const subscription = await new StripeServices().getSubscription(sub_id);
              //changing status of free trial invoice
              if (subscription?.trial_end) {
                await new StripeServices().payInvoice(invoice_id);
              }
            }
            console.log({ up_invoice });
          }
          break;
        default:
        // throw Error(`Unhandled Event ${event?.type}`);
      }
      return res.status(200);
    } catch (error: any) {
      console.log({ error });
      res.end();
    }
  }

  public async subscribeToFreeTrial(data: FreeTrial) {
    const { pk, sk } = data;
    try {
      const {
        Item: { firstname, lastname, email, customerID },
      }: any = await new UserServices().getUserData({
        pk,
        sk,
      });
      console.log({ firstname, lastname, email, customerID });
      const stripe_customer = await new StripeServices().createCustomer(email, `${firstname} ${lastname}`, customerID);
      //get all areas plan id from stripe
      let plans: any = await new StripeServices().getPricingPlans({
        active: true,
        getAll: false,
        plan_type: 'basic',
        name: 'All Areas',
        country: 'UK',
      });
      if (!plans?.length) {
        throw Error('Plan not found');
      }
      console.log({ plan: plans[0] });
      plans = plans[0]?.price?.id;
      ///
      const subs_schedule_data = {
        customer: stripe_customer.id,
        metadata: {
          is_free_trial: true,
        },
        start_date: moment().add(10, 's').unix(),
        end_behavior: 'cancel',
        phases: [
          {
            trial: true,
            end_date: moment().add(7, 'd').endOf('day').unix(),
            items: [
              {
                price: plans,
                quantity: 1,
              },
            ],
          },
        ],
      };
      ///
      const subscription = await new StripeServices().subscribeToPlan({
        customerId: stripe_customer.id,
        planId: plans,
        isFreeTrial: true,
        collection_method: 'send_invoice',
      });
      // const invoice = await new StripeServices().updateInvoice(subscription.latest_invoice, {
      //   description: 'invoice -desc',
      // });
      console.log({ subscription, sub_itm: subscription?.items?.data[0] });
      console.log({ subs_schedule_data });
      // const schedule_subscription = await new StripeServices().createSubscriptionSchedule(subs_schedule_data);
      const user = await new StripeServices().updateStripeClientId({
        pk,
        sk,
        stripeID: stripe_customer.id,
      });
      return user;
    } catch (err) {
      console.log({ err });
    }
  }
  public async onSelectPlan(req: any, res: any) {
    const { id } = req.params;
    const { pk, sk } = req.body;
    //get user
    const user = (await new UserServices().getUserData({ pk, sk }))?.Item;
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (!user?.stripeID) {
      return res.status(404).json({ success: false, message: 'User stripeID not found' });
    }
    try {
      const plan = await new StripeServices().getPlan(id);
      if (!plan) {
        return res.status(404).json({ success: false, message: 'Plan not found' });
      }
      const subscriptions = (
        await new StripeServices().getCustomerSubscriptions({
          customer: user.stripeID,
          status: 'all',
        })
      )?.data;
      const free_trial = subscriptions?.filter((itm: any) => itm?.metadata?.is_free_trial)[0];
      const free_trial_end_date = moment.unix(free_trial?.trial_end).format('YYYY-MM-DD hh:mm:ss');
      const month_end = moment(free_trial_end_date).endOf('month').endOf('day');
      const start_of_next_month = moment(month_end)
        .add(1, 'months')
        .startOf('month')
        .startOf('day')
        .format('YYYY-MM-DD hh:mm:ss');
      const days_difference = Math.abs(month_end.diff(free_trial_end_date, 'days'));
      const scheduleData = {
        customer: user.stripeID,
        start_date: moment(new Date(start_of_next_month)).unix(), //start date of subsc schedule
        end_behavior: 'release',
        phases: [
          {
            items: [
              {
                price: id,
              },
            ],
            proration_behavior: 'create_prorations',
            collection_method: 'send_invoice',
            invoice_settings: { days_until_due: 0 },
          },
        ],
      };

      // //invoice
      const invoiceData = {
        customer: user.stripeID,
        collection_method: 'send_invoice',
        due_date: moment(start_of_next_month).endOf('day').unix(),
      };
      plan.amount = ((plan.amount / 30) * days_difference)?.toFixed(2);
      const product = await new StripeServices().getProduct(plan.product);
      const invoiceItemData = {
        customer: user.stripeID,
        unit_amount_decimal: plan.amount,
        currency: plan.currency,
        description: `${plan?.metadata['plan type'][0].toUpperCase() + plan?.metadata['plan type'].slice(1)}: ${
          product?.name
        } (${moment(free_trial_end_date).format('MMM DD,YYYY')} - ${moment(
          new Date(month_end.format('YYYY-MM-DD hh:mm:ss'))
        ).format('MMM DD,YYYY')})`,
        period: {
          start: moment(free_trial_end_date).unix(), //free trial end-date
          end: month_end.endOf('day').unix(),
        },
      };
      await new StripeServices().createInvoiceItem(invoiceItemData);
      const invoice = await new StripeServices().createInvoice(invoiceData);
      let finalized_invoice = null;
      if (invoice?.id) {
        finalized_invoice = await new StripeServices().finalizeInvoice(invoice?.id);
      }
      await new StripeServices().createSubscriptionSchedule(scheduleData);
      return res.status(200).json({
        success: true,
        message: 'Successfully subscribe to plan',
        invoice_url: finalized_invoice?.hosted_invoice_url,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: 'Something went wrong, please try after sometime.', error: error });
    }
  }

  public async getInvoices(req: any, res: any) {
    const { sk, pk } = req.body;
    const { page = 1 } = req.query;
    try {
      const user = (await new UserServices().getUserData({ sk, pk }))?.Item;
      if (!user?.stripeID) {
        return res
          .status(404)
          .json({ success: false, message: 'Something went wrong', error: 'User Stripe Id not found' });
      }
      const data = {
        customer: user?.stripeID,
        limit: 10,
        page: Number(page),
      };
      if (page > 1) {
        data.page = Number(page);
      }
      const invoices = await new StripeServices().getInvoices(data);

      const invoices_data = invoices?.data?.map((invoice: any) => {
        const data = {
          id: invoice?.id,
          invoice_no: invoice?.number,
          stripe_id: invoice?.customer,
          description: invoice?.lines?.data[0]?.description,
          amount_due: invoice?.amount_due ? invoice?.amount_due / 100 : 0,
          due_date: invoice?.due_date ? moment.unix(invoice?.due_date).format('MMM DD,YYYY') : null,
          paid_at: invoice?.status_transitions?.paid_at
            ? moment.unix(invoice?.status_transitions?.paid_at).format('MMM DD,YYYY')
            : null,
          invoice_url: invoice?.hosted_invoice_url,
          paid_status: new StripeServices().getPaidStatus({ paid: invoice?.paid, due_date: invoice?.due_date }),
          period_start: invoice?.lines?.data[0]?.period?.start
            ? moment.unix(invoice?.lines?.data[0]?.period?.start).format('MMM DD,YYYY')
            : null,
          period_end: invoice?.lines?.data[0]?.period?.end
            ? moment.unix(invoice?.lines?.data[0]?.period?.end).format('MMM DD,YYYY')
            : null,
        };
        return data;
      });
      const response = { data: invoices_data, has_more: invoices?.has_more, invoices };
      return res?.status(200).json({ success: true, invoices: response, message: 'Successfully fetched invoices' });
    } catch (error) {
      return res?.status(500).json({ success: false, error, message: 'Something went wrong' });
    }
  }
  public async getInvoicesAdmin(req: any, res: any) {
    const { sk, pk } = req.query;
    const { page = 1 } = req.query;
    try {
      let user: any = (await new UserServices().getUserData({ sk, pk }))?.Item;
      if (!user?.stripeID) {
        return res
          .status(404)
          .json({ success: false, message: 'Something went wrong', error: 'User Stripe Id not found' });
      }
      const data = {
        customer: user?.stripeID,
        limit: 10,
        page: Number(page),
      };
      if (page > 1) {
        data.page = Number(page);
      }
      const invoices = await new StripeServices().getInvoices(data);
      const invoices_data = invoices?.data?.map((invoice: any) => {
        const data = {
          id: invoice?.id,
          invoice_no: invoice?.number,
          stripe_id: invoice?.customer,
          description: invoice?.lines?.data[0]?.description,
          amount_due: invoice?.amount_due ? invoice?.amount_due / 100 : 0,
          due_date: invoice?.due_date ? moment.unix(invoice?.due_date).format('MMM DD,YYYY') : null,
          paid_at: invoice?.status_transitions?.paid_at
            ? moment.unix(invoice?.status_transitions?.paid_at).format('MMM DD,YYYY')
            : null,
          invoice_url: invoice?.hosted_invoice_url,
          paid_status: new StripeServices().getPaidStatus({ paid: invoice?.paid, due_date: invoice?.due_date }),
          period_start: invoice?.lines?.data[0]?.period?.start
            ? moment.unix(invoice?.lines?.data[0]?.period?.start).format('MMM DD,YYYY')
            : null,
          period_end: invoice?.lines?.data[0]?.period?.end
            ? moment.unix(invoice?.lines?.data[0]?.period?.end).format('MMM DD,YYYY')
            : null,
        };
        return data;
      });
      const response = { invoices_data, has_more: invoices?.has_more, invoices };
      return res?.status(200).json({ success: true, invoices: response, message: 'Successfully fetched invoices' });
    } catch (error) {
      return res?.status(500).json({ success: false, error, message: 'Something went wrong' });
    }
  }
  /**
   * Disable customers whose invoice is not paid
   * after 5 days
   * @returns
   */
  public disableCustomersFiveDays = () => {
    try {
      //get unpaid invoices
    } catch (err) {
      return err;
    }
  };
}
