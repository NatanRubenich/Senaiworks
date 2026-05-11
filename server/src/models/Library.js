const mongoose = require('mongoose');

const libraryEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
    index: true,
  },
  acquiredAt: { type: Date, default: Date.now },
  lastDownloadAt: { type: Date, default: null },
  downloadCount: { type: Number, default: 0 },
}, {
  timestamps: true,
});

libraryEntrySchema.index({ user: 1, game: 1 }, { unique: true });

module.exports = mongoose.model('LibraryEntry', libraryEntrySchema);
