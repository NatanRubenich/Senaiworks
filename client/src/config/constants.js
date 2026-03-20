// Client-side mirror of server validation constants

export const ALLOWED_EMAIL_DOMAINS = ['@edu.sc.senai.br', '@estudante.sesisenai.org.br'];

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const SECURITY_QUESTIONS = [
  'Qual é o nome do meio do seu primo mais velho?',
  'Qual foi o primeiro concerto que você foi?',
  'Qual o nome da rua em que você cresceu?',
  'Qual foi o nome do seu primeiro animal de estimação?',
  'Qual o modelo do seu primeiro carro?',
  'Em que cidade seus pais se conheceram?',
];

export const GENRES = ['Ação', 'Aventura', 'RPG', 'Estratégia', 'Simulação', 'Esporte', 'Casual', 'Corrida', 'Puzzle'];

export const LANGUAGES = [
  'Português (Brasil)', 'Inglês', 'Espanhol', 'Espanhol (América Latina)',
  'Francês', 'Alemão', 'Italiano', 'Japonês', 'Coreano', 'Russo',
  'Chinês simplificado', 'Chinês tradicional', 'Árabe', 'Búlgaro',
  'Turco', 'Dinamarquês', 'Holandês', 'Finlandês', 'Sueco',
  'Grego', 'Húngaro', 'Indonésio', 'Norueguês', 'Português (Portugal)',
  'Romeno', 'Tailandês', 'Tcheco', 'Ucraniano', 'Vietnamita',
];

export const SHORT_DESCRIPTION_MAX = 300;

export const STORE_CAPSULES = {
  headerCapsule:   { width: 460,  height: 215, label: 'Header Capsule',   formats: ['image/jpeg', 'image/png'] },
  smallCapsule:    { width: 231,  height: 87,  label: 'Small Capsule',    formats: ['image/jpeg', 'image/png'] },
  mainCapsule:     { width: 616,  height: 353, label: 'Main Capsule',     formats: ['image/jpeg', 'image/png'] },
  verticalCapsule: { width: 374,  height: 448, label: 'Vertical Capsule', formats: ['image/jpeg', 'image/png'] },
};

export const SCREENSHOT_MIN_WIDTH = 1920;
export const SCREENSHOT_MIN_HEIGHT = 1080;
export const SCREENSHOT_MIN_COUNT = 5;

export const LIBRARY_ASSETS = {
  libraryCapsule: { width: 600,  height: 900,  label: 'Cápsula da biblioteca',          formats: ['image/jpeg', 'image/png'] },
  libraryHeader:  { width: 920,  height: 430,  label: 'Cabeçalho da biblioteca (Header)', formats: ['image/jpeg', 'image/png'] },
  libraryHero:    { width: 1920, height: 1240, minHeight: 620, label: 'Cabeçalho da biblioteca (Hero)', formats: ['image/jpeg', 'image/png'] },
  libraryLogo:    { width: 1280, height: 720,  label: 'Logotipo da biblioteca',          formats: ['image/png'] },
};

export const TRAILER_MAX_SIZE = 50 * 1024 * 1024;
export const BUILD_MAX_SIZE = 50 * 1024 * 1024;
export const BUILD_SMALL_WARNING = 10 * 1024 * 1024;

export const OS_OPTIONS = ['Windows', 'macOS', 'Linux + SteamOS', 'Android'];
export const LAUNCH_TYPES = ['Iniciar (padrão)', 'Iniciar em modo VR', 'Iniciar editor', 'Iniciar servidor dedicado'];
export const CPU_ARCHITECTURES = ['Apenas de 64 bits', '32 bits', 'Qualquer'];

export const PUBLICATION_FEE = 100.00;

export const CPF_LENGTH = 11;
export const CNPJ_LENGTH = 14;
export const SWIFT_MIN = 8;
export const SWIFT_MAX = 11;

export const GAME_STATUS = {
  DRAFT: 'Rascunho',
  STORE_SUBMITTED: 'Loja em Revisão',
  CONFIG_SUBMITTED: 'Config em Revisão',
  IN_REVIEW: 'Em Análise',
  APPROVED: 'Aprovado',
  REJECTED: 'Reprovado',
};

export const validateImageDimensions = (file, requiredWidth, requiredHeight, minHeight) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      if (minHeight) {
        if (img.width >= requiredWidth && img.height >= minHeight && img.height <= requiredHeight) {
          resolve({ width: img.width, height: img.height, valid: true });
        } else {
          resolve({ width: img.width, height: img.height, valid: false });
        }
      } else {
        if (img.width === requiredWidth && img.height === requiredHeight) {
          resolve({ width: img.width, height: img.height, valid: true });
        } else {
          resolve({ width: img.width, height: img.height, valid: false });
        }
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Falha ao carregar imagem.'));
    };
    img.src = url;
  });
};

export const validateScreenshot = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const valid = img.width >= SCREENSHOT_MIN_WIDTH && img.height >= SCREENSHOT_MIN_HEIGHT;
      const ratio = img.width / img.height;
      const is169 = Math.abs(ratio - 16 / 9) < 0.05;
      resolve({ width: img.width, height: img.height, valid: valid && is169 });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Falha ao carregar imagem.'));
    };
    img.src = url;
  });
};
