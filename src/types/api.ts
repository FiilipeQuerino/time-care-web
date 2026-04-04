export interface ApiResponse<TData, TMeta = unknown> {
  success: boolean;
  message: string;
  data: TData;
  meta?: TMeta;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
