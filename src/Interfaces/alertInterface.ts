export interface AlertObject {
  readonly pk: string;
  readonly offerID: string;
  readonly price: string;
  readonly bStartTimeU: number;
  readonly bEndTimeU: number;
  readonly stationCode: string;
  readonly stationName: string;
  readonly sessionTimeU: number;
  readonly notifType: string;
  readonly currentTime: number;
  readonly notifDismiss?: boolean;
  readonly notifViewed?: boolean;
  readonly expDate?: number;
  readonly invID?: string;
}

export interface BlockAlertObject {
  readonly pk: string;
  readonly offerID: string;
  readonly price: string;
  readonly bStartTimeU: number;
  readonly bEndTimeU: number;
  readonly stationCode: string;
  readonly stationName: string;
  readonly sessionTimeU: number;
  readonly notifType: string;
  readonly currentTime: number;
  readonly notifDismiss?: boolean;
  readonly notifViewed?: boolean;
  readonly expDate?: number;
}

export interface PaymentAlertObject {
  readonly pk: string;
  readonly sk?: string;
  readonly notifType: string;
  readonly currentTime: number;
  readonly invID?: number;
  readonly notifViewed?: boolean;
  readonly expDate?: number;
}

export interface UpdateAlertObject {
  pk: string;
  invoiceId: string;
  currentTime: number;
}

export interface NotificationObject {
  pk?: string;
  sk?: string;
  notifType?: string;
  currentTime?: number;
  invID?: number;
  notifViewed?: boolean;
  expDate?: number;
  offerID?: string;
  price?: string;
  bStartTimeU?: number;
  bEndTimeU?: number;
  stationCode?: string;
  stationName?: string;
  sessionTimeU?: number;
  notifDismiss?: boolean;
}

export interface NotificationWSObject {
  connectionId: string;
  data: NotificationObject;
}
