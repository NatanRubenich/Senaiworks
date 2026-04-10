# Relatório de Estrutura do Banco de Dados — SenaiWorks

> **Data:** Abril/2026  
> **Banco:** MongoDB (via Mongoose ODM)  
> **Modo atual:** MongoDB Memory Server (em memória, sem persistência)  
> **Objetivo:** Documentar a estrutura de dados para o desenvolvedor front-end da loja pública.

---

## 1. Visão Geral

O banco de dados possui **2 coleções (collections)** principais:

| Collection | Model    | Descrição                                      |
|------------|----------|-------------------------------------------------|
| `users`    | `User`   | Desenvolvedores e administradores da plataforma |
| `games`    | `Game`   | Jogos cadastrados e seus dados de loja/config   |

### Relacionamento

```
User (1) ──────── (N) Game
      developer ◄──── game.developer (ObjectId → User._id)
```

Um usuário (developer) pode ter vários jogos. Cada jogo pertence a um único developer.

---

## 2. Collection: `users`

### Campos principais

| Campo                | Tipo     | Descrição                                    |
|----------------------|----------|----------------------------------------------|
| `_id`                | ObjectId | Identificador único (gerado pelo MongoDB)    |
| `email`              | String   | E-mail do usuário (único, obrigatório)       |
| `password`           | String   | Senha (hash bcrypt, nunca exposta)           |
| `role`               | String   | `"developer"` ou `"admin"`                   |
| `securityQuestion`   | String   | Pergunta de segurança                        |
| `securityAnswer`     | String   | Resposta da pergunta de segurança            |
| `createdAt`          | Date     | Data de criação                              |
| `updatedAt`          | Date     | Data da última atualização                   |

### Sub-objeto: `identity` (Identidade do Desenvolvedor)

| Campo                | Tipo   | Descrição                          |
|----------------------|--------|------------------------------------|
| `legalName`          | String | Nome legal / razão social          |
| `fullAddress`        | String | Endereço completo                  |
| `accountType`        | String | `"Pessoa Física"` ou `"Pessoa Jurídica"` |
| `tradeName`          | String | Nome fantasia (PJ)                 |
| `cnpj`               | String | CNPJ (PJ)                         |
| `legalRepresentative`| String | Representante legal (PJ)           |
| `position`           | String | Cargo do representante (PJ)        |

### Sub-objeto: `taxInfo` (Informações Fiscais)

| Campo     | Tipo   | Descrição             |
|-----------|--------|-----------------------|
| `country` | String | País (default: Brasil)|
| `tin`     | String | CPF/CNPJ fiscal       |

### Sub-objeto: `bankInfo` (Dados Bancários)

| Campo          | Tipo   | Descrição          |
|----------------|--------|--------------------|
| `bankName`     | String | Nome do banco      |
| `swiftCode`    | String | Código SWIFT       |
| `accountNumber`| String | Número da conta    |

### Flags de controle

| Campo              | Tipo    | Descrição                          |
|--------------------|---------|------------------------------------|
| `feePaid`          | Boolean | Taxa de publicação paga            |
| `identityCompleted`| Boolean | Identidade preenchida              |
| `taxCompleted`     | Boolean | Dados fiscais preenchidos          |
| `bankCompleted`    | Boolean | Dados bancários preenchidos        |
| `loginAttempts`    | Number  | Tentativas de login falhas         |
| `lockUntil`        | Date    | Conta bloqueada até esta data      |

---

## 3. Collection: `games`

### Campos raiz

| Campo              | Tipo     | Descrição                                         |
|--------------------|----------|---------------------------------------------------|
| `_id`              | ObjectId | Identificador único do jogo                       |
| `developer`        | ObjectId | Referência ao `User` dono do jogo                 |
| `appId`            | Number   | ID numérico único do app (auto-gerado, ex: 3258960) |
| `status`           | String   | Status do jogo (ver tabela abaixo)                |
| `storePublished`   | Boolean  | Loja foi submetida para análise                   |
| `storeSubmittedAt` | Date     | Data da submissão da loja                         |
| `configPublished`  | Boolean  | Config foi submetida para análise                 |
| `configSubmittedAt`| Date     | Data da submissão da config                       |
| `createdAt`        | Date     | Data de criação                                   |
| `updatedAt`        | Date     | Data da última atualização                        |

