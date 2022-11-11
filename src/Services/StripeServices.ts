import moment from 'moment';

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET);
import { dynamoDB, TableName } from '../Utils/dynamoDB';
import { Plan, PricingPlan, FreeTrial } from 'Interfaces/stripeInterfaces';
import { SignupServices } from './SignupServices';
export default class StripeServices {
  public async getPricingPlans(data: PricingPlan) {
    let { active = true, plan_type, name, getAll = true } = data;
    if (typeof active == 'string') {
      if (active == 'true') {
        active = true;
      } else {
        active = false;
      }
    }
    let query = `active:"true"`;
    if (!getAll) {
      if (!active) {
        query = `active:"false"`;
      }
      if (plan_type && !active) {
        query = `active:"false" AND metadata["plan_type"]:"${plan_type}"`;
      }
      if (plan_type && active) {
        query = `active:"true" AND metadata["plan_type"]:"${plan_type}"`;
      }
      if (name && !active) {
        query = `active:"false" AND metadata["name"]:"${name}"`;
      }
      if (name && active) {
        query = `active:"true" AND metadata["name"]:"${name}"`;
      }
      if (plan_type && name && !active) {
        query = `active:"false" AND metadata["plan_type"]:"${plan_type}" AND metadata["name"]:"${name}"`;
      }
      if (plan_type && name && active) {
        query = `active:"true" AND metadata["plan_type"]:"${plan_type}" AND metadata["name"]:"${name}"`;
      }
    }
    let products = await stripe.products.search({
      query: query,
    });
    let prices = await stripe.prices.list({
      limit: 50,
    });
    prices = prices?.data?.map((itm: any) => ({ ...itm, converted_amount: itm?.unit_amount / 100 }));
    products = products?.data?.map((prod: any) => {
      const filtered_price = prices?.filter((itm: any) => itm?.id === prod?.default_price)[0];
      return { ...prod, price: filtered_price };
    });
    return products;
  }

  public async createCustomer(email: string, name: string) {
    const customer = await stripe.customers.create({
      email,
      name,
    });
    return customer;
  }

  public async getCustomer(id: string) {
    const customer = await stripe.customers.retrieve(id);
    return customer;
  }

  public async subscribeToPlan(payload: Plan) {
    const {
      customerId,
      planId,
      isFreeTrial,
      billing_cycle_anchor,
      collection_method,
      proration_behavior,
      due_date,
      days_until_due,
    } = payload;
    //subscribe customer to a plan
    let data: any = {
      customer: customerId,
      items: [
        {
          price: planId,
        },
      ],
    };
    if (isFreeTrial) {
      //get 7 days after timestamp
      const seven_days = moment().add(7, 'days').endOf('day').unix();
      data.trial_end = seven_days;
      data.cancel_at = seven_days;
    } else {
      data.billing_cycle_anchor = billing_cycle_anchor;
      data.collection_method = collection_method;
      data.days_until_due = days_until_due;
      data.proration_behavior = proration_behavior;
      // data.due_date = due_date;
    }
    console.log({ data });
    const subscription = await stripe.subscriptions.create(data);
    return subscription;
    //TODO WITHOUT FREE TRIAL
  }

  public async getSubscription() {
    // sub_1Lxbf8Ek2K7pH9UX7g5QAMlq
    const subscription = await stripe.subscriptions.retrieve('sub_1Lxbf8Ek2K7pH9UX7g5QAMlq');
    return subscription;
  }

  public async createSubscriptionSchedule(data: any) {
    const subscriptionSchedule = await stripe.subscriptionSchedules.create(data);
    return subscriptionSchedule;
  }
  public async updateStripeClientId(data: any) {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          pk: data.pk,
          sk: data.sk,
        },
        UpdateExpression: `set stripeId= :stripeId`,
        ExpressionAttributeValues: {
          ':stripeId': data.stripeId,
        },
        ReturnValues: 'ALL_NEW',
      })
      .promise();
  }

  public async constructEvent(data: any) {
    const { payload, signature, secret } = data;
    const ev = stripe.webhooks.constructEvent(payload, signature, secret);
    return ev;
  }

  public async createInvoice(data: any) {
    console.log({ invoice_data: data });
    const invoice = await stripe.invoices.create(data);
    return invoice;
  }

  public async updateInvoiceItem(id: string, data: any) {
    const invoiceItem = await stripe.invoiceItems.update(id, data);
    return invoiceItem;
  }
  public async createInvoiceItem(data: any) {
    console.log({ invoiceitem_data: data });
    const invoice = await stripe.invoiceItems.create(data);
    return invoice;
  }
  public async updateInvoice(id: string, data: any) {
    console.log({ invoiceitem_data: data });
    const invoice = await stripe.invoices.update(id, data);
    return invoice;
  }
  public async getPlan(id: string) {
    const plan = await stripe.plans.retrieve(id);
    return plan;
  }

  public async getProduct(id: string) {
    const product = await stripe.products.retrieve(id);
    return product;
  }

  public async getInvoices(stripeId:string){
    // const invoices=await stripe.invoice()
  }
}
