import moment from 'moment';

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET);
import { dynamoDB, TableName } from '../Utils/dynamoDB';
import { Plan, PricingPlan, FreeTrial, RetrieveInvoices } from 'Interfaces/stripeInterfaces';
export default class StripeServices {
  private getCountry(country: string) {
    switch (country) {
      case 'United Kingdom':
        return 'gbp';
      case 'United Kingdom':
        return 'gbp';
      default:
        return 'gbp';
    }
  }
  public getPaidStatus(data: any) {
    const { due_date, paid } = data;
    if (paid) {
      return 'paid';
    } else if (!paid && moment().unix() > due_date) {
      return 'due';
    }
    return 'overdue';
  }
  public async getPricingPlans(data: PricingPlan) {
    let { active = true, plan_type = 'basic', name, getAll = true, country } = data;
    const currency = this.getCountry(country);
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

      if (name && !active) {
        query = `active:"false" AND metadata["name"]:"${name}"`;
      }
      if (name && active) {
        query = `active:"true" AND metadata["name"]:"${name}"`;
      }
    }
    let products = await stripe.products.search({
      query: query,
      limit: 100,
    });
    let prices = await stripe.prices.search({
      query: `active:\'true\' AND metadata[\'plan type\']:"${plan_type}" AND currency:"${currency}"`,
    });

    prices = prices?.data?.map((itm: any) => ({ ...itm, converted_amount: itm?.unit_amount / 100 }));
    products = products?.data?.map((prod: any) => {
      const filtered_price = prices?.filter((itm: any) => itm?.product === prod?.id)[0];
      const structured_data = {
        prod_id: prod.id,
        prod_name: prod?.name,
        active: prod?.active,
        prod_description: prod?.description,
        prod_meta: prod?.metadata,
        price: {
          id: filtered_price?.id,
          currency: filtered_price?.currency,
          meta_data: filtered_price?.metadata ?? { 'plan type': null },
          amount: filtered_price?.converted_amount,
        },
      };
      return structured_data;
    });
    products = products?.filter((prod: any) => prod?.price?.meta_data['plan type'] === plan_type);
    return products;
  }

  public async createCustomer(email: string, name: string, customerId: number,pk:string,sk:string) {
    console.log({ invoice_prefix: `${Math.random() * 100 + 1}${customerId}` });
    const customer = await stripe.customers.create({
      email,
      name,
      invoice_prefix: `${Math.floor(Math.random() * 100 + 1)}${customerId}`,
      metadata:{
        pk,
        sk
      }
      // invoice_prefix: customerId,
    });
    return customer;
  }
  public async updateCustomer({email, name,stripeId}:{stripeId:string,email?: string, name?: string}) {
    const data:any={}
    if(email){
      data.email=email
    }
    if(name){
      data.name=name
    }
    const customer = await stripe.customers.update(
      stripeId,
      data
    );
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
      data.collection_method = collection_method;
      data.days_until_due = 0;
      data.metadata = {
        is_free_trial: true,
      };
    } else {
      data.billing_cycle_anchor = billing_cycle_anchor;
      data.collection_method = collection_method;
      data.days_until_due = days_until_due;
      data.proration_behavior = proration_behavior;
      // data.due_date = due_date;
    }
    const subscription = await stripe.subscriptions.create(data);
    return subscription;
    //TODO WITHOUT FREE TRIAL
  }

  public async getSubscription(id: string) {
    const subscription = await stripe.subscriptions.retrieve(id);
    return subscription;
  }

  public async createSubscriptionSchedule(data: any) {
    const subscriptionSchedule = await stripe.subscriptionSchedules.create(data);
    return subscriptionSchedule;
  }

  public async updateSubscription(subscriptionId: string, data: any) {
    const subscription = await stripe.subscriptions.update(subscriptionId, data);
    return subscription;
  }
  public async getSubscriptionSchedules(stripeId: string) {
    const subscriptionSchedules = await stripe.subscriptionSchedules.list({
      customer: stripeId,
    });
    return subscriptionSchedules;
  }
  public async updateStripeClientId(data: any) {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          pk: data.pk,
          sk: data.sk,
        },
        UpdateExpression: `set stripeID= :stripeID`,
        ExpressionAttributeValues: {
          ':stripeID': data.stripeID,
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
    const invoice = await stripe.invoices.create(data);
    return invoice;
  }

  public async updateInvoiceItem(id: string, data: any) {
    const invoiceItem = await stripe.invoiceItems.update(id, data);
    return invoiceItem;
  }
  public async createInvoiceItem(data: any) {
    const invoice = await stripe.invoiceItems.create(data);
    return invoice;
  }
  public async updateInvoice(id: string, data: any) {
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

  public async getInvoices(data: RetrieveInvoices) {
    let query = { customer: data.customer, limit: data?.limit ?? 10 };
    if (data?.getAll) {
      data.limit = 99999999;
    }
    const invoices = await stripe.invoices.list(query);
    return invoices;
  }

  public async getStripeCustomer(id: string) {
    const customer = await stripe.customers.retrieve(id);
    return customer;
  }
  public async getCustomerSubscriptions(data: any) {
    const { customer, status } = data;

    let payload: any = {
      customer,
      status,
    };
    const subscriptions = await stripe.subscriptions.list(payload);
    return subscriptions;
  }

  public async getCustomerUpcomingInvoices(id: string) {
    const invoice = await stripe.invoices.retrieveUpcoming({
      customer: id,
    });
    return invoice;
  }

  public async finalizeInvoice(id: string) {
    const invoice = await stripe.invoices.finalizeInvoice(id, { auto_advance: false });
    return invoice;
  }

  public async payInvoice(id: string) {
    const invoice = await stripe.invoices.pay(id);
    return invoice;
  }

  public async getUserByStripeId(id: string) {
    return dynamoDB
      .get({
        TableName: TableName,
        Key: {
          stripeID: id,
        },
      })
      .promise();
  }
}