### Valores possíveis de `status`

| Valor               | Significado                                  |
|----------------------|----------------------------------------------|
| `Rascunho`           | Jogo em edição, não submetido                |
| `Loja em Revisão`    | Só a loja foi submetida                      |
| `Config em Revisão`  | Só a config foi submetida                    |
| `Em Análise`         | Loja + Config submetidos, aguardando admin   |
| `Aprovado`           | Aprovado pelo administrador                  |
| `Reprovado`          | Reprovado pelo administrador                 |

---

### 3.1 — `basicData` (Dados Básicos do Jogo)

> **Relevância para a loja pública:** ⭐⭐⭐ ALTA — Informações essenciais exibidas na página do jogo.

| Campo           | Tipo     | Descrição                                     | Exemplo                   |
|-----------------|----------|-----------------------------------------------|---------------------------|
| `gameName`      | String   | Nome do jogo                                  | `"Meu Jogo SENAI"`       |
| `appType`       | String   | Tipo de aplicativo                            | `"Game"`                  |
| `developerName` | String   | Nome do desenvolvedor (exibição)              | `"Studio SENAI"`          |
| `publisherName` | String   | Nome do publicador                            | `"SENAI SC"`              |
| `genres`        | [String] | Lista de gêneros                              | `["Ação", "Aventura"]`   |
| `tags`          | String   | Tags separadas por vírgula                    | `"indie, 2D, pixel art"`  |
| `languages`     | [String] | Idiomas suportados                            | `["Português", "Inglês"]`|

---

### 3.2 — `description` (Descrição do Jogo)

> **Relevância para a loja pública:** ⭐⭐⭐ ALTA — Texto principal da página do jogo.

| Campo                 | Tipo     | Descrição                            |
|-----------------------|----------|--------------------------------------|
| `longDescription`     | String   | Descrição longa (suporta HTML/rich text) |
| `shortDescription`    | String   | Descrição curta (máx. 300 caracteres)|
| `descriptionLanguage` | String   | Idioma da descrição                  |
| `reviews`             | [Object] | Reviews/citações da imprensa         |
| `awards`              | [Object] | Prêmios recebidos                    |
| `specialAnnouncements`| [Object] | Anúncios especiais                   |

**Estrutura de `reviews`:**
```json
{ "source": "Jornal X", "text": "Jogo incrível!", "link": "https://..." }
```

**Estrutura de `awards`:**
```json
{ "title": "Melhor Jogo Indie 2026", "description": "Premiado no evento Y" }
```

---

### 3.3 — `storeGraphics` (Imagens da Loja)

> **Relevância para a loja pública:** ⭐⭐⭐ ALTA — Imagens de capa/capsule exibidas na loja.

| Campo            | Tipo   | Dimensões obrigatórias | Uso na loja                        |
|------------------|--------|------------------------|------------------------------------|
| `headerCapsule`  | Object | 460×215 px             | Banner horizontal (listagem)       |
| `smallCapsule`   | Object | 231×87 px              | Miniatura (carrossel, busca)       |
| `mainCapsule`    | Object | 616×353 px             | Capa principal da página do jogo   |
| `verticalCapsule`| Object | 374×448 px             | Card vertical (destaque, grid)     |

Cada capsule tem:
```json
{ "url": "/uploads/games/{id}/images/arquivo.jpg", "validated": true }
```

| Campo extras     | Tipo    | Descrição                          |
|------------------|---------|------------------------------------|
| `isTemporary`    | Boolean | Imagem temporária (evento/promoção)|
| `tempStartDate`  | Date    | Início da vigência temporária      |
| `tempEndDate`    | Date    | Fim da vigência temporária         |

---

### 3.4 — `screenshots` (Capturas de Tela)

> **Relevância para a loja pública:** ⭐⭐⭐ ALTA — Galeria/carrossel da página do jogo.

Array de screenshots. Mínimo obrigatório: **5 screenshots**.

