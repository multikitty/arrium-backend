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
      const cus = await new UserServices().updateProfile({ sk, pk, fieldName: 'stripeId', fieldValue: stripeCust?.id });
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
          const user = (await new UserServices().getUserData({ sk: 'driver#900034', pk: 'UK-900034' }))?.Item;
          console.log({ user, t: data?.trial_end, s: data?.ended_at });
          // should be true trial_end
          if (stripeId && !data?.trial_end && user && data?.ended_at) {
            const subscriptions = (
              await new StripeServices().getCustomerSubscriptions({
                customer: user.stripeId,
                status: 'all',
              })
            )?.data;
            console.log('&****', { subscriptions });
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
        stripeId: stripe_customer.id,
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
    if (!user?.stripeId) {
      return res.status(404).json({ success: false, message: 'User stripeId not found' });
    }
    try {
      const plan = await new StripeServices().getPlan(id);
      if (!plan) {
        return res.status(404).json({ success: false, message: 'Plan not found' });
      }
      const subscriptions = (
        await new StripeServices().getCustomerSubscriptions({
          customer: user.stripeId,
          status: 'all',
        })
      )?.data;
      const free_trial = subscriptions?.filter((itm: any) => itm?.metadata?.is_free_trial)[0];
      const free_trial_end_date = free_trial?.canceled_at;
      const end_month = moment(
        new Date(moment.unix(free_trial?.canceled_at).endOf('month').endOf('day').format('YYYY-MM-DD hh:mm:ss'))
      );
      console.log({ end_month: moment.unix(free_trial?.canceled_at).endOf('month') });
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
      const end2=moment.unix(free_trial?.trial_end).endOf('month').startOf('month').startOf('day').add(1,'d').startOf('day')
      const end3=moment(end2).add(1, 'months').endOf('day').format('YYYY-MM-DD hh:mm:ss')
      const end99=new Date(end3)
      const end4=moment(new Date(end99)).startOf('month')
      const end5=moment(end3).startOf('month').startOf('day').add(1,'d').startOf('day')
      
      console.log({
        dat: free_trial.trial_end,
        end2,end3,end4,
        end99,
        end5,
        trial_end: moment.unix(free_trial?.trial_end).toDate(),
    
      });
      const scheduleData = {
        customer: user.stripeId,
        start_date: moment(
          new Date(
            moment
              .unix(free_trial?.canceled_at)
              .endOf('month')
              .add(1, 'month')
              .startOf('month')
              .format('YYYY-MM-DD hh:mm:ss')
          )
        )
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
        due_date: moment(
          new Date(
            moment
              .unix(free_trial?.canceled_at)
              .endOf('month')
              .add(1, 'month')
              .startOf('month')
              .format('YYYY-MM-DD hh:mm:ss')
          )
        )
          .endOf('day')
          .unix(),
      };
      // let plan = free_trial?.items?.data[0]?.plan;
      console.log({ plan });
      plan.amount = ((plan.amount / 30) * days_difference)?.toFixed(2);
      console.log({ amount: plan.amount, days_difference });
      const product = await new StripeServices().getProduct(plan.product);
      console.log({ product });
      const invoiceItemData = {
        customer: user.stripeId,
        unit_amount_decimal: plan.amount,
        currency: plan.currency,
        description: `${product.name[0].toUpperCase() + product.name.slice(1)}: ${product?.name} (${moment
          .unix(free_trial_end_date)
          .format('MMM DD,YYYY')} - ${moment(
          moment(
            new Date(
              moment
                .unix(free_trial?.canceled_at)
                .add(1, 'month')
                .endOf('month')
                .startOf('month')
                .format('YYYY-MM-DD hh:mm:ss')
            )
          )
            .endOf('day')
            .unix()
        ).format('MMM DD,YYYY')})`,
        period: {
          start: free_trial_end_date, //free trial end-date
          end: moment(
            new Date(
              moment
                .unix(free_trial?.canceled_at)
                .add(1, 'month')
                .endOf('month')
                .startOf('month')
                .format('YYYY-MM-DD hh:mm:ss')
            )
          )
            .endOf('day')
            .unix(),
        },
      };
      // const invoice_item = await new StripeServices().createInvoiceItem(invoiceItemData);
      // const invoice = await new StripeServices().createInvoice(invoiceData);
      // if (invoice?.id) {
      //   await new StripeServices().finalizeInvoice(invoice?.id);
      // }
      // const scheduleSubsc = await new StripeServices().createSubscriptionSchedule(scheduleData);
      // const upcoming_invoice = await new StripeServices().getCustomerUpcomingInvoices(user.stripeId);
      return res.status(200).json({
        success: true,
        free_trial,
        // scheduleSubsc,
        // invoice,
        // invoice_item,
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
    const { page = 1 } = req.query;
    try {
      const user = (await new UserServices().getUserData({ sk, pk }))?.Item;
      if (!user?.stripeId) {
        return res
          .status(404)
          .json({ success: false, message: 'Something went wrong', error: 'User Stripe Id not found' });
      }
      const data = {
        customer: user?.stripeId,
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
      if (!user?.stripeId) {
        return res
          .status(404)
          .json({ success: false, message: 'Something went wrong', error: 'User Stripe Id not found' });
      }
      const data = {
        customer: user?.stripeId,
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
}
