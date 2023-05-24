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

export {
    CosmosDocument,
    User,
    UserAddress,
    Token,
}