| Campo            | Tipo   | Descrição                          |
|------------------|--------|------------------------------------|
| `_id`            | ObjectId | ID da screenshot                 |
| `url`            | String | Caminho da imagem no servidor      |
| `altText`        | String | Texto alternativo (acessibilidade) |
| `ageAppropriate` | Boolean| Apropriada para todas as idades    |
| `order`          | Number | Ordem de exibição no carrossel     |
| `translations`   | Map    | Versões traduzidas (idioma → URL)  |

---

### 3.5 — `libraryAssets` (Recursos da Biblioteca)

> **Relevância para a loja pública:** ⭐⭐ MÉDIA — Usados na biblioteca do usuário após aquisição.

| Campo            | Tipo   | Dimensões obrigatórias     | Uso                              |
|------------------|--------|----------------------------|----------------------------------|
| `libraryCapsule` | Object | 600×900 px                 | Capa vertical na biblioteca      |
| `libraryHeader`  | Object | 920×430 px                 | Banner da página na biblioteca   |
| `libraryHero`    | Object | 1920×(620-1240) px         | Hero banner (fundo da biblioteca)|
| `libraryLogo`    | Object | 1280×720 px                | Logo sobre o hero                |

Cada asset tem:
```json
{ "url": "/uploads/games/{id}/images/arquivo.jpg", "validated": true }
```

`libraryHero` tem campo extra: `hasTextOverlay` (Boolean) — indica se a imagem tem sobreposição de texto.

---

### 3.6 — `trailers` (Trailers/Vídeos)

> **Relevância para a loja pública:** ⭐⭐⭐ ALTA — Vídeos exibidos na página do jogo.

| Campo                | Tipo    | Descrição                          |
|----------------------|---------|------------------------------------|
| `_id`                | ObjectId| ID do trailer                      |
| `publicName`         | String  | Nome público do trailer            |
| `thumbnailUrl`       | String  | URL da thumbnail                   |
| `videoUrl`           | String  | URL do vídeo                       |
| `category`           | String  | Categoria do trailer               |
| `language`           | String  | Idioma do trailer                  |
| `visibleInStore`     | Boolean | Visível na loja pública            |
| `showBeforeScreenshots`| Boolean | Exibir antes das screenshots     |
| `ageAppropriate`     | Boolean | Apropriado para todas as idades    |
| `order`              | Number  | Ordem de exibição                  |

---

### 3.7 — `appConfig` (Configurações do Aplicativo)

> **Relevância para a loja pública:** ⭐⭐ MÉDIA — Requisitos de sistema exibidos na loja.

| Campo               | Tipo   | Descrição                          |
|----------------------|--------|------------------------------------|
| `appName`            | String | Nome do aplicativo                 |
| `appType`            | String | Tipo (Game)                        |
| `os.windows`         | Boolean| Suporta Windows                    |
| `os.windows64`       | Boolean| Suporta Windows 64-bit             |
| `os.macOS`           | Boolean| Suporta macOS                      |
| `os.macIntel64`      | Boolean| Suporta macOS Intel 64-bit         |
| `os.macAppleSilicon` | Boolean| Suporta macOS Apple Silicon        |
| `os.linux`           | Boolean| Suporta Linux                      |
| `os.android`         | Boolean| Suporta Android                    |
| `launchState`        | String | Estado de lançamento (`"coming soon"`, etc.) |
| `communityVisibility`| String | `"default"` ou `"force"`           |

---

### 3.8 — `reviewHistory` (Histórico de Revisões)

> **Relevância para a loja pública:** ⭐ BAIXA — Apenas uso interno/admin.

| Campo    | Tipo   | Descrição                                      |
|----------|--------|-------------------------------------------------|
| `action` | String | `submitted`, `approved`, `rejected`, `resubmitted`, `invalidated` |
| `date`   | Date   | Data da ação                                    |
| `reason` | String | Motivo (ex: razão da rejeição)                  |
| `by`     | String | Quem realizou a ação                            |

---

### 3.9 — `tabStatus` (Controle de Preenchimento)

