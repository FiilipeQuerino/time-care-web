import { ApiResponse, PaginationMeta } from '../types/api';
import {
  AdjustStockPayload,
  CreateProductPayload,
  Product,
  ProductQuery,
  StockMovement,
  UpdateProductPayload,
} from '../types/product';
import { apiRequest } from './api';

interface RawApiResponse<TData, TMeta = unknown> extends Partial<ApiResponse<TData, TMeta>> {
  success?: boolean;
  Success?: boolean;
  message?: string;
  Message?: string;
  data?: TData;
  Data?: TData;
  meta?: TMeta;
  Meta?: TMeta;
}

const getValue = <T>(source: Record<string, unknown>, ...keys: string[]): T | undefined => {
  for (const key of keys) {
    if (key in source) return source[key] as T;
  }
  return undefined;
};

const unwrap = <TData, TMeta = unknown>(
  response: RawApiResponse<TData, TMeta> | TData,
  fallbackError: string,
): { data: TData; meta?: TMeta } => {
  if (response && typeof response === 'object') {
    const source = response as Record<string, unknown>;
    const hasWrapperShape =
      'success' in source || 'Success' in source || 'data' in source || 'Data' in source;

    if (hasWrapperShape) {
      const success = getValue<boolean>(source, 'success', 'Success');
      const message = getValue<string>(source, 'message', 'Message');
      const data = getValue<TData>(source, 'data', 'Data');
      const meta = getValue<TMeta>(source, 'meta', 'Meta');

      if (success === false) throw new Error(message || fallbackError);
      return { data: data as TData, meta };
    }
  }

  return { data: response as TData };
};

const normalizeProduct = (raw: unknown): Product => {
  const source = (raw ?? {}) as Record<string, unknown>;
  return {
    productId: Number(getValue(source, 'productId', 'ProductId') ?? 0),
    name: String(getValue(source, 'name', 'Name') ?? ''),
    description: String(getValue(source, 'description', 'Description') ?? ''),
    sku: String(getValue(source, 'sku', 'Sku', 'SKU') ?? ''),
    category: Number(getValue(source, 'category', 'Category') ?? 1) as Product['category'],
    unitOfMeasure: Number(
      getValue(source, 'unitOfMeasure', 'UnitOfMeasure') ?? 1,
    ) as Product['unitOfMeasure'],
    currentStock: Number(getValue(source, 'currentStock', 'CurrentStock') ?? 0),
    minimumStock: Number(getValue(source, 'minimumStock', 'MinimumStock') ?? 0),
    costPrice: Number(getValue(source, 'costPrice', 'CostPrice') ?? 0),
    status: Number(getValue(source, 'status', 'Status') ?? 1) as Product['status'],
    isCritical: Boolean(getValue(source, 'isCritical', 'IsCritical') ?? false),
    supplierName: getValue<string>(source, 'supplierName', 'SupplierName') ?? undefined,
    supplierContact: getValue<string>(source, 'supplierContact', 'SupplierContact') ?? undefined,
    notes: getValue<string>(source, 'notes', 'Notes') ?? undefined,
    createdAt: String(getValue(source, 'createdAt', 'CreatedAt') ?? ''),
    updatedAt: String(getValue(source, 'updatedAt', 'UpdatedAt') ?? ''),
  };
};

const normalizeMovement = (raw: unknown): StockMovement => {
  const source = (raw ?? {}) as Record<string, unknown>;
  return {
    stockMovementId: Number(getValue(source, 'stockMovementId', 'StockMovementId') ?? 0),
    productId: Number(getValue(source, 'productId', 'ProductId') ?? 0),
    movementType: Number(getValue(source, 'movementType', 'MovementType') ?? 1) as StockMovement['movementType'],
    quantity: Number(getValue(source, 'quantity', 'Quantity') ?? 0),
    previousStock: Number(getValue(source, 'previousStock', 'PreviousStock') ?? 0),
    newStock: Number(getValue(source, 'newStock', 'NewStock') ?? 0),
    reason: getValue<string>(source, 'reason', 'Reason') ?? undefined,
    notes: getValue<string>(source, 'notes', 'Notes') ?? undefined,
    createdAt: String(getValue(source, 'createdAt', 'CreatedAt') ?? ''),
  };
};

