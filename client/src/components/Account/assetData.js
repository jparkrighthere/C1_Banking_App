export const mockPersonalAssets = [
    { id: 1, description: 'Car', value: 15000 },
    { id: 2, description: 'Jewelry', value: 2000 },
    { id: 3, description: 'Electronics', value: 1000 },
  ];
  
  export const mockAccounts = [
    { subtype: 'checking', current_balance: 2000 },
    { subtype: 'savings', current_balance: 5000 },
    { subtype: 'ira', current_balance: 3000 },
    { subtype: '401k', current_balance: 4000 },
    { subtype: 'credit card', current_balance: -1000 },
    { subtype: 'student', current_balance: -15000 },
    { subtype: 'mortgage', current_balance: -200000 },
  ];
  
  export const mockNumOfItems = mockAccounts.length;
  export const mockUserId = 123;
  export const mockAssetsOnly = false;