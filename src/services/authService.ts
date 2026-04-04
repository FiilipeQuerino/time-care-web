import { ApiResponse } from '../types/api';
import { LoginResponseData } from '../types/auth';
import { apiRequest } from './api';

interface LoginPayload {
  email: string;
  password: string;
}

export async function loginRequest(payload: LoginPayload): Promise<LoginResponseData> {
  const response = await apiRequest<ApiResponse<LoginResponseData>>('/api/Auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!response.success) {
    throw new Error(response.message || 'Nao foi possivel autenticar.');
  }

  return response.data;
}
