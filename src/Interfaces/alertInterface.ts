export interface AlertObject {
  readonly pk: string;
  readonly notificationType: string;
  readonly invoiceId: string;
  readonly dismissed?: number;
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
