export interface ZendeskUser {
  readonly email: string;
  readonly name: string;
  readonly role: string;
  readonly verified: boolean;
  readonly time_zone: string;
  readonly organization_id: string;
}

export interface  ZendeskUpdateUser {
  readonly email?: string;
  readonly name?: string;
  readonly verified?: boolean;
  readonly time_zone?: string;
  readonly zendeskUserId: string;
  readonly organization_id?: string;
}

export interface ZendeskComment {
  uploads: [string];
}

export interface ZendeskCreateTicket {
  created_at: number;
  comment: ZendeskComment;
  description: string;
  raw_subject: string;
  recipient: string;
  subject: string;
  priority: string;
  status: string;
  submitter_id: string;
  type: string;
}

export interface OrganizationFieldsInterface {
  flexCountry: string;
}
export interface ZendeskCreateOrganization {
  name: string;
  organization_fields: OrganizationFieldsInterface;
}

export interface ZendeskMakePrimary {
  zendeskUserId: string;
  zendeskUserIdentityId: string;
}

export interface ZendeskPrimaryEmailParams{
  email:string,
  zendeskUserId:string
}
