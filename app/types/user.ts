export interface User  {
    id: string;
    cognitoId: string | null;
    username?: string | null;  // Make username optional
    firstName?: string | null;
    lastName?: string | null;
    streetAddress?: string | null;
    city?: string | null;
    state?: string | null;
    zipCode?: string | null;
    country?: string | null;
    profileImageKey?: string | null;
  };