import { UserAddress } from "../types";

export const getChainAddress = (arr: UserAddress[], chainId: string): UserAddress => {
    return arr.find((address) => address.chain === chainId);
}