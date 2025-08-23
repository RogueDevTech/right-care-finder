export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  phoneNumber: string;
  address: string | null;
  state: string | null;
  localGovernment: string | null;
  country: string | null;
  dateOfBirth: string | null;
  lastLoginAt: string;
  companyName: string | null;
  licenseNumber: string | null;
  businessAddress: string | null;
  website: string | null;
  verificationStatus: string;
  verificationDocuments: string[] | null;
  profileImage: string | null;
  bio: string | null;
  preferredLocations: string[] | null;
  budgetRange: string | null;
  hearFromUs: string | null;
  referralCode: string | null;
  agentCode: string | null;
}

export interface ILoginResponse {
  token: string;
  user: IUser;
}

export interface IAddress {
  id?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  stateProvince?: string;
  country?: string;
  postalCode?: string;
  name?: string;
  apartmentNumber?: string;
  phone?: string;
  hsnCode?: string;
  vatId?: string;
  businessName?: string;
}

export interface ISession {
  user?: IUser;
  token?: string;
  isLoggedIn: boolean;
}

export interface IAuthSession {
  user?: IUser;
  token?: string;
}

export interface ISignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface IUpdateUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  state?: string;
  localGovernment?: string;
  country?: string;
  dateOfBirth?: string;
  companyName?: string;
  licenseNumber?: string;
  businessAddress?: string;
  website?: string;
  profileImage?: string;
  bio?: string;
  preferredLocations?: string[];
  budgetRange?: string;
  hearFromUs?: string;
}
