export interface PricingPlan {
  name?: string;
  getAll: boolean;
  plan_type?: string;
  active: boolean | string;
  country: string;
}

export interface Plan {
  customerId: string;
  planId: string;
  collection_method?: string;
  isFreeTrial?: boolean;
  billing_cycle_anchor?: number;
  days_until_due?: any;
  period?: { start: number; end: number };
  due_date?: number;
  proration_behavior?: string;
}

export interface FreeTrial {
  pk: string;
  sk: string;
}

export interface RetrieveInvoices {
  customer: string;
  limit?: number;
  getAll?: boolean;
  ending_before?: string;
  starting_after?: string;
}

export interface customerData {
  email: string;
  name: string;
  customerId: number;
  pk: string;
  sk: string;
}
