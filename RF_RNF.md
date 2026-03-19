# SENAIWORKS — Especificação de Requisitos de Sistema
**Versão:** 2.1  
**Data:** Junho de 2025  
**Projeto:** Validador SenaiWorks (Simulador de Steamworks)  
**Instituição:** SENAI / SESI  

> **Nota de revisão v2.1:** Requisitos não funcionais revisados: remoção de RNF01.1, RNF01.5, RNF02.7, RNF03.3, RNF04.4, RNF06.4, RNF07.1 e RNF07.2. Atualizações: upload de build limitado a 50 MB (RNF01.4), sessão JWT reduzida para 4h (RNF02.4), aplicação exclusiva para desktop (RNF03.1), design visual extremamente fiel ao Steamworks (RNF03.2), adição do padrão arquitetural MVC (RNF05.4).

---

## Sumário

1. [Visão Geral do Sistema](#1-visão-geral-do-sistema)
2. [Estrutura de Módulos](#2-estrutura-de-módulos)
3. [Requisitos Funcionais — Módulo A: Cadastro e Acesso](#3-requisitos-funcionais--módulo-a-cadastro-e-acesso)
4. [Requisitos Funcionais — Módulo B: Administração da Página da Loja](#4-requisitos-funcionais--módulo-b-administração-da-página-da-loja)
   - [Tela B1 — Dados Básicos](#tela-b1--dados-básicos)
   - [Tela B2 — Descrição](#tela-b2--descrição)
   - [Tela B3 — Recursos Gráficos da Loja](#tela-b3--recursos-gráficos-da-loja)
   - [Tela B4 — Recursos de Captura de Tela](#tela-b4--recursos-de-captura-de-tela)
   - [Tela B5 — Recursos da Biblioteca](#tela-b5--recursos-da-biblioteca)
   - [Tela B6 — Trailers](#tela-b6--trailers)
   - [Tela B7 — Publicar (Store)](#tela-b7--publicar-store)
5. [Requisitos Funcionais — Módulo C: Configuração do Jogo (SteamPipe)](#5-requisitos-funcionais--módulo-c-configuração-do-jogo-steampipe)
   - [Tela C1 — Configurações Gerais do Aplicativo](#tela-c1--configurações-gerais-do-aplicativo)
   - [Tela C2 — Enviar Depots por HTTP](#tela-c2--enviar-depots-por-http)
   - [Tela C3 — Gerenciar Depots](#tela-c3--gerenciar-depots)
   - [Tela C4 — Configurações Gerais de Instalação](#tela-c4--configurações-gerais-de-instalação)
   - [Tela C5 — Publicar Alterações (Config)](#tela-c5--publicar-alterações-config)
6. [Requisitos Funcionais — Módulo D: Painel do Administrador](#6-requisitos-funcionais--módulo-d-painel-do-administrador)
7. [Requisitos Não Funcionais](#7-requisitos-não-funcionais)
8. [Regras de Negócio Globais](#8-regras-de-negócio-globais)
9. [Infraestrutura Técnica](#9-infraestrutura-técnica)

---

## 1. Visão Geral do Sistema

O **SenaiWorks** é uma plataforma didática simulada, inspirada no **Steamworks** (portal de publicação da Steam/Valve), desenvolvida para fins educacionais dentro do ecossistema SENAI/SESI. Seu objetivo é ensinar aos alunos o processo completo de publicação de um jogo digital, cobrindo aspectos legais, fiscais, de marketing e técnicos.

O sistema é composto por quatro módulos:

| Módulo | Descrição |
|--------|-----------|
| **A — Cadastro e Acesso** | Registro, login, dados fiscais simulados e taxa de publicação |
| **B — Página da Loja** | Configuração de dados básicos, descrições, assets gráficos e trailers |
| **C — Configuração do Jogo** | Configuração técnica: sistema operacional, depots, executável e publicação |
| **D — Painel do Administrador** | Revisão e aprovação/reprovação dos jogos submetidos |

A loja de jogos será construída em fase posterior e integrada a esta plataforma.

---

## 2. Estrutura de Módulos

```
SenaiWorks
├── Módulo A — Cadastro e Acesso
│   ├── Tela de Login / Cadastro
│   ├── Dados Cadastrais (identidade, fiscal, bancário)
│   └── Pagamento de Taxa Fictícia
│
├── Módulo B — Administração da Página da Loja
│   ├── B1 · Dados Básicos
│   ├── B2 · Descrição (Longa + Curta)
│   ├── B3 · Recursos Gráficos — Recursos da Loja (Capsules)
│   ├── B4 · Recursos Gráficos — Capturas de Tela (Screenshots)
│   ├── B5 · Recursos Gráficos — Recursos da Biblioteca
│   ├── B6 · Trailers
│   └── B7 · Publicar (Store)
│
├── Módulo C — Configuração do Jogo (SteamPipe)
│   ├── C1 · Configurações Gerais do Aplicativo
│   ├── C2 · Enviar Depots por HTTP
│   ├── C3 · Gerenciar Depots
│   ├── C4 · Configurações Gerais de Instalação
│   └── C5 · Publicar Alterações
│
└── Módulo D — Painel do Administrador
    ├── Lista de Jogos Submetidos
    └── Revisão e Decisão (Aprovar / Reprovar)
```

---

## 3. Requisitos Funcionais — Módulo A: Cadastro e Acesso

### RF-A01 — Autenticação

| ID | Descrição |
|----|-----------|
| RF-A01.1 | O sistema deve exibir tela de login com campos de **e-mail** e **senha**. |
| RF-A01.2 | O e-mail de cadastro deve obrigatoriamente pertencer aos domínios `@edu.sc.senai.br` ou `@estudante.sesisenai.org.br`. E-mails de outros domínios devem ser rejeitados com mensagem de erro. |
| RF-A01.3 | A senha deve seguir os requisitos da Steam: **mínimo de 8 caracteres**, contendo ao menos uma letra maiúscula, uma minúscula, um número e um caractere especial. |
| RF-A01.4 | O sistema deve exibir link **"Esqueceu a senha?"** que redireciona o usuário para responder à sua pergunta de segurança cadastrada antes de permitir a redefinição. |
| RF-A01.5 | As perguntas de segurança disponíveis no cadastro devem incluir no mínimo 6 opções: "Qual é o nome do meio do seu primo mais velho?", "Qual foi o primeiro concerto que você foi?", "Qual o nome da rua em que você cresceu?", "Qual foi o nome do seu primeiro animal de estimação?", "Qual o modelo do seu primeiro carro?" e "Em que cidade seus pais se conheceram?". |
| RF-A01.6 | O sistema deve reconhecer dois perfis de acesso: **Desenvolvedor** (Pessoa Física ou Jurídica simulada) e **Administrador**. |
| RF-A01.7 | A conta de administrador deve ser pré-configurada com login `administrador.senai@edu.sc.senai.br` e senha `Senaiworks_0412@`, sem possibilidade de alteração pelo usuário comum. |
| RF-A01.8 | Após login bem-sucedido, o sistema deve redirecionar: Administrador → Painel de Administração; Desenvolvedor → fluxo de submissão (Módulo B). |
| RF-A01.9 | O sistema deve bloquear temporariamente o login após **5 tentativas inválidas consecutivas**. |

### RF-A02 — Cadastro: Identidade do Desenvolvedor

| ID | Descrição |
|----|-----------|
| RF-A02.1 | Campo de texto obrigatório para **Nome Legal / Razão Social**. |
| RF-A02.2 | Campo de texto obrigatório para **Endereço Completo**. |
| RF-A02.3 | Dropdown para **Tipo de Conta**: Pessoa Física ou Pessoa Jurídica (simulada). |
| RF-A02.4 | Para **Pessoa Jurídica simulada**, o sistema deve solicitar: Nome Fantasia, CNPJ fictício (14 dígitos), Responsável Legal e Cargo. Nenhum dado será validado contra bases reais — trata-se de exercício didático. |

### RF-A03 — Informações Fiscais Simuladas (Tax Interview)

| ID | Descrição |
|----|-----------|
| RF-A03.1 | Dropdown de **País de Residência** com opção padrão "Brasil". |
| RF-A03.2 | Campo de texto para **TIN (CPF ou CNPJ fictício)**. |
| RF-A03.3 | Validação de **formato**: CPF = 11 dígitos; CNPJ = 14 dígitos. Ambos são simulados — não há consulta a Receita Federal. |
| RF-A03.4 | Em formato inválido, exibir: *"Erro: Formato de CPF/CNPJ inválido."* |
| RF-A03.5 | Exibir aviso didático visível: *"Estes dados são fictícios para fins de aprendizado. Não insira dados reais."* |

### RF-A04 — Informações Bancárias Simuladas

| ID | Descrição |
|----|-----------|
| RF-A04.1 | Campo de texto para **Nome do Banco Fictício**. |
| RF-A04.2 | Campo de texto para **Código SWIFT/IBAN Fictício** com validação de mínimo 8 e máximo 11 caracteres. |
| RF-A04.3 | Campo numérico para **Número de Conta Fictício**. |
| RF-A04.4 | Exibir aviso didático visível: *"Dados bancários fictícios para fins educacionais."* |

### RF-A05 — Taxa de Publicação Simulada (Steam Direct Fee)

| ID | Descrição |
|----|-----------|
| RF-A05.1 | Exibir status inicial da taxa como **"Pendente"** com valor de referência **$100,00 USD**. |
| RF-A05.2 | Exibir botão **[PAGAR TAXA DE PUBLICAÇÃO — $100,00 USD]**. |
| RF-A05.3 | Ao clicar, o botão deve mudar para estado **"PAGO"** (cor verde) e liberar o acesso aos Módulos B e C. |
| RF-A05.4 | Enquanto a taxa não for paga, o acesso aos módulos seguintes deve permanecer bloqueado com mensagem explicativa. |

---

## 4. Requisitos Funcionais — Módulo B: Administração da Página da Loja

> Referência visual: telas com prefixo `ParaTela_` nos arquivos fornecidos.  
> Navegação interna por abas: **Dados básicos · Descrição · Classificações · Acesso antecipado · Recursos gráficos · Trailers · Configurações especiais · Tradução · Publicar**

---

### Tela B1 — Dados Básicos

| ID | Descrição |
|----|-----------|
| RF-B01.1 | Campo de texto obrigatório para **Nome do Jogo** (título público exibido na loja). |
| RF-B01.2 | Campo de texto para **Tipo** do aplicativo (padrão: "Game"). |
| RF-B01.3 | Campo de texto para **Desenvolvedora** (nome que aparece na página da loja). |
| RF-B01.4 | Campo de texto para **Distribuidora** (pode ser igual à desenvolvedora). |
| RF-B01.5 | Dropdown de **Gênero(s)** com múltipla seleção: Ação, Aventura, RPG, Estratégia, Simulação, Esporte, Casual, Corrida, Puzzle. |
| RF-B01.6 | Campo de texto para **Palavras-chave / Tags** associadas ao jogo. |
| RF-B01.7 | Dropdown de **Idiomas suportados** com seleção múltipla (lista completa incluindo Português Brasil, Inglês, Espanhol, etc.). |
| RF-B01.8 | Botão **[Salvar]** ao final da seção; alterações não salvas devem gerar alerta ao tentar mudar de aba. |

---

### Tela B2 — Descrição

> Referência: imagem `ParaTela_2Administracao_de_pagina_da_loja.png`

| ID | Descrição |
|----|-----------|
| RF-B02.1 | Seção **"Sobre este Jogo"** com editor de texto rico (Rich Text) com suporte à barra de ferramentas: Negrito (B), Itálico (I), Sublinhado (U), Tachado (S), Títulos (H2), Listas com marcadores, Listas numeradas, Inserção de imagem, Alinhamento (esquerda, centro, direita, justificado). |
| RF-B02.2 | O editor deve ter alternância entre **modo visual** e **modo HTML/código**. |
| RF-B02.3 | O editor deve suportar seleção de modo de visualização: **Computador e cliente Steam**, **Celular** e **Steam Deck & Big Picture**. |
| RF-B02.4 | Seção lateral de **"Enviar imagens personalizadas"** para uso inline na descrição longa, com suporte a arrastar e soltar (drag and drop) ou botão "Selecionar arquivo". Formatos: PNG, JPG, GIF, WebP, MP4 e WebM. |
| RF-B02.5 | Campo de **"Descrição Curta"** com limite de **300 caracteres** (recomendação: 200–300). |
| RF-B02.6 | Contador de caracteres em tempo real exibindo "X/300" abaixo da área de texto da Descrição Curta. |
| RF-B02.7 | Ao ultrapassar 300 caracteres na Descrição Curta, bloquear entrada adicional e exibir erro vermelho. |
| RF-B02.8 | Seção de **Análises** com botão [Adicionar análises] para incluir links e textos de críticas externas. |
| RF-B02.9 | Seção de **Prêmios** com botão [Adicionar premiação] para incluir reconhecimentos e prêmios recebidos. |
| RF-B02.10 | Seção **"Seção de anúncio especial"** com botão [Adicionar seção] para destaques e edições especiais. |
| RF-B02.11 | Dropdown de seleção de **idioma** para cada campo de descrição (suporte a tradução por idioma). |
| RF-B02.12 | Botão **[Salvar]** ao final da seção. |

---

### Tela B3 — Recursos Gráficos da Loja

> Referência: imagem `ParaTela_3RecursosGraficos_RecursosDaLoja.png`  
> Subtaba: **Recursos da loja ✅**

O sistema deve aceitar imagens arrastadas para uma **zona de drop central** e classificá-las automaticamente pela dimensão. Deve também exibir orientação: *"Para enviar os recursos gráficos da loja, você deve primeiro selecionar se são versões temporárias para um evento ou promoção, ou se atualizará os recursos base a longo prazo."*

Deve existir opção de **"Criar nova substituição temporária dos recursos gráficos base"** (com data de início e término) ou **"Atualizar ou ver os recursos gráficos base da loja"**.

#### Imagens Obrigatórias da Loja (Capsules)

Para cada item abaixo, deve haver: zona de upload (drag and drop ou botão), prévia da imagem, indicação da dimensão exigida e status de validação (✅ / ❌).

| ID | Asset | Dimensão Obrigatória | Formato |
|----|-------|----------------------|---------|
| RF-B03.1 | **Header Capsule** | 460 × 215 px | JPG ou PNG |
| RF-B03.2 | **Small Capsule** | 231 × 87 px | JPG ou PNG |
| RF-B03.3 | **Main Capsule** | 616 × 353 px | JPG ou PNG |
| RF-B03.4 | **Vertical Capsule (Hero)** | 374 × 448 px | JPG ou PNG |

| ID | Regras de Validação para todos os assets da Loja |
|----|--------------------------------------------------|
| RF-B03.5 | O sistema deve verificar **dimensões exatas** no momento do upload (client-side via Canvas API). |
| RF-B03.6 | Imagens fora das dimensões especificadas devem ser rejeitadas com mensagem indicando a dimensão correta. |
| RF-B03.7 | Imagens dentro das dimensões devem exibir prévia imediatamente e status verde ✅. |
| RF-B03.8 | O sistema deve permitir remover e reenviar qualquer imagem individualmente. |

---

### Tela B4 — Recursos de Captura de Tela

> Referência: imagem `ParaTela_3_2RecursosGraficos_RecusosdeCapturadeTelapng.png`  
> Subtaba: **Recursos de capturas de tela ✅**

| ID | Descrição |
|----|-----------|
| RF-B04.1 | Deve exibir zona de upload (drag and drop) para screenshots com orientação de uso. |
| RF-B04.2 | Formato obrigatório: **widescreen (16:9)**, resolução mínima de **1920 × 1080 px**. |
| RF-B04.3 | Quantidade mínima: **5 screenshots**. O avanço deve ser bloqueado se este mínimo não for atendido. |
| RF-B04.4 | As capturas devem retratar o jogo em si, não artes conceituais, cinemáticas pré-renderizadas ou imagens promocionais. O sistema deve exibir esta orientação em destaque com cor de alerta. |
| RF-B04.5 | Cada screenshot enviada deve exibir: miniatura, checkbox **"Apropriada para todas as idades"** e área lateral para **versão traduzida** (drag and drop por idioma). |
| RF-B04.6 | As miniaturas devem ser reordenáveis por **arrastar e soltar**. |
| RF-B04.7 | Deve haver botão **[Editar descrição de acessibilidade (texto alternativo)]** por imagem. |
| RF-B04.8 | Botão **[Save Changes]** ao final da lista de screenshots. |
| RF-B04.9 | Cada screenshot deve ter botão **(excluir)** individual. |

---

### Tela B5 — Recursos da Biblioteca

> Referência: imagem `ParaTela_3_3RecusosGraficos_RecursosDaBiblioteca.png`  
> Subtaba: **Recursos da biblioteca ✅**

O sistema deve exibir as **Diretrizes para Recursos Gráficos da Biblioteca** antes das zonas de upload, com orientações sobre: visão geral, modelos recomendados, documentação, tradução e requisitos.

#### Assets da Biblioteca

| ID | Asset | Dimensão Base | Formato | Regra Adicional |
|----|-------|---------------|---------|-----------------|
| RF-B05.1 | **Cápsula da biblioteca** | 600 × 900 px | JPG ou PNG | Deve priorizar imagem de embalagem do jogo. Versão base (sem inglês) pode ser submetida. |
| RF-B05.2 | **Cabeçalho da biblioteca (Header)** | 920 × 430 px | JPG ou PNG | Deve ser uma imagem sem detalhes de texto/logo. |
| RF-B05.3 | **Cabeçalho da biblioteca (Hero)** | 1920 × 1240 px (mín. 1920 × 620 px) | JPG ou PNG | A imagem do cabeçalho da biblioteca **deve conter a logo do aplicativo em destaque**. Não deve incluir textos promocionais sobrepostos. |
| RF-B05.4 | **Logotipo da biblioteca** | 1280 × 720 px (mín. qualquer tamanho aceito com upscale automático a partir do mínimo) | **PNG obrigatório** | Deve ter fundo transparente. Usar ferramentas de IA (ex: Adobe Firefly) é sugerido nas diretrizes. |

| ID | Regras adicionais |
|----|-------------------|
| RF-B05.5 | Para o **Cabeçalho da biblioteca (Hero)**, após o upload, o sistema deve perguntar: *"Esta imagem contém texto ou logotipo sobreposto?"*. Se marcado "Sim", rejeitar e exibir orientação de que a arte deve ser limpa (sem texto/logo embutido). |
| RF-B05.6 | Deve exibir seção **"Ferramenta de posicionamento"** simulada para o logotipo, mostrando como a imagem aparecerá sobre o Hero. |
| RF-B05.7 | Exibir exemplos visuais de referência (jogos conhecidos como The Phantom Pain, Mortal Kombat, etc.) para guiar o aluno no estilo de arte esperado. |
| RF-B05.8 | Versão de base (sem inglês) e versão traduzida por idioma devem ser suportadas para cada asset. |

---

### Tela B6 — Trailers

> Referência: imagem `ParaTela_4Trailer.png`

| ID | Descrição |
|----|-----------|
| RF-B06.1 | Deve exibir seção **"Diretrizes e dicas para trailers"** com as orientações: resolução máxima 1920×1080, formatos recomendados (.mov, .wmv, .mp4), áudio AAC, taxa de bits 5.000+ Kbps, preferência pelo formato 16:9. |
| RF-B06.2 | Campo **"Criar novo trailer"** com input de texto para **"Nome exibido ao público"** e botão [Criar]. |
| RF-B06.3 | Após criado, cada trailer deve exibir: zona de upload da **miniatura** (1920 × 1080 px por drag and drop), campo **"Nome exibido ao público"**, dropdown **"Categoria"** (Selecionar uma categoria...), dropdown **"Vídeo base"**, dropdown **"Idioma"** (padrão: Inglês), campo **"Restrições regionais"** (lista de códigos ISO separados por vírgula, ex: DE,FR,US,CA,MX). |
| RF-B06.4 | Checkboxes por trailer: **"Visível na loja"**, **"Exibir antes de capturas de tela na página da loja"** e **"Trailer apropriado para todas as idades"**. |
| RF-B06.5 | Cada trailer deve ter botões **[Salvar]** e **[Substituir]** (para reenviar o arquivo de vídeo). |
| RF-B06.6 | Os trailers devem ser reordenáveis por arrastar e soltar. |
| RF-B06.7 | O arquivo de vídeo enviado deve ter limite de **50 MB** para upload via web. Exibir alerta se exceder. |
| RF-B06.8 | Botão de fechar (X) para remover um trailer cadastrado. |

---

### Tela B7 — Publicar (Store)

> Referência: navegação pela aba **"Publicar"** dentro da Administração de Página da Loja.

| ID | Descrição |
|----|-----------|
| RF-B07.1 | Deve exibir checklist de itens obrigatórios da Página da Loja antes de liberar a publicação. |
| RF-B07.2 | Botão **[Pré-visualizar alterações na loja]** com dropdown de idioma para visualização simulada de como a loja ficará. |
| RF-B07.3 | Ao publicar a página da loja, os dados devem ser marcados como "Em revisão" e enviados ao Administrador. |

---

## 5. Requisitos Funcionais — Módulo C: Configuração do Jogo (SteamPipe)

> Referência visual: telas com prefixo `para_config_` nos arquivos fornecidos.  
> Navegação por abas: **Aplicativo · SteamPipe · Instalação · Segurança · Estatísticas e conquistas · Comunidade · Oficina · Gerenciar códigos · Diversos · Publicar**

---

### Tela C1 — Configurações Gerais do Aplicativo

> Referência: `para_config1_Configuracoes_gerais_do_aplicativo.png`  
> Aba: **Aplicativo** → submenus: Versões, Depots, Envios pela web

| ID | Descrição |
|----|-----------|
| RF-C01.1 | Exibir campo de **Nome do Aplicativo** (somente leitura após análise inicial — exibir aviso de que alterações requerem contato com o suporte). |
| RF-C01.2 | Exibir campo de **Tipo** do aplicativo (padrão: "Game", somente leitura). |
| RF-C01.3 | Seção **"Sistemas operacionais compatíveis"** com checkboxes: **Windows** (subopcão: "Exige 64-bit"), **macOS** (subopções: "Binários em 64 bits (Intel) inclusos", "Binários para Apple Silicon inclusos", "App Bundles foram autenticados pela Apple") e **Linux + SteamOS**. |
| RF-C01.4 | Opção adicional de checkbox para **Android** (desabilitado/informativo por padrão). |
| RF-C01.5 | Botão **[Salvar]** ao final da seção de sistemas operacionais. |
| RF-C01.6 | Seção **"Estado de lançamento"** exibindo o status atual do aplicativo (ex.: "released", "coming soon", "pre-purchase"). Campo somente informativo. |
| RF-C01.7 | Seção **"Visibilidade na Comunidade Steam"** com explicação didática sobre quando o jogo aparece na comunidade, com opções de rádio: **"Padrão"** e **"Forçar visibilidade"**. |

---

### Tela C2 — Enviar Depots por HTTP

> Referência: `para_config2_Enviar_depots_por_HTTP.png`  
> Aba: **SteamPipe** → submenu **Envios pela web**

| ID | Descrição |
|----|-----------|
| RF-C02.1 | Exibir texto explicativo sobre o processo de depot: conteúdo enviado como arquivos ZIP; para builds > 2.048 MB, recomenda-se SteamCMD (apenas informativo). |
| RF-C02.2 | Exibir explicação sobre os dois modos de envio: **Padrão** (substitui depot existente) e **Mesclar c/ atual** (adiciona/atualiza arquivos sem remover os anteriores). |
| RF-C02.3 | Campo de seleção do **Depot de destino** (ex.: `Depot "Nome do Jogo Content" (ID_NUMERO)`). |
| RF-C02.4 | Botão **[Escolher arquivo]** para seleção do arquivo ZIP da build. |
| RF-C02.5 | Dropdown de modo de envio: **Padrão** ou **Mesclar c/ atual**. |
| RF-C02.6 | Botão **[Enviar]** para iniciar o upload. |
| RF-C02.7 | Formatos aceitos: `.zip` apenas nesta tela (conforme o real Steamworks Web). Exibir alerta se outro formato for selecionado. |
| RF-C02.8 | Se o arquivo for **menor que 10 MB**, exibir alerta amarelo: *"Aviso: O arquivo parece muito pequeno para um jogo completo. Verifique se enviou a build correta."* |
| RF-C02.9 | Após envio bem-sucedido, exibir confirmação com nome do depot atualizado. |

---

### Tela C3 — Gerenciar Depots

> Referência: `para_config2_5_Gerenciar_depots.png`  
> Aba: **SteamPipe** → submenu **Depots**

| ID | Descrição |
|----|-----------|
| RF-C03.1 | Seção **"Gerenciar depots"** com texto explicativo sobre conflitos de mapeamento, prioridade de depots, idioma e arquitetura. |
| RF-C03.2 | Checkbox **"Gerenciar depots de conteúdos adicionais separadamente"** (DLC separado). |
| RF-C03.3 | Seção **"Configurando depots"** com lista de depots existentes do projeto. Cada depot deve exibir: ID numérico, nome do depot (ex.: `"Nome do Jogo Content"`), quantidade de pacotes referenciados e sistema operacional / arquitetura configurados. |
| RF-C03.4 | Cada depot deve ter botões **[Editar]** e **[Remover]**. |
| RF-C03.5 | Seção **"Criação e adição de depots"** com botões: **[Adicionar novo depot]**, **[Adicionar conteúdo adicional (associar ao depot principal)]** e **[Adicionar depot compartilhado]**. |
| RF-C03.6 | Botão **[Salvar alterações em depots]** ao final. |
| RF-C03.7 | Seção **"Gerenciar idiomas base"** com lista de checkboxes de idiomas disponíveis (Árabe, Português Brasil, Inglês, Espanhol, Francês, Alemão, Italiano, Japonês, Coreano, Russo, Chinês Simplificado, Chinês Tradicional, etc.). |
| RF-C03.8 | Botão **[Salvar]** ao final da seção de idiomas. |

---

### Tela C4 — Configurações Gerais de Instalação

> Referência: `para_config3_Configuracoes_gerais_de_instalacao.png`  
> Aba: **Instalação** → Configurações gerais

| ID | Descrição |
|----|-----------|
| RF-C04.1 | Seção **"Pasta de instalação"** exibindo o nome da pasta atual (ex.: "Monochrome Painter") e botão **[Alterar pasta de instalação]**. |
| RF-C04.2 | Seção **"Opções de inicialização"** (obrigatória — indicada com *). Exibir texto: *"É necessário configurar ao menos uma opção de inicialização."* |
| RF-C04.3 | Cada **Opção de Inicialização** deve conter: campo **Executável*** (obrigatório, ex.: `MonochromePainter.exe`), dropdown **Tipo de inicialização** (padrão: "Iniciar (padrão)"), dropdown de **Idioma** da descrição (padrão: Inglês), campo de texto **Descrição** (visível ao usuário quando há mais de uma opção), dropdown de **Sistema operacional** (Windows, macOS, Linux + SteamOS), dropdown de **Arquitetura da CPU** (Apenas de 64 bits, 32 bits, Qualquer). |
| RF-C04.4 | Botões **[Editar]** e **[Excluir]** por opção de inicialização. |
| RF-C04.5 | Botão **[Adicionar nova opção de inicialização]** para incluir múltiplas configurações (ex.: uma para Windows e outra para Linux). |
| RF-C04.6 | Seção **"Opções avançadas"** com checkboxes (desabilitados por padrão, apenas informativos): "Ativar uso da função ISteamApps::GetLaunchCommandLine()" e "Substituir resolução para telas externas (Steam Deck)". |

---

### Tela C5 — Publicar Alterações (Config)

> Referência: `para_config4_publicar.png`  
> Aba: **Publicar** (dentro da Administração de dados do aplicativo)

| ID | Descrição |
|----|-----------|
| RF-C05.1 | Exibir texto explicativo: *"Use esta página para publicar todos os metadados informados no site. É necessário publicar para testar opções como a configuração de depots do jogo, novas versões ou novas conquistas adicionadas."* |
| RF-C05.2 | Botão **[Ver todas as alterações pendentes e histórico]** — exibe lista de alterações não publicadas e histórico de publicações anteriores. |
| RF-C05.3 | Botão **[Ver diferenças]** — exibe comparação entre versão atual e versão publicada (diff simulado). |
| RF-C05.4 | Botão **[Reverter alterações]** — desfaz todo o trabalho não publicado, voltando à versão publicada. Deve exigir confirmação. |
| RF-C05.5 | Botão **[Enviar imagens do aplicativo à CDN]** — simula o envio de imagens para publicação "leve" (sem publicar metadados). |
| RF-C05.6 | Botão **[Preparar para publicação]** — verifica conflitos entre o trabalho do usuário e o de outros usuários. |
| RF-C05.7 | Checkbox **"Publicação leve (sem imagens)"** para publicar apenas metadados sem imagens. |
| RF-C05.8 | Áreas de exibição de **"Diferenças:"** e **"Resultados:"** (saída simulada do sistema de diff). |
| RF-C05.9 | A publicação das configurações deve ser um passo separado da publicação da página da loja (Módulo B). |

---

## 6. Requisitos Funcionais — Módulo D: Painel do Administrador

| ID | Descrição |
|----|-----------|
| RF-D01.1 | O painel deve ser acessível exclusivamente pela conta `administrador.senai@edu.sc.senai.br`. |
| RF-D01.2 | Deve listar todos os jogos submetidos em tabela com: título, desenvolvedor, data de envio, status (Em Análise / Aprovado / Reprovado). |
| RF-D01.3 | O administrador deve poder clicar em cada jogo para visualizar **todas as informações do Módulo B** (página da loja) e **todas as configurações do Módulo C** (configuração técnica). |
| RF-D01.4 | Deve exibir botões de ação **[Aprovar]** e **[Reprovar]** para cada jogo com status "Em Análise". |
| RF-D01.5 | Ao reprovar, deve exibir campo de texto obrigatório para o **motivo da reprovação**, que será exibido ao aluno. |
| RF-D01.6 | A mudança de status deve ser refletida imediatamente no painel do aluno. |
| RF-D01.7 | O administrador deve poder **filtrar** jogos por status e pesquisar por nome ou desenvolvedor. |
| RF-D01.8 | O administrador deve poder visualizar o **histórico de revisões** de cada jogo (ex.: "Reprovado em 10/06 — motivo: screenshots insuficientes → Resubmetido em 12/06 → Aprovado em 13/06"). |

---

## 7. Requisitos Não Funcionais

### RNF01 — Desempenho

| ID | Descrição |
|----|-----------|
| RNF01.2 | Upload de imagens deve exibir feedback visual (barra de progresso ou spinner) para arquivos acima de 1 MB. |
| RNF01.3 | Validação de dimensões de imagens deve ocorrer **no cliente** (via Canvas API) antes do envio ao servidor. |
| RNF01.4 | Upload de builds deve suportar arquivos de até **50 MB** sem timeout. |

### RNF02 — Segurança

| ID | Descrição |
|----|-----------|
| RNF02.1 | Senhas armazenadas com **hashing bcrypt** (salt rounds ≥ 12). Nunca em texto puro. |
| RNF02.2 | Bloqueio temporário após **5 tentativas de login inválidas** consecutivas (mínimo 15 minutos). |
| RNF02.3 | Toda comunicação via **HTTPS/TLS 1.2+**. |
| RNF02.4 | Token de sessão JWT com expiração de **4 horas**. |
| RNF02.5 | Credenciais do administrador nunca expostas no código client-side. |
| RNF02.6 | Validação de tipo e tamanho de arquivos realizada também no **servidor**, além da validação client-side. |
| RNF02.8 | Dados fiscais e bancários marcados visivelmente como **simulados/fictícios** para impedir uso indevido de dados reais. |

### RNF03 — Usabilidade

| ID | Descrição |
|----|-----------|
| RNF03.1 | A aplicação deve ser desenvolvida para **desktop** (resolução mínima de 1280 × 720px). Não é necessário suporte a dispositivos móveis ou tablets. |
| RNF03.2 | O design visual deve ser **extremamente fiel ao Steamworks** (`partner.steamgames.com`), seguindo as imagens de referência fornecidas: dark theme com fundo `#1b2838`, barra de navegação superior escura, abas horizontais com destaque azul na aba ativa, tipografia clara sobre fundo escuro, títulos de seção em azul claro (`#66c0f4`), textos explicativos em cinza, botões de ação em azul Steam e layout de conteúdo com margem centralizada. |
| RNF03.4 | Fluxo **sequencial e guiado**: avanço bloqueado até concluir a etapa atual. |
| RNF03.5 | Campos obrigatórios identificados com asterisco (*) em vermelho. |
| RNF03.6 | Prévia de imagens exibida imediatamente após upload, sem recarregar a página. |
| RNF03.7 | Contador de caracteres da Descrição Curta atualizado **em tempo real**. |
| RNF03.8 | Zonas de **drag and drop** com feedback visual (highlight ao arrastar sobre a zona). |
| RNF03.9 | Avisos didáticos visíveis explicando o propósito de cada seção, conforme padrão real do Steamworks. |
| RNF03.10 | O status de cada aba (completo ✅ / pendente ⚠️ / erro ❌) deve ser visível na navegação por abas. |

### RNF04 — Disponibilidade e Infraestrutura

| ID | Descrição |
|----|-----------|
| RNF04.1 | Back-end na **Koyeb** (Eco Instance — 512 MB RAM, 0.1 vCPU) com uptime contínuo, sem suspensão por inatividade. |
| RNF04.2 | Front-end via **GitHub Pages** com deploy automatizado. |
| RNF04.3 | Banco de dados **MongoDB Atlas** (cluster M0 gratuito — até 5 GB), sempre ativo. |
| RNF04.5 | Nenhum dos serviços deve exigir cartão de crédito no plano gratuito. |

### RNF05 — Escalabilidade

| ID | Descrição |
|----|-----------|
| RNF05.1 | Arquitetura preparada para integração futura com a **loja de jogos** sem reescrita do módulo de submissão. |
| RNF05.2 | Schema do MongoDB modelado de forma **flexível** (document model) para suportar campos opcionais por jogo. |
| RNF05.3 | Suporte a pelo menos **50 usuários simultâneos** dentro dos limites do plano gratuito da Koyeb. |
| RNF05.4 | O sistema deve ser desenvolvido seguindo o padrão arquitetural **MVC (Model-View-Controller)**: **Model** gerencia os dados e regras de negócio (MongoDB + lógica de validação), **View** corresponde às telas e componentes de interface (front-end), **Controller** processa as requisições, aplica as regras e retorna as respostas (back-end Node.js). |

### RNF06 — Manutenibilidade

| ID | Descrição |
|----|-----------|
| RNF06.1 | Código organizado em módulos separados por tela/funcionalidade. |
| RNF06.2 | Regras de validação (dimensões, limites, formatos) centralizadas em arquivo de configuração ou constantes. |
| RNF06.3 | Arquivo `README.md` com instruções de instalação, configuração e deploy. |

### RNF07 — Compatibilidade

| ID | Descrição |
|----|-----------|
| RNF07.3 | Formatos de imagem aceitos: **JPG** e **PNG**. Formatos de build: **ZIP** (via web), **RAR** e **7Z** (informativos). Formatos de vídeo: **MP4**, **MOV**, **WMV**, **WebM**, **GIF**. |

---

## 8. Regras de Negócio Globais

| ID | Regra |
|----|-------|
| RN01 | O sistema **bloqueia o avanço** se qualquer requisito obrigatório da etapa atual não for atendido. |
| RN02 | A **taxa de publicação simulada ($100 USD)** deve ser marcada como paga para desbloquear os Módulos B e C. |
| RN03 | As **dimensões das imagens são Pixel Perfect**: qualquer variação resulta em rejeição imediata. |
| RN04 | O botão **"Publicar"** do Módulo B e do Módulo C são **independentes**: ambos devem ser concluídos para a submissão final. |
| RN05 | O **Hero da Biblioteca (Cabeçalho)** não pode ter texto ou logotipo embutido; rejeitado se o aluno confirmar a presença. |
| RN06 | O **Logotipo da Biblioteca** é obrigatoriamente em formato **PNG** (transparência necessária). |
| RN07 | A **Descrição Curta** não pode ultrapassar **300 caracteres**. |
| RN08 | O **mínimo de 5 screenshots** é obrigatório; a subtaba exibe status ✅ somente após atingir esse mínimo. |
| RN09 | **Pessoa Jurídica é simulada**: o sistema não valida dados contra Receita Federal ou qualquer base pública. Todos os campos CNPJ/razão social são para fins didáticos. |
| RN10 | O aluno visualiza apenas o status de revisão do **próprio jogo**. |
| RN11 | O **Administrador** é o único capaz de aprovar ou reprovar uma submissão. |
| RN12 | Uma reprovação deve ser acompanhada de **motivo obrigatório**, visível ao desenvolvedor no seu painel. |
| RN13 | As configurações do Módulo C (SteamPipe) são **independentes** das configurações de Página da Loja (Módulo B) — cada um tem seu próprio fluxo de "Publicar". |
| RN14 | O sistema deve exibir **avisos didáticos** em todas as telas com dados fictícios (fiscal, bancário), impedindo que alunos confundam o ambiente com sistemas reais. |

---

## 9. Infraestrutura Técnica

| Componente | Tecnologia | Plano / Especificação |
|------------|-----------|----------------------|
| Front-end | GitHub Pages | Gratuito — hospedagem estática |
| Back-end | Koyeb (PaaS) | Eco Instance — 512 MB RAM, 0.1 vCPU, sem suspensão |
| Banco de Dados | MongoDB Atlas | Cluster M0 — até 5 GB, sem desligamento |
| Autenticação | JWT | Token com expiração de 4h |
| Storage de Imagens | Cloudinary (plano gratuito) ou equivalente | 25 créditos/mês no plano gratuito |
| Validação de Imagens | Canvas API (client-side) | Verificação de dimensões antes do upload |
| Controle de Versão | GitHub | Branch `main` (produção) + `dev` (desenvolvimento) |

---

> **Escopo desta versão:** Fase 1 — Plataforma de Submissão (SenaiWorks).  
> A integração com a **Loja de Jogos** é prevista para fase posterior e não está no escopo deste documento.