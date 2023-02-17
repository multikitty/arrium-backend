export interface ReferralCodeObj {
    readonly pk : string,
    readonly sk : string,
    readonly refCode : string,
    readonly country : string,
    readonly region : string,
    readonly station : string,
    readonly refGenFor : string,
    readonly refGenBy : string,
    readonly refGen : Date | string |Number,
    readonly refActive : boolean,
    readonly customerID : string
}

export interface ReferralRequestData {
    readonly country : string,
    readonly region : string,
    readonly station : string,
    readonly numberOfReferral : number,
    readonly assignTo : string,
}


