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
  readonly connectionId: string;
  readonly message: string;
}
