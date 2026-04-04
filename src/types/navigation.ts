export type MenuSection =
  | 'dashboard'
  | 'clientes'
  | 'procedimentos'
  | 'agenda'
  | 'estoque'
  | 'relatorios'
  | 'config';

export interface NavigationItem {
  id: MenuSection;
  label: string;
}
