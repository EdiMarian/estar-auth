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
    role: Roles[];
    addressesIDs: string[];
}

interface UserAddress extends CosmosDocument {
    id: string;
    userId: string;
    chain: string;
    address: string;
}

interface Token {
    token: string;
}

// Enums
enum Roles {
    MEMBER = "member",
    ANALITYCS = "analitycs",
    MODORATOR = "moderator",
    ADMIN = "admin",
}

export {
    CosmosDocument,
    User,
    UserAddress,
    Token,
    Roles,
}