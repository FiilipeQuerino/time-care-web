export interface Client {
  clientId: number;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  gender?: number;
}

export interface CreateClientPayload {
  name: string;
  email: string;
  phone: string;
  gender: number;
}

export interface UpdateClientPayload extends CreateClientPayload {}
