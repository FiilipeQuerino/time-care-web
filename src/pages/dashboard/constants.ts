import {
  Activity,
  BarChart3,
  Calendar,
  CalendarCheck2,
  DollarSign,
  LayoutDashboard,
  LucideIcon,
  Scissors,
  Settings,
  TrendingUp,
  Users,
  Package,
} from 'lucide-react';
import { MenuSection } from '../../types/navigation';
import { ClientStatusFilter, ReportCategory, ReportDefinition, ReportPeriod } from './types';

export const navItems: Array<{ id: MenuSection; label: string; icon: LucideIcon }> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clientes', label: 'Clientes', icon: Users },
  { id: 'procedimentos', label: 'Procedimentos', icon: Scissors },
  { id: 'agenda', label: 'Agenda', icon: Calendar },
  { id: 'estoque', label: 'Estoque', icon: Package },
  { id: 'relatorios', label: 'Relatorios', icon: BarChart3 },
  { id: 'config', label: 'Config', icon: Settings },
];

export const clientStatusOptions: Array<{ value: ClientStatusFilter; label: string; helper: string }> = [
  { value: 'all', label: 'Todos os status', helper: 'Exibe todos os clientes' },
  { value: 'active', label: 'Somente ativos', helper: 'Clientes com cadastro ativo' },
  { value: 'inactive', label: 'Somente inativos', helper: 'Clientes com cadastro pausado' },
];

