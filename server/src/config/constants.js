// ============================================================
// SenaiWorks — Centralized Validation Constants & Business Rules
// RF_RNF.md §7 RNF06.2: Regras centralizadas em arquivo de config
// ============================================================

module.exports = {
  // --- Allowed Email Domains (RF-A01.2) ---
  ALLOWED_EMAIL_DOMAINS: ['@edu.sc.senai.br', '@estudante.sesisenai.org.br'],

  // --- Password Policy (RF-A01.3) ---
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,

  // --- Security Questions (RF-A01.5) ---
  SECURITY_QUESTIONS: [
    'Qual é o nome do meio do seu primo mais velho?',
    'Qual foi o primeiro concerto que você foi?',
    'Qual o nome da rua em que você cresceu?',
    'Qual foi o nome do seu primeiro animal de estimação?',
    'Qual o modelo do seu primeiro carro?',
    'Em que cidade seus pais se conheceram?',
  ],

  // --- Admin Credentials (RF-A01.7) ---
  ADMIN_EMAIL: 'administrador.senai@edu.sc.senai.br',
  ADMIN_PASSWORD: 'Senaiworks_0412@',

  // --- Login Lockout (RF-A01.9 / RNF02.2) ---
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MS: 15 * 60 * 1000, // 15 minutes

  // --- Publication Fee (RF-A05) ---
  PUBLICATION_FEE_USD: 100.00,

  // --- Short Description (RF-B02.5 / RN07) ---
  SHORT_DESCRIPTION_MAX_CHARS: 300,

  // --- Store Capsule Dimensions (RF-B03) — Pixel Perfect (RN03) ---
  STORE_CAPSULES: {
    headerCapsule:   { width: 460,  height: 215, label: 'Header Capsule',   formats: ['image/jpeg', 'image/png'] },
    smallCapsule:    { width: 231,  height: 87,  label: 'Small Capsule',    formats: ['image/jpeg', 'image/png'] },
    mainCapsule:     { width: 616,  height: 353, label: 'Main Capsule',     formats: ['image/jpeg', 'image/png'] },
    verticalCapsule: { width: 374,  height: 448, label: 'Vertical Capsule', formats: ['image/jpeg', 'image/png'] },
  },

  // --- Screenshots (RF-B04) ---
  SCREENSHOT_MIN_WIDTH: 1920,
  SCREENSHOT_MIN_HEIGHT: 1080,
  SCREENSHOT_MIN_COUNT: 5,
  SCREENSHOT_FORMATS: ['image/jpeg', 'image/png'],

  // --- Library Assets (RF-B05) ---
  LIBRARY_ASSETS: {
    libraryCapsule: { width: 600,  height: 900,  label: 'Cápsula da biblioteca',          formats: ['image/jpeg', 'image/png'] },
    libraryHeader:  { width: 920,  height: 430,  label: 'Cabeçalho da biblioteca (Header)', formats: ['image/jpeg', 'image/png'] },
    libraryHero:    { width: 1920, height: 1240, minHeight: 620, label: 'Cabeçalho da biblioteca (Hero)', formats: ['image/jpeg', 'image/png'] },
    libraryLogo:    { width: 1280, height: 720,  label: 'Logotipo da biblioteca',          formats: ['image/png'] }, // RN06: PNG only
  },

  // --- Trailer (RF-B06) ---
  TRAILER_THUMBNAIL_WIDTH: 1920,
  TRAILER_THUMBNAIL_HEIGHT: 1080,
  TRAILER_MAX_SIZE_BYTES: 50 * 1024 * 1024, // 50 MB (RNF01.4)
  TRAILER_FORMATS: ['video/mp4', 'video/quicktime', 'video/x-ms-wmv', 'video/webm'],

  // --- Build Upload (RF-C02) ---
  BUILD_MAX_SIZE_BYTES: 50 * 1024 * 1024, // 50 MB (RNF01.4)
  BUILD_SMALL_WARNING_BYTES: 10 * 1024 * 1024, // 10 MB (RF-C02.8)
  BUILD_FORMATS: ['.zip'],

  // --- Image Upload General (RNF01.2) ---
  PROGRESS_THRESHOLD_BYTES: 1 * 1024 * 1024, // 1 MB — show progress bar above this

  // --- Genres (RF-B01.5) ---
  GENRES: ['Ação', 'Aventura', 'RPG', 'Estratégia', 'Simulação', 'Esporte', 'Casual', 'Corrida', 'Puzzle'],

  // --- Languages (RF-B01.7) ---
  LANGUAGES: [
    'Português (Brasil)', 'Inglês', 'Espanhol', 'Espanhol (América Latina)',
    'Francês', 'Alemão', 'Italiano', 'Japonês', 'Coreano', 'Russo',
    'Chinês simplificado', 'Chinês tradicional', 'Árabe', 'Búlgaro',
    'Turco', 'Dinamarquês', 'Holandês', 'Finlandês', 'Sueco',
    'Grego', 'Húngaro', 'Indonésio', 'Norueguês', 'Português (Portugal)',
    'Romeno', 'Tailandês', 'Tcheco', 'Ucraniano', 'Vietnamita',
  ],

  // --- Tax (RF-A03) ---
  CPF_LENGTH: 11,
  CNPJ_LENGTH: 14,

  // --- Banking (RF-A04) ---
  SWIFT_MIN_LENGTH: 8,
  SWIFT_MAX_LENGTH: 11,

  // --- Game Status ---
  GAME_STATUS: {
    DRAFT: 'Rascunho',
    STORE_SUBMITTED: 'Loja em Revisão',
    CONFIG_SUBMITTED: 'Config em Revisão',
    IN_REVIEW: 'Em Análise',
    APPROVED: 'Aprovado',
    REJECTED: 'Reprovado',
  },

  // --- OS Options (RF-C01.3) ---
  OS_OPTIONS: ['Windows', 'macOS', 'Linux + SteamOS', 'Android'],

  // --- Launch Types (RF-C04.3) ---
  LAUNCH_TYPES: ['Iniciar (padrão)', 'Iniciar em modo VR', 'Iniciar editor', 'Iniciar servidor dedicado'],

  // --- CPU Architectures (RF-C04.3) ---
  CPU_ARCHITECTURES: ['Apenas de 64 bits', '32 bits', 'Qualquer'],
};
