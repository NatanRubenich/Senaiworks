# SenaiWorks — Simulador de Steamworks

Plataforma didática simulada, inspirada no **Steamworks** (Valve), desenvolvida para fins educacionais dentro do ecossistema SENAI/SESI. Permite que alunos aprendam o processo completo de publicação de um jogo digital.

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 18, React Router, Axios, React Quill, Lucide React |
| **Backend** | Node.js, Express, JWT, bcrypt, Multer |
| **Banco de Dados** | MongoDB (Mongoose ODM) |
| **Arquitetura** | MVC (Model-View-Controller) |

## Estrutura do Projeto

```
Senaiworks/
├── client/                 # Frontend React (View)
│   ├── public/
│   └── src/
│       ├── components/     # Componentes reutilizáveis (Layout)
│       ├── config/         # Constantes de validação (client-side)
│       ├── contexts/       # AuthContext (estado global)
│       ├── pages/          # Páginas organizadas por módulo
│       │   ├── auth/       # Login, Registro, Onboarding, Taxa
│       │   ├── dashboard/  # Painel do desenvolvedor
│       │   ├── store/      # Módulo B — Página da Loja (tabs/)
│       │   ├── config/     # Módulo C — Configuração do Jogo (tabs/)
│       │   └── admin/      # Módulo D — Painel do Administrador
│       ├── services/       # API client (Axios)
│       └── styles/         # CSS global (Steamworks theme)
│
├── server/                 # Backend Node.js (Model + Controller)
│   └── src/
│       ├── config/         # Constantes, database connection
│       ├── controllers/    # Controllers (lógica de negócio)
│       ├── middleware/     # Auth JWT, Upload (Multer)
│       ├── models/         # Mongoose Models (User, Game)
│       ├── routes/         # Express Routes
│       └── server.js       # Entry point
│
├── breafing/               # Imagens de referência e ícones
└── RF_RNF.md              # Documento de requisitos
```

## Pré-requisitos

- **Node.js** 18+ e **npm**
- **MongoDB** (local ou Atlas)

## Instalação e Execução

### 1. Backend

```bash
cd server
npm install
# Edite o .env com sua URI do MongoDB
npm run dev
```

O servidor iniciará na porta **5000**.

### 2. Frontend

```bash
cd client
npm install
npm start
```

O frontend iniciará na porta **3000** com proxy para o backend.

## Conta de Administrador

A conta de administrador é criada automaticamente ao iniciar o servidor:

- **E-mail:** `administrador.senai@edu.sc.senai.br`
- **Senha:** `Senaiworks_0412@`

## Módulos

### Módulo A — Cadastro e Acesso
- Login/Registro com validação de domínio institucional
- Pergunta de segurança para recuperação de senha
- Dados de identidade, fiscais e bancários (simulados)
- Taxa de publicação simulada ($100 USD)

### Módulo B — Administração da Página da Loja
- Dados básicos (nome, gênero, idiomas)
- Descrição com editor rich text
- Recursos gráficos (capsules com validação pixel-perfect)
- Screenshots (mín. 5, 16:9, 1920×1080)
- Recursos da biblioteca (com verificação de overlay)
- Trailers
- Publicação da página da loja

### Módulo C — Configuração do Jogo (SteamPipe)
- Configurações gerais do aplicativo (OS, visibilidade)
- Upload de depots via HTTP (.zip)
- Gerenciamento de depots e idiomas
- Configurações de instalação (executável, opções de lançamento)
- Publicação das configurações

### Módulo D — Painel do Administrador
- Lista de jogos submetidos com filtros
- Visualização completa de dados (Módulos B e C)
- Aprovação/Reprovação com motivo obrigatório
- Histórico de revisões

## Design

O design segue fielmente o **Steamworks** (`partner.steamgames.com`):
- Dark theme com fundo `#1b2838`
- Navegação superior escura
- Abas horizontais com destaque azul
- Tipografia clara sobre fundo escuro
- Títulos de seção em azul claro `#66c0f4`
- Botões de ação em azul Steam

## Deploy

| Componente | Plataforma |
|-----------|-----------|
| Frontend | GitHub Pages |
| Backend | Koyeb (Eco Instance) |
| Banco de Dados | MongoDB Atlas (M0) |

## Licença

Projeto educacional — SENAI/SESI.
