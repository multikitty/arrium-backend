
export interface AddCountryObj {
    readonly sk : string,
    readonly pk : string,
    readonly country : string,
    readonly countryCode : string
}

export interface AddRegionObj {
    readonly sk : string,
    readonly pk : string,
    readonly regionName : string,
    readonly regionCode : string
    readonly regionId : string
}

export interface AddStationTypeObj {
    readonly sk : string,
    readonly pk : string,
    readonly stationType : string
}
export interface AddStationObj {
    readonly sk : string,
    readonly pk : string,
    readonly regionName : string,
    readonly regionCode : string
    readonly regionId : string,
    readonly stationCode : string
    readonly stationName : string,
    readonly stationId : string,
    readonly stationType : string,
    readonly address1 : string
    readonly address2 : string,
    readonly address3 : string
    readonly city : string,
    readonly state : string,
    readonly postalCode : string,
    readonly latitude : string,
    readonly longitude : string,
}