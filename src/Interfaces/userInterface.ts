export interface AddUserObj {
  readonly userPK: string;
  readonly userSK: string;
  readonly email: string;
  readonly password: string;
  readonly refCode?: string;
  readonly userRole: string;
  readonly emailVerified: boolean;
  readonly customerId: string;
  readonly country: string;
  readonly firstname: string;
  readonly lastname: string;
  readonly phoneNumber: string | number;
  readonly dialCode: string | number;
  readonly tzName: string;
  startDate: Date;
  readonly status: string;
  readonly endDate: Date | string | null;
}

export interface UpdatePricingPlanObj {
  readonly userPK: string;
  readonly userSK: string;
  readonly status: boolean;
}

export interface UpdateCurrentStepAndZendeskUsrID {
  readonly sk: string;
  readonly pk: string;
  readonly currentStep: string;
  readonly zendeskUsrID: string;
}

export interface UpdateCurrentStep {
  readonly sk: string;
  readonly pk: string;
  readonly currentStep: string;
}
