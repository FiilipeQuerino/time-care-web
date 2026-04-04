export interface Procedure {
  procedureId: number;
  name: string;
  suggestedPrice: number;
  estimatedDurationInMinutes: number;
  category: number;
}

export interface CreateProcedurePayload {
  name: string;
  suggestedPrice: number;
  estimatedDurationInMinutes: number;
  category: number;
}

export interface UpdateProcedurePayload extends CreateProcedurePayload {}
