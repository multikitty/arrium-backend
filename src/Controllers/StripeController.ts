import { StripeServices } from '../Services/StripeServices';
export const StripeController = {
  getPricingPlans: async (req: any, res: any) => {
    const { getAll = false, active = true, name = '' } = req.query;
    let query = 'active:"true"';
    try {
      if (getAll) {
        query = '';
      } else if (!active) {
        query = 'active:"false"';
      } else if (name) {
        if (!active) {
          query = `active:"false" AND name:\"${name}\"`;
        } else {
          query = `active:"true" AND name:\"${name}\"`;
        }
      }
      const data = await StripeServices.getPricingPlans(query);
      return res.status(200).json({ data, error: false, message: 'Successfully fetched pricing plans' });
    } catch (err: any) {
      return res.status(500).json({ error: true, message: err?.message });
    }
  },
  createCustomerStripe: async (email: string, name: string) => {
    try {
      const res = await StripeServices.createCustomer(email, name);
      return res
    } catch (error: any) {
      throw Error(error?.message);
    }
  },
  // subscribeToPlan:async(customerId:string,plan:string,isFreeTrial:boolean){
    
  // }
};
