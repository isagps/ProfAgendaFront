# ProfAgenda - Frontend

**ProfAgenda** é a interface frontend desenvolvida em **Angular** para complementar a API backend da ProfAgenda, criada em Flask. Esta aplicação visa proporcionar uma experiência de usuário intuitiva e eficiente para a gestão dos horários dos professores da Escola Estadual Jorge Duprat Figueiredo, localizada no bairro Jardim Santa Terezinha, zona leste de São Paulo. Com ela, usuários podem criar, atualizar, listar e excluir compromissos, além de gerenciar os horários de trabalho de professores e turmas de forma visual e interativa.

Este projeto faz parte de um **Trabalho de Extensão de Curso** apresentado à **Universidade Estácio de Sá de São Paulo**, como parte dos requisitos para obtenção do título de **Tecnólogo em Análise e Desenvolvimento de Sistemas**.

**Orientador**: Prof. Me. Robson Lorbieski

## Contexto Social

A aplicação frontend da ProfAgenda tem como objetivo beneficiar a comunidade do Jardim Santa Terezinha, na zona leste de São Paulo, ao oferecer uma ferramenta que aprimora a gestão das atividades escolares. Isso contribui para o melhor desempenho e bem-estar de professores, alunos e gestores da escola, promovendo uma organização eficiente das tarefas diárias.

## Arquitetura do Projeto

O projeto segue uma arquitetura **cliente-servidor**, onde:

- **Frontend**: Desenvolvido em **TypeScript** utilizando o framework **Angular**. O frontend consome a API REST fornecida pelo backend em Flask e oferece uma interface amigável e responsiva para os usuários interagirem com o sistema.

## Requisitos

Antes de começar, certifique-se de que seu ambiente atenda aos seguintes requisitos:

- **Node.js**: Versão 18.x ou superior
- **npm**: Versão 10.x ou superior (gerenciador de pacotes do Node.js)
- **Angular CLI**: Versão 18.x ou superior

## Frontend do Projeto

