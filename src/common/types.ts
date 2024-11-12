export interface FindUserArgs {
  withAddresses?: boolean;
  withVip?: boolean;
  withSubscription?: boolean;
  withActivityPayments?: boolean;
}

export interface Token {
  token: string;
}
