import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '@/type'

export const decodeToken = (token: string): DecodedToken => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch (error) {
    console.error('Failed to decode token:', error);
    throw new Error('Invalid token');
  }
};