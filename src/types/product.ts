export type ProductStatus = 1 | 2;
export type ProductCategory = 1 | 2 | 3 | 4 | 5;
export type UnitOfMeasure = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type StockMovementType = 1 | 2 | 3 | 4;

export interface Product {
  productId: number;
  name: string;
  description: string;
  sku: string;
  category: ProductCategory;
  unitOfMeasure: UnitOfMeasure;
  currentStock: number;
  minimumStock: number;
  costPrice: number;
  status: ProductStatus;
  isCritical: boolean;
  supplierName?: string;
  supplierContact?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  stockMovementId: number;
  productId: number;
  movementType: StockMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason?: string;
  notes?: string;
  createdAt: string;
}

export interface ProductQuery {
  search?: string;
  category?: ProductCategory;
  status?: ProductStatus;
  criticalOnly?: boolean;
  page?: number;
  pageSize?: number;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  sku: string;
  category: ProductCategory;
  unitOfMeasure: UnitOfMeasure;
  currentStock: number;
  minimumStock: number;
  costPrice: number;
  status: ProductStatus;
  supplierName?: string;
  supplierContact?: string;
  notes?: string;
}

export interface UpdateProductPayload extends CreateProductPayload {}

export interface AdjustStockPayload {
  movementType: StockMovementType;
  quantity: number;
  reason?: string;
  notes?: string;
}
