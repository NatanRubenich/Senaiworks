# SenaiWorks Store — Free-to-Play Edition

Loja pública de jogos do ecossistema **SenaiWorks**. Todos os jogos aprovados na plataforma SenaiWorks ficam automaticamente disponíveis aqui, **gratuitamente**.

> Identidade visual baseada no design system **Gamer-Editorial Standard** (`The Digital Curator`): tipografia editorial moderna (Space Grotesk + Manrope), camadas tonais sem bordas explícitas, glassmorphism nos heros e gradiente azul SENAI com o laranja vibrante como acento.

## Stack

- **React 18** + **React Router 6** (SPA)
- **Tailwind CSS** (design system customizado)
- **Framer Motion** (animações declarativas)
- **Axios** (chamadas HTTP)
- **Lucide React** + **Material Symbols** (ícones)

## Arquitetura MVC

```
store/src/
├── config/        → API client (Axios)
├── models/        → Camada de DADOS (services API)
│   ├── auth.model.js
│   ├── game.model.js
│   ├── review.model.js
│   └── library.model.js
├── controllers/   → Lógica e estado (Context/Hooks)
│   └── AuthContext.js
└── views/         → Apresentação
    ├── components/    → Header, Footer, GameCard, Layout
    └── pages/         → Login, Home, Catalog, GamePage, Profile
```

**Modelo MVC adaptado a React:**
- **Model** = `models/*.js` encapsulam comunicação com API e lógica de dados
- **Controller** = `controllers/*` (Contexts e hooks) gerenciam estado e regras
- **View** = `views/*` apenas renderiza, consumindo controllers

## Páginas

| Rota | Página | Descrição |
|------|--------|-----------|
| `/` | Home | Hero carousel rotativo · Destaques · Free-to-Play em Destaque · Categorias |
| `/catalogo` | Catálogo | Busca + filtros (gênero, ordenação) · Grid de jogos |
| `/jogo/:appId` | Página do Jogo | Hero · Galeria mídia · Descrição · **Sistema de avaliação** · Sticky info card · Download |
| `/perfil` | Perfil | Banner · Tabs: Biblioteca / Configurações |
| `/login` | Login/Register | Painel duplo (entrar / criar perfil) com pergunta de segurança |

## Sistema de Avaliação

- 1 review por usuário/jogo (upsert)
- Estrelas 1–5 + comentário opcional (até 1000 caracteres)
- Mostra média e contagem na página do jogo
- Usuário pode **editar ou remover** sua própria avaliação
- Login obrigatório para avaliar (CTAs redirecionam para `/login`)

## Biblioteca / Download

- Botão **Adicionar à Biblioteca** (grátis para qualquer usuário logado)
- Botão **Baixar Jogo** se há build disponível no backend
- Histórico de downloads e contagem por jogo
- Página de perfil mostra todos os jogos adquiridos (capsule 600×900)

## Integração com Backend

A loja consome o backend Express já existente em `../server/`. Foi adicionada uma rota pública dedicada:

```
GET    /api/store/games              → lista jogos aprovados (filtros: ?genre, ?search, ?sort)
GET    /api/store/games/featured     → hero + featured + new releases
GET    /api/store/games/:appId       → detalhes do jogo
GET    /api/store/games/:appId/reviews        → lista reviews + stats
POST   /api/store/games/:appId/reviews        → criar/atualizar review (auth)
DELETE /api/store/games/:appId/reviews/mine   → remover própria review (auth)
POST   /api/store/library/:appId              → adicionar à biblioteca (auth)
GET    /api/store/library                     → minha biblioteca (auth)
GET    /api/store/library/check/:appId        → verifica posse (auth)
GET    /api/store/download/:appId             → URL de download + registra (auth)
```

Apenas jogos com `status === "Aprovado"` são listados publicamente.

## Como Rodar

### Pré-requisitos
- Node.js 18+
- MongoDB rodando (local ou em memória — ver `../server/`)
- Backend SenaiWorks rodando em `http://localhost:5000`

### Instalação
```bash
cd store
npm install
```

### Desenvolvimento
```bash
npm start
```
Aplicação abre em **http://localhost:3001**.

> O `package.json` define `proxy: http://localhost:5000` para chamadas API durante o desenvolvimento.

### Variáveis de Ambiente
Crie `.env` na raiz de `store/` se quiser apontar para outro backend:
```
REACT_APP_API_URL=http://localhost:5000
```

### Build de Produção
```bash
npm run build
```

## Login

Use as mesmas credenciais do SenaiWorks:
- **Admin:** `administrador.senai@edu.sc.senai.br` / `Senaiworks_0412@`
- **Desenvolvedores:** qualquer e-mail `@edu.sc.senai.br` ou `@estudante.sesisenai.org.br` cadastrado

Novos usuários podem se registrar diretamente na tela de Login.

## Resoluções de Imagem (padrão Steam)

A loja respeita os tamanhos de upload definidos no SenaiWorks:

| Tipo | Dimensão | Uso na Loja |
|------|----------|-------------|
| Header Capsule | 460×215 | Cards horizontais |
| Small Capsule | 231×87 | Listas e busca |
| Main Capsule | 616×353 | Card de info do jogo |
| Vertical Capsule | 374×448 | Grid de destaques |
| Library Capsule | 600×900 | Biblioteca do perfil |
| Library Hero | 1920×620–1240 | Hero da página do jogo |
| Library Logo | 1280×720 | Sobre o hero (PNG transparente) |
| Screenshots | 1920×1080+ (16:9) | Galeria |

Quando uma imagem está ausente, fallback gradiente azul SENAI é exibido.

## Desenvolvimento

```bash
# Backend (em outro terminal)
cd ../server && npm run dev

# Loja (este projeto)
cd store && npm start

# SenaiWorks (painel admin/dev — opcional)
cd ../client && npm start
```

---

**SENAI/SC — 2026** · A excelência em Publicação Didática Digital de Games
