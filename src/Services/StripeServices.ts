const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET);

export const StripeServices = {
  getPricingPlans: async () => {
    const products = await stripe.products.search({
      query: "active:'true' AND name:'(UK)'",
    });
    return products;
  },
};
