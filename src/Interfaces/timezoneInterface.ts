export interface ITimezone {
    countryCode: string
    countryName: string
    gmtOffset: number
    timestamp: number
    zoneName: string
}

export interface TimezoneListResponse {
    message: string
    status: string
    zones: ITimezone
}

export interface IFetchTimezoneByZoneResult {
    gmtOffset: number
    message: string
    status: string
    zoneEnd: number
    zoneName: string
    zoneStart: number
}