const toProductPayload = (payload: CreateProductPayload | UpdateProductPayload) => ({
  name: payload.name,
  description: payload.description,
  sku: payload.sku,
  category: payload.category,
  unitOfMeasure: payload.unitOfMeasure,
  currentStock: payload.currentStock,
  minimumStock: payload.minimumStock,
  costPrice: payload.costPrice,
  status: payload.status,
  supplierName: payload.supplierName,
  supplierContact: payload.supplierContact,
  notes: payload.notes,
});

export async function fetchProducts(
  token: string,
  query: ProductQuery = {},
): Promise<{ items: Product[]; meta?: PaginationMeta }> {
  const params = new URLSearchParams();
  if (query.search) params.set('search', query.search);
  if (query.category) params.set('category', String(query.category));
  if (query.status) params.set('status', String(query.status));
  if (query.criticalOnly) params.set('criticalOnly', 'true');
  if (query.page) params.set('page', String(query.page));
  if (query.pageSize) params.set('pageSize', String(query.pageSize));

  const queryString = params.toString();
  const path = `/api/Product${queryString ? `?${queryString}` : ''}`;

  const response = await apiRequest<RawApiResponse<unknown[], PaginationMeta> | unknown[]>(path, {
    method: 'GET',
    token,
  });

  const unwrapped = unwrap<unknown[], PaginationMeta>(response, 'Nao foi possivel carregar produtos.');
  return {
    items: Array.isArray(unwrapped.data) ? unwrapped.data.map(normalizeProduct) : [],
    meta: unwrapped.meta,
  };
}

export async function createProduct(token: string, payload: CreateProductPayload): Promise<Product> {
  const response = await apiRequest<RawApiResponse<unknown> | unknown>('/api/Product', {
    method: 'POST',
    token,
    body: JSON.stringify(toProductPayload(payload)),
  });
  const unwrapped = unwrap<unknown>(response, 'Nao foi possivel criar produto.');
  return normalizeProduct(unwrapped.data);
}

export async function updateProduct(
  token: string,
  productId: number,
  payload: UpdateProductPayload,
): Promise<Product> {
  const response = await apiRequest<RawApiResponse<unknown> | unknown>(`/api/Product/${productId}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(toProductPayload(payload)),
  });
  const unwrapped = unwrap<unknown>(response, 'Nao foi possivel atualizar produto.');
  return normalizeProduct(unwrapped.data);
}

export async function updateProductStatus(
  token: string,
  productId: number,
  isActive: boolean,
): Promise<Product> {
  const response = await apiRequest<RawApiResponse<unknown> | unknown>(
    `/api/Product/${productId}/status?isActive=${String(isActive)}`,
    {
      method: 'PATCH',
      token,
    },
  );
  const unwrapped = unwrap<unknown>(response, 'Nao foi possivel atualizar status do produto.');
  return normalizeProduct(unwrapped.data);
}

export async function adjustProductStock(
  token: string,
  productId: number,
  payload: AdjustStockPayload,
): Promise<Product> {
  const response = await apiRequest<RawApiResponse<unknown> | unknown>(`/api/Product/${productId}/stock`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({
      movementType: payload.movementType,
      quantity: payload.quantity,
      reason: payload.reason,
      notes: payload.notes,
    }),
  });
  const unwrapped = unwrap<unknown>(response, 'Nao foi possivel ajustar estoque.');
  return normalizeProduct(unwrapped.data);
}

export async function fetchProductMovements(token: string, productId: number): Promise<StockMovement[]> {
  const response = await apiRequest<RawApiResponse<unknown[]> | unknown[]>(`/api/Product/${productId}/movements`, {
    method: 'GET',
    token,
  });
  const unwrapped = unwrap<unknown[]>(response, 'Nao foi possivel carregar movimentacoes.');
  return Array.isArray(unwrapped.data) ? unwrapped.data.map(normalizeMovement) : [];
}
