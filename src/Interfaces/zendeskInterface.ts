export interface ZendeskUser {
    readonly email:string,
    readonly name:string,
    readonly role:string,
    readonly organization_id: string
  }

  export interface ZendeskUpdate {
    readonly email:string,
    readonly name:string,
    readonly verified:boolean,
    readonly time_zone: string
  }

  export interface zendeskComment{
      uploads:[string]
  }


  export interface ZendeskCreateTicket {
    created_at:number,
    comment: zendeskComment
    description:string,
    raw_subject:string,
    recipient:string,
    subject:string,
    priority:string,
    status:string,
    submitter_id:string,
    type:string
}