> **Relevância para a loja pública:** ⭐ BAIXA — Apenas uso interno do painel do desenvolvedor.

Cada campo pode ser: `"pending"`, `"complete"` ou `"error"`.

| Campo          | Seção correspondente              |
|----------------|-----------------------------------|
| `basicData`    | Dados básicos                     |
| `description`  | Descrição                         |
| `storeGraphics`| Capsules da loja                  |
| `screenshots`  | Screenshots                       |
| `libraryAssets`| Assets da biblioteca              |
| `trailers`     | Trailers                          |
| `storePublish` | Publicação da loja                |
| `appConfig`    | Config do aplicativo              |
| `depotUpload`  | Upload de build                   |
| `depotManage`  | Gestão de depots                  |
| `installConfig`| Configuração de instalação        |
| `configPublish`| Publicação da config              |

---

## 4. Endpoints da API (Relevantes para a Loja Pública)

**Base URL:** `http://localhost:5000/api`

### Autenticação obrigatória (Bearer Token)

Todos os endpoints exigem header: `Authorization: Bearer <token>`

### Jogos

| Método   | Rota                                  | Descrição                     |
|----------|---------------------------------------|-------------------------------|
| `GET`    | `/games`                              | Listar jogos do usuário       |
| `GET`    | `/games/:id`                          | Detalhes de um jogo           |

### Admin

| Método   | Rota                                  | Descrição                     |
|----------|---------------------------------------|-------------------------------|
| `GET`    | `/admin/games`                        | Listar todos os jogos         |
| `GET`    | `/admin/games/:id`                    | Detalhes completos de um jogo |

---

## 5. Dados Relevantes para a Loja Pública

Para a loja pública de jogos, o front-end deverá consumir os seguintes dados de jogos **aprovados** (`status === "Aprovado"`):

### Listagem de jogos (cards/grid)

```json
{
  "appId": 3258960,
  "basicData": {
    "gameName": "Nome do Jogo",
    "developerName": "Nome do Dev",
    "genres": ["Ação", "Aventura"],
    "tags": "indie, 2D"
  },
  "description": {
    "shortDescription": "Uma breve descrição do jogo..."
  },
  "storeGraphics": {
    "headerCapsule": { "url": "/uploads/games/.../header.jpg" },
    "smallCapsule": { "url": "/uploads/games/.../small.jpg" },
    "mainCapsule": { "url": "/uploads/games/.../main.jpg" },
    "verticalCapsule": { "url": "/uploads/games/.../vertical.jpg" }
  }
}
```

### Página individual do jogo

```json
{
  "appId": 3258960,
  "basicData": { "gameName", "developerName", "publisherName", "genres", "tags", "languages" },
  "description": { "longDescription", "shortDescription", "reviews", "awards" },
  "storeGraphics": { "mainCapsule", "headerCapsule" },
  "screenshots": [{ "url", "altText", "order" }],
  "trailers": [{ "publicName", "videoUrl", "thumbnailUrl", "order" }],
  "libraryAssets": { "libraryHero", "libraryLogo" },
  "appConfig": { "os", "launchState" }
}
```

---

## 6. Observações Importantes

1. **Imagens:** Todas as URLs de imagens são caminhos relativos ao servidor (ex: `/uploads/games/{id}/images/arquivo.jpg`). O front-end deve prefixar com a URL base do servidor.

2. **Filtragem:** A loja pública deve exibir **apenas jogos com `status: "Aprovado"`**. Será necessário criar um endpoint público (sem autenticação) para isso.

3. **Endpoint público necessário:** Atualmente **não existe** um endpoint público para listar jogos aprovados. Será preciso criar:
   - `GET /api/store/games` — Lista jogos aprovados (público)
   - `GET /api/store/games/:appId` — Detalhes de um jogo aprovado (público)

4. **Banco em memória:** O banco atual (`mongodb-memory-server`) perde todos os dados ao reiniciar o servidor. Para produção, configurar `MONGODB_URI` no `.env` com MongoDB Atlas ou local.

5. **Arquivos estáticos:** Os uploads ficam na pasta `/server/uploads/` e são servidos como estáticos pelo Express.
