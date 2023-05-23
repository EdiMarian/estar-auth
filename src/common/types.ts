interface User {
    id: string;
    username: string;
    addresses: Address[];
}

interface Address {
    chain: string;
    address: string;
}

export {
    User,
    Address
}