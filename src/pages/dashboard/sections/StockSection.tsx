import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, History, PackagePlus, Pencil, ShieldAlert } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import {
  adjustProductStock,
  createProduct,
  fetchProductMovements,
  fetchProducts,
  updateProduct,
  updateProductStatus,
} from '../../../services/productService';
import {
  AdjustStockPayload,
  CreateProductPayload,
  Product,
  ProductCategory,
  ProductStatus,
  StockMovement,
  StockMovementType,
  UnitOfMeasure,
} from '../../../types/product';

interface StockSectionProps {
  refreshTick?: number;
}

const categoryLabels: Record<ProductCategory, string> = {
  1: 'Insumo',
  2: 'Injetaveis',
  3: 'Descartaveis',
  4: 'Cremes e oleos',
  5: 'Limpeza',
};

const unitLabels: Record<UnitOfMeasure, string> = {
  1: 'un',
  2: 'ml',
  3: 'g',
  4: 'kg',
  5: 'L',
  6: 'caixa',
  7: 'pacote',
};

const movementLabels: Record<StockMovementType, string> = {
  1: 'Saldo inicial',
  2: 'Entrada',
  3: 'Saida',
  4: 'Ajuste',
};

const initialForm: CreateProductPayload = {
  name: '',
  description: '',
  sku: '',
  category: 1,
  unitOfMeasure: 1,
  currentStock: 0,
  minimumStock: 0,
  costPrice: 0,
  status: 1,
  supplierName: '',
  supplierContact: '',
  notes: '',
};

