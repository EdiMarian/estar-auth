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
    diamonds: number;
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

interface ShopItem extends CosmosDocument {
    id: string;
    stripe_price_id: string;
    name: string;
    description: string;
    amount: number;
    price: number;
    currency: string[];
    image: string;
    type: ItemType;
    period: number;
}

interface Order extends CosmosDocument {
    id: string;
    userId: string;
    itemId: string;
    method: PaymentMethod;
    createdAt: Date;
    status: OrderStatus
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

enum ItemType {
    PAYMENT = "payment",
    SUBSCRIPTION = "subscription",
}

enum OrderStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
}

export {
    CosmosDocument,
    User,
    UserAddress,
    Token,
    FindUserArgs,
    Role,
    UserSubscriptions,
    UserVips,
    ShopItem,
    PaymentMethod,
    ItemType,
    Order,
    OrderStatus,
}