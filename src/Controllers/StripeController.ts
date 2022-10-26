import { StripeServices } from '../Services/StripeServices';
export const StripeController = {
  getPricingPlans: async (req: any, res: any) => {
    const {limit=20,search,active=true,getAll=false}=req.query
    let query=''
    try {
      if(getAll){
        query=''
      }else if(search){
        query=`active:${active}`
      }
      const data = await StripeServices.getPricingPlans(query);
      return res.status(200).json({ data, error: false, message: 'Successfully fetched pricing plans' });
    } catch (err: any) {
      return res.status(500).json({ error: true, message: err?.message });
    }
  },
};
