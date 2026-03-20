const mongoose = require('mongoose');

const reviewEntrySchema = new mongoose.Schema({
  action: { type: String, enum: ['submitted', 'approved', 'rejected', 'resubmitted', 'invalidated'] },
  date: { type: Date, default: Date.now },
  reason: { type: String, default: '' },
  by: { type: String, default: '' },
}, { _id: false });

const depotSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  os: { type: String, default: 'Windows' },
  architecture: { type: String, default: 'Apenas 50 cc 64 bits' },
  packagesCount: { type: Number, default: 1 },
}, { timestamps: true });

const launchOptionSchema = new mongoose.Schema({
  executable: { type: String, default: '' },
  launchType: { type: String, default: 'Iniciar (padrão)' },
  descriptionLang: { type: String, default: 'Inglês' },
  description: { type: String, default: '' },
  os: { type: String, default: 'Windows' },
  cpuArch: { type: String, default: 'Apenas de 64 bits' },
}, { timestamps: true });

const trailerSchema = new mongoose.Schema({
  publicName: { type: String, default: '' },
  thumbnailUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  category: { type: String, default: '' },
  baseVideo: { type: String, default: '' },
  language: { type: String, default: 'Inglês' },
  regionalRestrictions: { type: String, default: '' },
  visibleInStore: { type: Boolean, default: true },
  showBeforeScreenshots: { type: Boolean, default: false },
  ageAppropriate: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const screenshotSchema = new mongoose.Schema({
  url: { type: String, required: true },
  altText: { type: String, default: '' },
  ageAppropriate: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  translations: { type: Map, of: String, default: {} },
}, { _id: true });

const gameSchema = new mongoose.Schema({
  developer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  appId: {
    type: Number,
    unique: true,
  },

  // ===================== MODULE B: STORE PAGE =====================

  // B1 — Basic Data
  basicData: {
    gameName: { type: String, default: '' },
    appType: { type: String, default: 'Game' },
    developerName: { type: String, default: '' },
    publisherName: { type: String, default: '' },
    genres: [{ type: String }],
    tags: { type: String, default: '' },
    languages: [{ type: String }],
  },

  // B2 — Description
  description: {
    longDescription: { type: String, default: '' },
    shortDescription: { type: String, default: '', maxlength: 300 },
    descriptionLanguage: { type: String, default: 'Português (Brasil)' },
    reviews: [{ source: String, text: String, link: String }],
    awards: [{ title: String, description: String }],
    specialAnnouncements: [{ title: String, content: String }],
  },

  // B3 — Store Graphics (Capsules)
  storeGraphics: {
    headerCapsule:   { url: { type: String, default: '' }, validated: { type: Boolean, default: false } },
    smallCapsule:    { url: { type: String, default: '' }, validated: { type: Boolean, default: false } },
    mainCapsule:     { url: { type: String, default: '' }, validated: { type: Boolean, default: false } },
    verticalCapsule: { url: { type: String, default: '' }, validated: { type: Boolean, default: false } },
    isTemporary: { type: Boolean, default: false },
    tempStartDate: { type: Date, default: null },
    tempEndDate: { type: Date, default: null },
  },

  // B4 — Screenshots
  screenshots: [screenshotSchema],

  // B5 — Library Assets
  libraryAssets: {
    libraryCapsule: { url: { type: String, default: '' }, validated: { type: Boolean, default: false } },
    libraryHeader:  { url: { type: String, default: '' }, validated: { type: Boolean, default: false } },
    libraryHero:    { url: { type: String, default: '' }, validated: { type: Boolean, default: false }, hasTextOverlay: { type: Boolean, default: false } },
    libraryLogo:    { url: { type: String, default: '' }, validated: { type: Boolean, default: false } },
  },

  // B6 — Trailers
  trailers: [trailerSchema],

  // B7 — Store Publish Status
  storePublished: { type: Boolean, default: false },
  storeSubmittedAt: { type: Date, default: null },

  // ===================== MODULE C: GAME CONFIG =====================

  // C1 — General App Settings
  appConfig: {
    appName: { type: String, default: '' },
    appType: { type: String, default: 'Game' },
    os: {
      windows: { type: Boolean, default: false },
      windows64: { type: Boolean, default: false },
      macOS: { type: Boolean, default: false },
      macIntel64: { type: Boolean, default: false },
      macAppleSilicon: { type: Boolean, default: false },
      macNotarized: { type: Boolean, default: false },
      linux: { type: Boolean, default: false },
      android: { type: Boolean, default: false },
    },
    launchState: { type: String, default: 'coming soon' },
    communityVisibility: { type: String, enum: ['default', 'force'], default: 'default' },
  },

  // C2 — Depots HTTP Upload
  buildUpload: {
    depotName: { type: String, default: '' },
    fileName: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    fileSize: { type: Number, default: 0 },
    uploadMode: { type: String, enum: ['standard', 'merge'], default: 'standard' },
    uploadedAt: { type: Date, default: null },
  },

  // C3 — Manage Depots
  depots: [depotSchema],
  manageDLCSeparately: { type: Boolean, default: false },
  baseLanguages: [{ type: String }],

  // C4 — Installation Settings
  installConfig: {
    installFolder: { type: String, default: '' },
    launchOptions: [launchOptionSchema],
    advancedGetLaunchCmd: { type: Boolean, default: false },
    advancedOverrideRes: { type: Boolean, default: false },
  },

  // C5 — Config Publish Status
  configPublished: { type: Boolean, default: false },
  configSubmittedAt: { type: Date, default: null },

  // ===================== REVIEW STATUS =====================
  status: {
    type: String,
    enum: ['Rascunho', 'Loja em Revisão', 'Config em Revisão', 'Em Análise', 'Aprovado', 'Reprovado'],
    default: 'Rascunho',
  },
  reviewHistory: [reviewEntrySchema],

  // ===================== TAB COMPLETION =====================
  tabStatus: {
    basicData: { type: String, enum: ['pending', 'complete', 'error'], default: 'pending' },
    description: { type: String, enum: ['pending', 'complete', 'error'], default: 'pending' },
    storeGraphics: { type: String, enum: ['pending', 'complete', 'error'], default: 'pending' },
    screenshots: { type: String, enum: ['pending', 'complete', 'error'], default: 'pending' },
    libraryAssets: { type: String, enum: ['pending', 'complete', 'error'], default: 'pending' },
    trailers: { type: String, enum: ['pending', 'complete', 'error'], default: 'pending' },
    storePublish: { type: String, enum: ['pending', 'complete', 'error'], default: 'pending' },
    appConfig: { type: String, enum: ['pending', 'complete', 'error'], default: 'pending' },
    depotUpload: { type: String, enum: ['pending', 'complete', 'error'], default: 'pending' },
    depotManage: { type: String, enum: ['pending', 'complete', 'error'], default: 'pending' },
    installConfig: { type: String, enum: ['pending', 'complete', 'error'], default: 'pending' },
    configPublish: { type: String, enum: ['pending', 'complete', 'error'], default: 'pending' },
  },
}, {
  timestamps: true,
});

// Auto-generate appId
gameSchema.pre('save', async function (next) {
  if (!this.appId) {
    const lastGame = await mongoose.model('Game').findOne().sort({ appId: -1 });
    this.appId = lastGame ? lastGame.appId + 1 : 3258960;
  }
  next();
});

module.exports = mongoose.model('Game', gameSchema);
