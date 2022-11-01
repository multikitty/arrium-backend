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
    const { customerId, planId, isFreeTrial } = payload;
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
      const seven_days = moment().add(7, 'days').unix();
      data.trial_end = seven_days;
      data.cancel_at = seven_days;
    }
    const subscription = await stripe.subscriptions.create(data);
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
          ':stripeId': data.stripeId,
        },
        ReturnValues: 'ALL_NEW',
      })
      .promise();
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
    const stripe_customer = await this.createCustomer(email, `${firstname} ${lastname}`);
    //get all areas plan id from stripe
    let plans = await this.getPricingPlans({
      active: true,
      getAll: false,
      plan_type: 'Basic',
      name: 'All Areas',
    });
    if (!plans?.length) {
      throw Error('Plan not found');
    }
    plans = plans[0]?.default_price;
    await this.subscribeToPlan({ customerId: stripe_customer.id, planId: plans, isFreeTrial: true });
    const user = await this.updateStripeClientId({
      pk,
      sk,
      stripeId: stripe_customer.id,
    });
    return user;
  }
}
