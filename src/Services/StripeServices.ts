const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET);

export const StripeServices = {
  getPricingPlans: async (query:any) => {
    const products = await stripe.products.search({
      query: query,
      
    });
    return products;
  },
};