export const reportPeriodOptions: Array<{ value: ReportPeriod; label: string }> = [
  { value: 'today', label: 'Hoje' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  { value: 'quarter', label: 'Trimestre' },
  { value: 'year', label: 'Ano' },
  { value: 'custom', label: 'Personalizado' },
];

export const reportStatusOptions = [
  'Todos',
  'Concluido',
  'Confirmado',
  'Pendente',
  'Cancelado',
  'Nao compareceu',
];

export const reportLeadSourceOptions = ['Todas', 'Instagram', 'WhatsApp', 'Indicacao', 'Google', 'Site'];

export const reportCategoryMeta: Record<ReportCategory, { label: string; icon: LucideIcon; chipClass: string }> = {
  financeiro: {
    label: 'Financeiro',
    icon: DollarSign,
    chipClass: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  clientes: {
    label: 'Clientes',
    icon: Users,
    chipClass: 'border-sky-200 bg-sky-50 text-sky-700',
  },
  procedimentos: {
    label: 'Procedimentos',
    icon: Scissors,
    chipClass: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700',
  },
  agenda: {
    label: 'Agenda e comparecimento',
    icon: CalendarCheck2,
    chipClass: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  },
  comercial: {
    label: 'Comercial e conversao',
    icon: TrendingUp,
    chipClass: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  performance: {
    label: 'Performance geral',
    icon: Activity,
    chipClass: 'border-slate-200 bg-slate-100 text-slate-700',
  },
};

export const reportDefinitions: ReportDefinition[] = [
  { id: 'consumo-mes', title: 'Consumo do mes', description: 'Consumo consolidado de servicos e receita por cliente.', category: 'financeiro' },
  { id: 'faturamento-periodo', title: 'Faturamento por periodo', description: 'Evolucao financeira com comparacao por intervalo.', category: 'financeiro' },
  { id: 'faturamento-procedimento', title: 'Faturamento por procedimento', description: 'Receita segmentada por servico e ticket associado.', category: 'financeiro' },
  { id: 'faturamento-profissional', title: 'Faturamento por profissional', description: 'Performance financeira por colaborador responsavel.', category: 'financeiro' },
  { id: 'ticket-periodo', title: 'Ticket medio por periodo', description: 'Analise de valor medio por atendimento em cada recorte.', category: 'financeiro' },
  { id: 'financeiro-resumido', title: 'Relatorio financeiro resumido', description: 'Visao executiva de entradas, saidas e saldo projetado.', category: 'financeiro' },
  { id: 'financeiro-detalhado', title: 'Relatorio financeiro detalhado', description: 'Consolidado completo com detalhamento de transacoes.', category: 'financeiro' },
  { id: 'recebimentos-periodo', title: 'Recebimentos por periodo', description: 'Fluxo de recebimentos por faixa de datas e status.', category: 'financeiro' },
  { id: 'pendencias-aberto', title: 'Pendencias / valores em aberto', description: 'Controle de valores pendentes e risco de inadimplencia.', category: 'financeiro' },
  { id: 'top-clientes-mes', title: 'Top clientes do mes', description: 'Clientes com maior consumo no ciclo mensal atual.', category: 'clientes' },
  { id: 'top-clientes-trimestre', title: 'Top clientes do trimestre', description: 'Ranking trimestral dos clientes com maior receita.', category: 'clientes' },
  { id: 'clientes-ano', title: 'Clientes que mais gastaram no ano', description: 'Concentracao de faturamento por cliente no ano vigente.', category: 'clientes' },
  { id: 'clientes-inativos', title: 'Clientes inativos', description: 'Base sem retorno recente para acao de reativacao.', category: 'clientes' },
  { id: 'clientes-recorrentes', title: 'Clientes recorrentes', description: 'Clientes com frequencia e recorrencia acima da media.', category: 'clientes' },
  { id: 'novos-clientes-periodo', title: 'Novos clientes por periodo', description: 'Aquisicao de novos clientes por recorte temporal.', category: 'clientes' },
  { id: 'retorno-clientes', title: 'Retorno de clientes', description: 'Tempo medio de retorno e volume de visitas subsequentes.', category: 'clientes' },
  { id: 'recompra-cliente', title: 'Recompra por cliente', description: 'Taxa de recompra e potencial de LTV da carteira.', category: 'clientes' },
  { id: 'procedimentos-semana', title: 'Procedimentos mais realizados da semana', description: 'Servicos com maior demanda no recorte semanal.', category: 'procedimentos' },
  { id: 'procedimentos-mes', title: 'Procedimentos mais realizados do mes', description: 'Ranking mensal de execucao por procedimento.', category: 'procedimentos' },
  { id: 'procedimentos-ano', title: 'Procedimentos mais realizados do ano', description: 'Historico anual dos servicos mais frequentes.', category: 'procedimentos' },
  { id: 'procedimentos-faturamento', title: 'Procedimentos com maior faturamento', description: 'Procedimentos lideres em receita e margem.', category: 'procedimentos' },
  { id: 'vendas-categoria', title: 'Vendas por categoria de procedimento', description: 'Faturamento por categoria para orientar estrategia.', category: 'procedimentos' },
  { id: 'agenda-comparecimento', title: 'Agenda x comparecimento', description: 'Confronta agendados, realizados, faltas e presencas.', category: 'agenda' },
  { id: 'faltas-cancelamentos', title: 'Taxa de faltas e cancelamentos', description: 'Mapeia perdas operacionais por ausencias e cancelamentos.', category: 'agenda' },
  { id: 'horarios-movimentados', title: 'Horarios mais movimentados', description: 'Faixas horarias com maior ocupacao e demanda.', category: 'agenda' },
  { id: 'dias-maior-volume', title: 'Dias da semana com maior volume', description: 'Dias com maior fluxo para ajuste de agenda e equipe.', category: 'agenda' },
  { id: 'conversao-leads', title: 'Conversao de leads para clientes', description: 'Taxa de conversao por origem de lead e periodo.', category: 'comercial' },
  { id: 'desempenho-mensal', title: 'Desempenho mensal da clinica', description: 'Acompanha indicadores chave em ciclo mensal.', category: 'performance' },
  { id: 'comparativo-mes', title: 'Comparativo mes atual vs mes anterior', description: 'Compara crescimento de receita, agenda e conversao.', category: 'performance' },
  { id: 'comparativo-periodos', title: 'Comparativo por semana, mes e ano', description: 'Visao consolidada de tendencia em multiplos horizontes.', category: 'performance' },
  { id: 'desempenho-geral', title: 'Relatorio de desempenho geral da clinica', description: 'Painel consolidado com financeiro, operacao e comercial.', category: 'performance' },
];
