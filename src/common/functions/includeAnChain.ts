import { UserAddress } from "../types";

export const includeAnChain = (arr: UserAddress[], chainId: string) => {
    return arr.some((address) => address.chain === chainId);
}