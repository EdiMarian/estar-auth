export const getChainAddress = (arr: any[], chainId: string): any => {
  return arr.find((address) => address.chain === chainId);
};
