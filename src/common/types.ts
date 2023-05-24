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

export {
    User,
    UserAddress
}