import { StripeServices } from '../Services/StripeServices';
export const StripeController = {
  getPricingPlans: async (req: any, res: any) => {
    try {
      const data = await StripeServices.getPricingPlans();
      return res.status(200).json({ data, error: false, message: 'Successfully fetched pricing plans' });
    } catch (err: any) {
      return res.status(500).json({ error: true, message: err?.message });
    }
  },
};
