import { useCallback, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  exportAnalyticsCsv,
  exportAnalyticsPdf,
  fetchAnalyticsFinancial,
  fetchAnalyticsPerformance,
} from '../services/analyticsService';
import { AnalyticsFilters, FinancialSummary, PerformanceSummary } from '../types/analytics';

const toDateInput = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const createDefaultFilters = (): AnalyticsFilters => {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  return {
    startDate: toDateInput(start),
    endDate: toDateInput(today),
  };
};

export const useAnalyticsReports = () => {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [filters, setFilters] = useState<AnalyticsFilters>(createDefaultFilters);
  const [financial, setFinancial] = useState<FinancialSummary | null>(null);
  const [performance, setPerformance] = useState<PerformanceSummary | null>(null);
  const [isLoadingFinancial, setIsLoadingFinancial] = useState(false);
  const [isLoadingPerformance, setIsLoadingPerformance] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [financialError, setFinancialError] = useState<string | null>(null);
  const [performanceError, setPerformanceError] = useState<string | null>(null);

  const loadFinancial = useCallback(async () => {
    if (!token) return;
    setIsLoadingFinancial(true);
    setFinancialError(null);
    try {
      const data = await fetchAnalyticsFinancial(token, filters);
      setFinancial(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao carregar financeiro.';
      setFinancialError(message);
    } finally {
      setIsLoadingFinancial(false);
    }
  }, [filters, token]);

  const loadPerformance = useCallback(async () => {
    if (!token) return;
    setIsLoadingPerformance(true);
    setPerformanceError(null);
    try {
      const data = await fetchAnalyticsPerformance(token, filters);
      setPerformance(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao carregar desempenho.';
      setPerformanceError(message);
    } finally {
      setIsLoadingPerformance(false);
    }
  }, [filters, token]);

  const exportCsv = useCallback(async () => {
    if (!token) return;
    setIsExporting(true);
    try {
      await exportAnalyticsCsv(token, filters);
      showToast('CSV exportado com sucesso.', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao exportar CSV.';
      showToast(message, 'error');
    } finally {
      setIsExporting(false);
    }
  }, [filters, showToast, token]);

  const exportPdf = useCallback(async () => {
    if (!token) return;
    setIsExporting(true);
    try {
      await exportAnalyticsPdf(token, filters);
      showToast('PDF exportado com sucesso.', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao exportar PDF.';
      showToast(message, 'error');
    } finally {
      setIsExporting(false);
    }
  }, [filters, showToast, token]);

  return {
    filters,
    setFilters,
    financial,
    performance,
    isLoadingFinancial,
    isLoadingPerformance,
    isExporting,
    financialError,
    performanceError,
    loadFinancial,
    loadPerformance,
    exportCsv,
    exportPdf,
  };
};

