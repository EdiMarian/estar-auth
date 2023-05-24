interface User {
    id: string;
    username: string;
    addressesIDs: string[];
}

interface UserAddress {
    id: string;
    userId: string;
    chain: string;
    address: string;
}

interface Token {
    token: string;
}

export {
    User,
    UserAddress,
    Token
}