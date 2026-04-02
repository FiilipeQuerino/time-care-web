# TimeCare - Sistema de Gestão para Clínica de Estética

O **TimeCare** é uma aplicação web moderna, desenvolvida com foco total em dispositivos móveis (**mobile-first**), projetada especificamente para atender às necessidades de gestão de uma **clínica de estética de alto padrão**. O sistema combina elegância visual com funcionalidade robusta para oferecer uma experiência premium tanto para administradores quanto para profissionais da saúde e beleza.

## 🎯 Objetivo do Projeto

O projeto visa centralizar a gestão da clínica em uma interface sofisticada e intuitiva. O nome "TimeCare" reflete o compromisso com a gestão eficiente do tempo e o cuidado humanizado com o cliente.

### Funcionalidades Iniciais:
- **Autenticação Segura**: Tela de login com validações e animações fluidas.
- **Dashboard Inteligente**: Visão geral da clínica com indicadores de performance (KPIs).
- **Navegação Adaptativa**: Menu inferior para celulares e barra lateral para tablets/desktops.
- **Gestão de Identidade**: Perfil de usuário com avatares dinâmicos.
- **Estrutura para Expansão**: Menus preparados para Clientes, Agenda, Estoque, Relatórios e Configurações.

## 🎨 Design e Experiência do Usuário (UX/UI)

- **Tema Rosa Moderno**: Uma paleta sofisticada baseada em tons de Pink e Rose, ideal para o setor de estética, transmitindo cuidado, modernidade e profissionalismo.
- **Interface Limpa**: Uso estratégico de espaços em branco e sombras suaves para reduzir a carga cognitiva.
- **Animações Fluidas**: Transições de tela e microinterações em botões e inputs utilizando `motion`.
- **Responsividade Total**: Layout que se adapta perfeitamente de um smartphone a um tablet de 12 polegadas.

## 🏗️ Estrutura do Projeto

A arquitetura foi pensada para ser escalável e de fácil manutenção, seguindo as melhores práticas de desenvolvimento React:

```text
src/
├── components/       # Componentes de interface reutilizáveis
│   ├── ui/           # Átomos de UI (Botões, Inputs, etc)
│   └── StatCard.tsx  # Cards de indicadores do Dashboard
├── context/          # Provedores de estado global (Autenticação)
├── hooks/            # Hooks customizados para lógica de negócio
├── pages/            # Telas principais da aplicação
│   ├── LoginPage.tsx
│   └── DashboardPage.tsx
├── styles/           # Definições de tema e estilos globais
├── types/            # Interfaces e tipos TypeScript
└── utils/            # Funções utilitárias e helpers
```

## 🚀 Tecnologias Utilizadas

- **React 19**: Biblioteca principal para construção da interface.
- **TypeScript**: Garantia de código tipado e menos bugs em produção.
- **Tailwind CSS 4**: Estilização rápida, moderna e altamente customizável.
- **Motion (Framer Motion)**: Motor de animações para transições premium.
- **Lucide React**: Biblioteca de ícones vetoriais leves e elegantes.
- **Context API**: Gerenciamento de estado de autenticação sem bibliotecas externas pesadas.

## 🛠️ Como Expandir

O projeto foi entregue como uma base sólida ("Boilerplate Premium"). Para evoluir o sistema:

1. **Implementar Rotas**: Adicionar `react-router-dom` para navegar entre as páginas de Clientes, Agenda, etc.
2. **Conectar ao Backend**: Integrar com Firebase ou uma API REST nos serviços de `AuthContext`.
3. **Novas Telas**: Criar os arquivos correspondentes em `src/pages/` seguindo o padrão visual estabelecido no Dashboard.

---
*Desenvolvido como um protótipo de alta fidelidade para a TimeCare - Estética & Bem-estar.*
