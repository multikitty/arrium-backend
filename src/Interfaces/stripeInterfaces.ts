export interface PricingPlan {
  name?: string;
  getAll: boolean;
  plan_type?: string;
  active: boolean | string;
}

export interface Plan {
  customerId: string;
  planId: string;
  isFreeTrial: boolean;
}

export interface FreeTrial {
  pk: string;
  sk: string;
}
