const API_BASE_URL = 'https://api.davodelivery.uz/api';

export interface LoginRequest {
  login: string;
  password: string;
}

export interface Authority {
  authority: string;
}

export interface LoginUser {
  username: string;
  authorities: Authority[];
  id: number;
  phone: string;
  [key: string]: any;
}

export interface LoginToken {
  token: string;
  activationRequired: boolean;
  expiresAt: string | null;
  expiresIn: string | null;
}

export interface LoginPayload {
  user: LoginUser;
  token: LoginToken;
}

export interface LoginResponse {
  payload: LoginPayload;
  status: string;
  code: number;
}

export interface PharmacyListRequest {
  searchKey: string;
  page: number;
  size: number;
  active: boolean | null;
}

export interface Lead {
  id: number;
  name: string;
  phone: string;
  [key: string]: any;
}

export interface Pharmacy {
  id: number;
  code: string;
  name: string;
  address: string;
  phone: string | null;
  active: boolean;
  lead: Lead;
  creationDate: string;
  modifiedDate: string;
  [key: string]: any;
}

export interface PharmacyListPayload {
  list: Pharmacy[];
  total: number;
}

export interface PharmacyListResponse {
  payload: PharmacyListPayload;
  status: string;
  code: number;
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/admin-login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'ru,en-US;q=0.9,en;q=0.8',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
}

export async function getPharmacyList(
  token: string,
  searchKey: string = '',
  page: number = 0,
  active: boolean | null = true
): Promise<PharmacyListResponse> {
  const response = await fetch(`${API_BASE_URL}/market/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'ru,en-US;q=0.9,en;q=0.8',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      searchKey,
      page,
      size: 100,
      active,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch pharmacy list');
  }

  return response.json();
}

export async function updatePharmacyStatus(
  token: string,
  pharmacyId: number,
  field: 'brandedPacket' | 'training',
  value: boolean
): Promise<Pharmacy> {
  const response = await fetch(`${API_BASE_URL}/market/${pharmacyId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'ru,en-US;q=0.9,en;q=0.8',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ [field]: value }),
  });

  if (!response.ok) {
    throw new Error('Failed to update pharmacy');
  }

  return response.json();
}
