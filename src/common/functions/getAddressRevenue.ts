import { revenue } from "src/revenue/revenue";

export const getAddressRevenue = (targetAddress) => {
    let userData = [];
  
    revenue.forEach(item => {
      const { date, users } = item;
      let found = false;
      
      users.forEach(user => {
        const { address, value } = user;
        
        if (address === targetAddress) {
          userData.push({ date, value });
          found = true;
        }
      });
  
      if (!found) {
        userData.push({ date, value: 0 });
      }
    });
    
    return userData;
}