Este repositório contém o frontend da ProfAgenda. Para acessar o backend, consulte o [Backend ProfAgenda](https://github.com/seu-usuario/profAgenda.git).

## Instruções de Instalação

Siga os passos abaixo para configurar e rodar o frontend do projeto em sua máquina local.

### 1. Clonando o Repositório

Clone o repositório do frontend do projeto e navegue até o diretório raiz:

```bash
git clone https://github.com/seu-usuario/profAgenda-frontend.git
cd profAgenda-frontend
```

### 2. Instalando as Dependências

Instale as dependências do projeto utilizando o **npm**:

```bash
npm install
```

### 3. Executando o Projeto

Para rodar o servidor de desenvolvimento do Angular, utilize o seguinte comando:

```bash
ng serve
```

A aplicação estará disponível em:

```
http://localhost:4200
```

## Estrutura do Projeto

A seguir, uma visão geral da estrutura do projeto frontend com comentários detalhados sobre cada pasta e arquivo:

<details>
  <summary><strong>Estrutura do Projeto</strong></summary>
  <pre>
profAgenda-frontend/
│
├── src/                                     # Diretório principal do código fonte
│   ├── app/                                 # Módulo principal da aplicação
│   │   ├── infrastructure/                 # Componentes de infraestrutura reutilizáveis
│   │   │   ├── base-create.ts              # Classe base para componentes de criação
│   │   │   ├── base-edit.ts                # Classe base para componentes de edição
│   │   │   ├── base-list.ts                # Classe base para componentes de listagem
│   │   │   ├── base-model.ts               # Modelo base para entidades
│   │   │   ├── base-service.ts             # Serviço base para operações CRUD
│   │   │   └── base-view.ts                # Classe base para componentes de visualização
│   │   ├── model/                           # Modelos de dados da aplicação
│   │   │   ├── horario.model.ts             # Modelo para Horário
│   │   │   ├── materia.model.ts             # Modelo para Matéria
│   │   │   ├── page.model.ts                # Modelo para Paginação
│   │   │   ├── professor.model.ts           # Modelo para Professor
│   │   │   └── turma.model.ts               # Modelo para Turma
│   │   ├── page/                            # Módulos de páginas específicas
│   │   │   ├── dashboard/                   # Página de dashboard
│   │   │   │   ├── dashboard.component.html # Template HTML do Dashboard
│   │   │   │   ├── dashboard.component.scss # Estilos SCSS do Dashboard
│   │   │   │   └── dashboard.component.ts   # Lógica TypeScript do Dashboard
│   │   │   ├── materia/                     # Módulo para gerenciamento de Matérias
│   │   │   │   ├── materia-create/          # Componente de criação de Matérias
│   │   │   │   │   ├── materia-create.component.html
│   │   │   │   │   └── materia-create.component.ts
│   │   │   │   ├── materia-edit/            # Componente de edição de Matérias
│   │   │   │   │   ├── materia-edit.component.html
│   │   │   │   │   └── materia-edit.component.ts
│   │   │   │   ├── materia-list/            # Componente de listagem de Matérias
│   │   │   │   │   ├── materia-list.component.html
│   │   │   │   │   └── materia-list.component.ts
│   │   │   │   ├── materia-view/            # Componente de visualização de Matérias
│   │   │   │   │   ├── materia-view.component.html
│   │   │   │   │   └── materia-view.component.ts
│   │   │   ├── professor/                   # Módulo para gerenciamento de Professores
│   │   │   │   ├── professor-create/
│   │   │   │   │   ├── professor-create.component.html
│   │   │   │   │   └── professor-create.component.ts
│   │   │   │   ├── professor-edit/
│   │   │   │   │   ├── professor-edit.component.html
│   │   │   │   │   └── professor-edit.component.ts
│   │   │   │   ├── professor-list/
│   │   │   │   │   ├── professor-list.component.html
│   │   │   │   │   └── professor-list.component.ts
│   │   │   │   ├── professor-view/
│   │   │   │   │   ├── professor-view.component.html
│   │   │   │   │   └── professor-view.component.ts
│   │   │   ├── turma/                       # Módulo para gerenciamento de Turmas
│   │   │   │   ├── turma-create/            # Componente de criação de Turmas
│   │   │   │   ├── turma-edit/              # Componente de edição de Turmas
│   │   │   │   ├── turma-list/              # Componente de listagem de Turmas
│   │   │   │   └── turma-view/              # Componente de visualização de Turmas
│   │   ├── service/                          # Serviços de comunicação com a API
│   │   │   ├── horario.service.ts            # Serviço para Horários
│   │   │   ├── materia.service.ts            # Serviço para Matérias
│   │   │   ├── professor.service.ts          # Serviço para Professores
│   │   │   └── turma.service.ts              # Serviço para Turmas
│   │   ├── shared/                           # Componentes e utilitários compartilhados
│   │   │   ├── components/                   # Componentes reutilizáveis
│   │   │   │   ├── bradcrumb/                # Componente de Breadcrumb
│   │   │   │   │   ├── model/                 # Modelos para Breadcrumb
│   │   │   │   │   │   ├── breadcrumb-config.model.ts
│   │   │   │   │   │   └── breadcrumb-item.model.ts
│   │   │   │   │   ├── breadcrumb.component.html
│   │   │   │   │   ├── breadcrumb.component.scss
│   │   │   │   │   ├── breadcrumb.component.ts
│   │   │   │   │   └── breadcrumb.service.ts
│   │   │   │   ├── confirm-dialog/           # Componente de Diálogo de Confirmação
│   │   │   │   │   ├── model/                 # Modelos para Confirm Dialog
│   │   │   │   │   │   └── confirm-dialog-type.model.ts
│   │   │   │   │   ├── confirm-dialog.component.html
│   │   │   │   │   ├── confirm-dialog.component.scss
│   │   │   │   │   ├── confirm-dialog.component.ts
│   │   │   │   │   └── confirm-dialog.service.ts
│   │   │   │   ├── data-form/                # Componente de Formulário de Dados
│   │   │   │   │   ├── data-form.component.html
│   │   │   │   │   └── data-form.component.ts
│   │   │   │   ├── data-table/               # Componente de Tabela de Dados
│   │   │   │   │   ├── data-table.component.html
│   │   │   │   │   ├── data-table.component.scss
│   │   │   │   │   └── data-table.component.ts
│   │   │   │   ├── notification/             # Componente de Notificações
│   │   │   │   │   ├── model/                 # Modelos para Notificações
│   │   │   │   │   │   ├── notification-type.model.ts
│   │   │   │   │   │   └── notification.model.ts
│   │   │   │   │   ├── notification.component.html
│   │   │   │   │   ├── notification.component.scss
│   │   │   │   │   ├── notification.component.ts
│   │   │   │   │   └── notification.service.ts
│   │   │   │   ├── panel/                    # Componente de Painel
│   │   │   │   │   ├── panel.component.html
│   │   │   │   │   ├── panel.component.scss
│   │   │   │   │   └── panel.component.ts
│   │   │   │   ├── sidebar/                  # Componente de Barra Lateral (Sidebar)
│   │   │   │   │   ├── models/                  # Modelos para Sidebar
│   │   │   │   │   │   ├── sidebar-config.model.ts
│   │   │   │   │   │   └── sidebar-item.model.ts
│   │   │   │   │   ├── sidebar.component.html
│   │   │   │   │   ├── sidebar.component.scss
│   │   │   │   │   ├── sidebar.component.ts
│   │   │   │   │   └── sidebar.service.ts
│   │   │   │   ├── table-filter/             # Componente de Filtro de Tabela
│   │   │   │   │   ├── table-filter.component.html
│   │   │   │   │   ├── table-filter.component.scss
│   │   │   │   │   └── table-filter.component.ts
│   │   │   │   ├── table-pagination/         # Componente de Paginação de Tabela
│   │   │   │   │   ├── table-pagination.component.html
│   │   │   │   │   ├── table-pagination.component.scss
│   │   │   │   │   └── table-pagination.component.ts
│   │   │   ├── directive/                    # Diretivas personalizadas
│   │   │   │   ├── show-error.directive.ts    # Diretiva para exibição de erros
│   │   │   │   └── time-mask.directive.ts     # Diretiva para máscara de tempo
│   │   │   ├── pipe/                         # Pipes personalizados
│   │   │   │   ├── filter-control.pipe.ts     # Pipe para controle de filtro
│   │   │   │   └── title-label.pipe.ts        # Pipe para formatação de títulos
│   │   │   └── util/                         # Utilitários e funções auxiliares
│   │   │       ├── config.utils.ts            # Utilitário para configurações
│   │   │       ├── input.utils.ts             # Utilitário para manipulação de inputs
│   │   │       ├── link.utils.ts              # Utilitário para geração de links
│   │   │       └── table.utils.ts             # Utilitário para funcionalidades de tabela
│   │   ├── app.component.html                 # Template principal da aplicação
│   │   ├── app.component.scss                 # Estilos globais do componente principal
│   │   ├── app.component.ts                   # Lógica do componente principal
│   │   ├── app.config.server.ts               # Configurações específicas para o servidor
│   │   ├── app.config.ts                      # Configurações gerais da aplicação
│   │   ├── app.routes.ts                      # Definição das rotas da aplicação
│   ├── assets/                                # Arquivos estáticos da aplicação
│   │   ├── icon.png                           # Ícone da aplicação
│   │   └── logo.png                           # Logo da aplicação
│   ├── index.html                             # Página HTML principal
│   ├── main.server.ts                         # Ponto de entrada para o servidor (SSR)
│   ├── main.ts                                # Ponto de entrada para o cliente
│   ├── styles.functions.scss                  # Funções SCSS reutilizáveis
│   ├── styles.scss                            # Estilos globais da aplicação
│   └── styles.variables.scss                  # Variáveis SCSS para temas e cores
├── .editorconfig                              # Configurações de editor de código
├── .gitignore                                 # Arquivos e pastas ignorados pelo Git
├── angular.json                               # Configurações do Angular CLI
├── package-lock.json                          # Lockfile do npm para dependências exatas
├── package.json                               # Arquivo de configuração do npm com dependências e scripts
├── README.md                                  # Este manual de instalação e informações do projeto
├── server.ts                                  # Configuração do servidor (se aplicável)
├── tsconfig.app.json                           # Configurações do TypeScript para a aplicação
├── tsconfig.json                              # Configurações gerais do TypeScript
└── tsconfig.spec.json                         # Configurações do TypeScript para testes
  </pre>
</details>

## Dependências do Projeto

As principais dependências do projeto incluem:

- [Angular](https://angular.io/) - Framework frontend.
- [TypeScript](https://www.typescriptlang.org/) - Superset do JavaScript para tipagem estática.
- [RxJS](https://rxjs.dev/) - Biblioteca para programação reativa.
- [Angular Material](https://material.angular.io/) - Componentes UI para Angular.
- [ngx-bootstrap](https://valor-software.com/ngx-bootstrap/) - Componentes Bootstrap para Angular.
- [NgRx](https://ngrx.io/) - Gerenciamento de estado para Angular (se aplicável).

Outras dependências específicas podem ser encontradas no arquivo `package.json`.

## Autor

- **Isabel Gomes Prado da Silva** - Desenvolvedora