export const StockSection = ({ refreshTick = 0 }: StockSectionProps) => {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ProductStatus>('all');
  const [criticalOnly, setCriticalOnly] = useState(false);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<CreateProductPayload>(initialForm);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustProduct, setAdjustProduct] = useState<Product | null>(null);
  const [adjustPayload, setAdjustPayload] = useState<AdjustStockPayload>({
    movementType: 2,
    quantity: 0,
    reason: '',
    notes: '',
  });
  const [isAdjusting, setIsAdjusting] = useState(false);

  const [isMovementsOpen, setIsMovementsOpen] = useState(false);
  const [movementProduct, setMovementProduct] = useState<Product | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [isLoadingMovements, setIsLoadingMovements] = useState(false);

  const loadProducts = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetchProducts(token, {
        search: search.trim() || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
        criticalOnly,
        page: 1,
        pageSize: 100,
      });
      setProducts(response.items);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar estoque.';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, statusFilter, criticalOnly, refreshTick]);

  const filteredBySearch = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) =>
      product.name.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query),
    );
  }, [products, search]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm(initialForm);
    setIsProductModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      sku: product.sku,
      category: product.category,
      unitOfMeasure: product.unitOfMeasure,
      currentStock: product.currentStock,
      minimumStock: product.minimumStock,
      costPrice: product.costPrice,
      status: product.status,
      supplierName: product.supplierName ?? '',
      supplierContact: product.supplierContact ?? '',
      notes: product.notes ?? '',
    });
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;

    setIsSavingProduct(true);
    try {
      if (editingProduct) {
        await updateProduct(token, editingProduct.productId, form);
        showToast('Produto atualizado com sucesso.', 'success');
      } else {
        await createProduct(token, form);
        showToast('Produto criado com sucesso.', 'success');
      }
      closeProductModal();
      await loadProducts();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel salvar produto.';
      showToast(message, 'error');
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleToggleStatus = async (product: Product) => {
    if (!token) return;
    try {
      await updateProductStatus(token, product.productId, product.status !== 1);
      showToast('Status atualizado.', 'success');
      await loadProducts();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel atualizar status.';
      showToast(message, 'error');
    }
  };

  const openAdjustModal = (product: Product, movementType: StockMovementType) => {
    setAdjustProduct(product);
    setAdjustPayload({
      movementType,
      quantity: 0,
      reason: '',
      notes: '',
    });
    setIsAdjustModalOpen(true);
  };

  const handleAdjustStock = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || !adjustProduct) return;

    setIsAdjusting(true);
    try {
      await adjustProductStock(token, adjustProduct.productId, adjustPayload);
      showToast('Estoque ajustado com sucesso.', 'success');
      setIsAdjustModalOpen(false);
      setAdjustProduct(null);
      await loadProducts();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel ajustar estoque.';
      showToast(message, 'error');
    } finally {
      setIsAdjusting(false);
    }
  };

  const openMovements = async (product: Product) => {
    if (!token) return;
    setMovementProduct(product);
    setIsMovementsOpen(true);
    setIsLoadingMovements(true);
    try {
      const items = await fetchProductMovements(token, product.productId);
      setMovements(items);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar movimentacoes.';
      showToast(message, 'error');
    } finally {
      setIsLoadingMovements(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-800 sm:text-xl">Estoque</h3>
            <p className="text-sm text-slate-500">Produtos, estoque minimo e movimentacoes.</p>
          </div>
          <Button icon={PackagePlus} className="bg-pink-600 text-white hover:bg-pink-700" onClick={openCreateModal}>
            Novo produto
          </Button>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_170px_170px]">
          <Input label="Buscar produto" placeholder="Nome, SKU ou descricao" value={search} onChange={(event) => setSearch(String(event.target.value))} />

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Status</label>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value === 'all' ? 'all' : Number(event.target.value) as ProductStatus)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:border-pink-500 focus:bg-white focus:outline-none"
            >
              <option value="all">Todos</option>
              <option value={1}>Ativo</option>
              <option value={2}>Inativo</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setCriticalOnly((value) => !value)}
            className={`mt-6 h-11 rounded-xl border px-3 text-sm font-semibold transition-colors ${criticalOnly ? 'border-amber-300 bg-amber-50 text-amber-800' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'}`}
          >
            {criticalOnly ? 'Somente criticos' : 'Mostrar criticos'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-[1.5rem] border border-slate-100 bg-white p-6 text-slate-500">Carregando produtos...</div>
      ) : filteredBySearch.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-white p-6 text-center text-slate-500">
          Nenhum produto encontrado.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBySearch.map((product) => (
            <article key={product.productId} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-semibold text-slate-800">{product.name}</p>
                    {product.isCritical ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                        <ShieldAlert size={12} />
                        Critico
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-slate-500">SKU: {product.sku} • {categoryLabels[product.category]}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Estoque: <strong>{product.currentStock}</strong> {unitLabels[product.unitOfMeasure]} • Minimo: {product.minimumStock}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" icon={Pencil} onClick={() => openEditModal(product)}>Editar</Button>
                  <Button size="sm" variant="outline" icon={ArrowUp} onClick={() => openAdjustModal(product, 2)}>Entrada</Button>
                  <Button size="sm" variant="outline" icon={ArrowDown} onClick={() => openAdjustModal(product, 3)}>Saida</Button>
                  <Button size="sm" variant="outline" icon={History} onClick={() => void openMovements(product)}>Historico</Button>
                  <Button
                    size="sm"
                    className={product.status === 1 ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-emerald-600 text-white hover:bg-emerald-700'}
                    onClick={() => void handleToggleStatus(product)}
                  >
                    {product.status === 1 ? 'Inativar' : 'Ativar'}
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {isProductModalOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/35 p-3">
          <form onSubmit={handleSaveProduct} className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <h4 className="text-lg font-bold text-slate-800">{editingProduct ? 'Editar produto' : 'Novo produto'}</h4>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input label="Nome" required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: String(event.target.value) }))} />
              <Input label="SKU" required value={form.sku} onChange={(event) => setForm((current) => ({ ...current, sku: String(event.target.value) }))} />
              <Input label="Descricao" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: String(event.target.value) }))} />
              <Input label="Preco de custo" type="number" step="0.01" value={form.costPrice} onChange={(event) => setForm((current) => ({ ...current, costPrice: Number(event.target.value) }))} />
              <Input label="Estoque atual" type="number" step="0.01" value={form.currentStock} onChange={(event) => setForm((current) => ({ ...current, currentStock: Number(event.target.value) }))} />
              <Input label="Estoque minimo" type="number" step="0.01" value={form.minimumStock} onChange={(event) => setForm((current) => ({ ...current, minimumStock: Number(event.target.value) }))} />
              <Input label="Fornecedor" value={form.supplierName} onChange={(event) => setForm((current) => ({ ...current, supplierName: String(event.target.value) }))} />
              <Input label="Contato fornecedor" value={form.supplierContact} onChange={(event) => setForm((current) => ({ ...current, supplierContact: String(event.target.value) }))} />

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Categoria</label>
                <select
                  value={form.category}
                  onChange={(event) => setForm((current) => ({ ...current, category: Number(event.target.value) as ProductCategory }))}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700"
                >
                  <option value={1}>{categoryLabels[1]}</option>
                  <option value={2}>{categoryLabels[2]}</option>
                  <option value={3}>{categoryLabels[3]}</option>
                  <option value={4}>{categoryLabels[4]}</option>
                  <option value={5}>{categoryLabels[5]}</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Unidade</label>
                <select
                  value={form.unitOfMeasure}
                  onChange={(event) => setForm((current) => ({ ...current, unitOfMeasure: Number(event.target.value) as UnitOfMeasure }))}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700"
                >
                  <option value={1}>{unitLabels[1]}</option>
                  <option value={2}>{unitLabels[2]}</option>
                  <option value={3}>{unitLabels[3]}</option>
                  <option value={4}>{unitLabels[4]}</option>
                  <option value={5}>{unitLabels[5]}</option>
                  <option value={6}>{unitLabels[6]}</option>
                  <option value={7}>{unitLabels[7]}</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={closeProductModal} type="button" disabled={isSavingProduct}>Cancelar</Button>
              <Button type="submit" isLoading={isSavingProduct}>{editingProduct ? 'Salvar alteracoes' : 'Criar produto'}</Button>
            </div>
          </form>
        </div>
      ) : null}

      {isAdjustModalOpen && adjustProduct ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/35 p-3">
          <form onSubmit={handleAdjustStock} className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <h4 className="text-lg font-bold text-slate-800">Ajustar estoque - {adjustProduct.name}</h4>
            <p className="mt-1 text-sm text-slate-500">Estoque atual: {adjustProduct.currentStock} {unitLabels[adjustProduct.unitOfMeasure]}</p>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Tipo</label>
                <select
                  value={adjustPayload.movementType}
                  onChange={(event) => setAdjustPayload((current) => ({ ...current, movementType: Number(event.target.value) as StockMovementType }))}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700"
                >
                  <option value={2}>{movementLabels[2]}</option>
                  <option value={3}>{movementLabels[3]}</option>
                  <option value={4}>{movementLabels[4]}</option>
                </select>
              </div>
              <Input
                label="Quantidade"
                type="number"
                step="0.01"
                required
                value={adjustPayload.quantity}
                onChange={(event) => setAdjustPayload((current) => ({ ...current, quantity: Number(event.target.value) }))}
              />
              <Input
                label="Motivo"
                value={adjustPayload.reason}
                onChange={(event) => setAdjustPayload((current) => ({ ...current, reason: String(event.target.value) }))}
              />
              <Input
                label="Observacoes"
                value={adjustPayload.notes}
                onChange={(event) => setAdjustPayload((current) => ({ ...current, notes: String(event.target.value) }))}
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAdjustModalOpen(false)} type="button" disabled={isAdjusting}>Cancelar</Button>
              <Button type="submit" isLoading={isAdjusting}>Confirmar ajuste</Button>
            </div>
          </form>
        </div>
      ) : null}

      {isMovementsOpen && movementProduct ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/35 p-3">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-slate-800">Movimentacoes - {movementProduct.name}</h4>
              <Button variant="outline" size="sm" onClick={() => setIsMovementsOpen(false)}>Fechar</Button>
            </div>
            <div className="mt-3 max-h-[60vh] space-y-2 overflow-y-auto">
              {isLoadingMovements ? (
                <p className="text-slate-500">Carregando...</p>
              ) : movements.length === 0 ? (
                <p className="text-slate-500">Sem movimentacoes registradas.</p>
              ) : (
                movements.map((movement) => (
                  <article key={movement.stockMovementId} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-800">{movementLabels[movement.movementType]}</p>
                      <p className="text-xs text-slate-500">{new Date(movement.createdAt).toLocaleString('pt-BR')}</p>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {movement.previousStock} → <strong>{movement.newStock}</strong> (qtd {movement.quantity})
                    </p>
                    {movement.reason ? <p className="mt-1 text-xs text-slate-500">Motivo: {movement.reason}</p> : null}
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
