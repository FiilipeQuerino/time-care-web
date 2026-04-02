import {
  ApiResponse,
  DashboardFinancialData,
  Client,
  PaginationMeta,
  CreateClientPayload,
  UpdateClientPayload,
  Procedure,
  CreateProcedurePayload,
} from '../types';
import { apiRequest } from './api';

export async function fetchDashboardFinancial(token: string): Promise<DashboardFinancialData> {
  const response = await apiRequest<ApiResponse<DashboardFinancialData>>('/api/Dashboard/financial', {
    method: 'GET',
    token,
  });

  if (!response.success) {
    throw new Error(response.message || 'Nao foi possivel carregar o dashboard.');
  }

  return response.data;
}

export async function fetchClients(token: string): Promise<{ items: Client[]; meta?: PaginationMeta }> {
  const response = await apiRequest<ApiResponse<Client[], PaginationMeta>>('/api/Client', {
    method: 'GET',
    token,
  });

  if (!response.success) {
    throw new Error(response.message || 'Nao foi possivel carregar os clientes.');
  }

  return {
    items: response.data,
    meta: response.meta,
  };
}

export async function createClient(token: string, payload: CreateClientPayload): Promise<Client> {
  const response = await apiRequest<ApiResponse<Client>>('/api/Client', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });

  if (!response.success) {
    throw new Error(response.message || 'Nao foi possivel criar o cliente.');
  }

  return response.data;
}

export async function updateClient(token: string, clientId: number, payload: UpdateClientPayload): Promise<Client> {
  const response = await apiRequest<ApiResponse<Client>>(`/api/Client/${clientId}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });

  if (!response.success) {
    throw new Error(response.message || 'Nao foi possivel atualizar o cliente.');
  }

  return response.data;
}

export async function updateClientStatus(token: string, clientId: number, isActive: boolean): Promise<Client> {
  const response = await apiRequest<ApiResponse<Client>>(`/api/Client/${clientId}/status?isActive=${String(isActive)}`, {
    method: 'PATCH',
    token,
  });

  if (!response.success) {
    throw new Error(response.message || 'Nao foi possivel alterar o status do cliente.');
  }

  return response.data;
}

export async function fetchProcedures(token: string): Promise<Procedure[]> {
  const response = await apiRequest<ApiResponse<Procedure[]>>('/api/Procedure', {
    method: 'GET',
    token,
  });

  if (!response.success) {
    throw new Error(response.message || 'Nao foi possivel carregar os procedimentos.');
  }

  return response.data;
}

export async function createProcedure(token: string, payload: CreateProcedurePayload): Promise<Procedure> {
  const response = await apiRequest<ApiResponse<Procedure>>('/api/Procedure', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });

  if (!response.success) {
    throw new Error(response.message || 'Nao foi possivel cadastrar o procedimento.');
  }

  return response.data;
}
