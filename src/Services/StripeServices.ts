import moment from 'moment';

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET);
import { dynamoDB, TableName } from '../Utils/dynamoDB';

export class StripeServices {
  public async getPricingPlans(query: string) {
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

  public async subscribeToPlan(customerId: string, planId: string, isFreeTrial = false) {
    //subscribe customer to a plan
    let data: any = {
      customer: customerId,
      items: [
        {
          price: 'price_1KomCiEk2K7pH9UXw1t4Xmmg',
        },
      ],
    };
    if (isFreeTrial) {
      //get 7 days after timestamp
      const seven_days = moment().add(7, 'days').unix();
      data.trial_end = seven_days;
      data.cancel_at = seven_days;
    }
    console.log({ data });
    const subscription = await stripe.subscriptions.create(data);
    console.log({ subscription });
  }

  public async getSubscription() {
    // sub_1Lxbf8Ek2K7pH9UX7g5QAMlq
    const subscription = await stripe.subscriptions.retrieve('sub_1Lxbf8Ek2K7pH9UX7g5QAMlq');
    console.log({ subscription });
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
          ':stripeId': 'my_stripeId',
        },
        ReturnValues: 'ALL_NEW',
      })
      .promise();
  }
}
