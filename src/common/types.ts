interface CosmosDocument {
    _etag?: string;
    _rid?: string;
    _self?: string;
    _attachments?: string;
    _ts?: number;
}

interface User extends CosmosDocument {
    id: string;
    username: string;
    addressesIDs: string[];
    addresses?: UserAddress[];
    vipID: string;
    vip?: UserVips;
    roles: Role[];
    subscriptionID: string | null;
    subscription?: UserSubscriptions;
    activityPaymentsIDs: string[];
    activityPayments?: any[];
}

interface UserAddress extends CosmosDocument {
    id: string;
    userId: string;
    chain: string;
    address: string;
}

interface UserVips extends CosmosDocument {
    id: string;
    userId: string;
    name: string;
    xp: number;
}

interface UserSubscriptions extends CosmosDocument {
    id: string;
    userId: string;
    method: PaymentMethod;
    period: number;
}

interface Token {
    token: string;
}

interface FindUserArgs {
    withAddresses?: boolean;
    withVip?: boolean;
    withSubscription?: boolean;
    withActivityPayments?: boolean;
}

// Enums
enum Role {
    MEMBER = "member",
    ANALITYCS = "analitycs",
    MODORATOR = "moderator",
    ADMIN = "admin",
}

enum PaymentMethod {
    ESTAR = "estar",
    EGLD = "egld",
    BNB = "bnb",
    FIAT = "fiat",
    SHARDS = "shards",
}

export {
    CosmosDocument,
    User,
    UserAddress,
    Token,
    FindUserArgs,
    Role,
    UserSubscriptions,
    UserVips
}