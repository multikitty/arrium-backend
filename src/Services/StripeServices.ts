import moment from "moment";

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET);

export const StripeServices = {
  getPricingPlans: async (query: string) => {
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
  },
  createCustomer: async (email: string, name: string) => {
    //create customer
    const customer = await stripe.customers.create({
      email,
      name,
    });
    return customer;
  },
  subscribeToPlan: async (customerId: string, planId: string, isFreeTrial = false) => {
    //subscribe customer to a 
    let data:any={
      customer: customerId,
      items: [
        {
          price: 'price_1KomCiEk2K7pH9UXw1t4Xmmg',
        },
      ],
      
    }
    if(isFreeTrial){
      //get 7 days after timestamp
      const seven_days=moment().add(7,'days').unix();
      data.trial_end= seven_days
    }
    const subscription = await stripe.subscriptions.create(data);
    console.log({subscription})
  },
};
