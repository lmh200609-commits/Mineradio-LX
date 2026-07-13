const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SCHEMA_VERSION = 1;

function now() { return Date.now(); }
function uid(prefix) { return `${prefix}_${crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex')}`; }
function clone(value) { return JSON.parse(JSON.stringify(value)); }

function createInitialState() {
  const createdAt = now();
  return {
    schemaVersion: SCHEMA_VERSION,
    profile: { id: uid('profile'), name: 'Mineradio 用户', avatar: '', createdAt, updatedAt: createdAt },
    playlists: [{
      id: 'local-liked', name: '我喜欢', description: '保存在 Mineradio 本机资料库', cover: '',
      kind: 'liked', source: 'local', createdAt, updatedAt: createdAt, trackIds: []
    }],
    tracks: {},
    favorites: {},
    imports: {},
    history: []
  };
}

function normalizeSong(song) {
  const raw = song || {};
  const provider = String(raw.provider || raw.source || raw.type || 'unknown').toLowerCase();
  const sourceId = String(raw.id || raw.songmid || raw.mid || raw.mediaMid || raw.url || '').trim();
  if (!sourceId) throw new Error('Missing song id');
  const libraryId = `${provider}:${sourceId}`;
  return {
    id: sourceId,
    libraryId,
    sourceId,
    provider,
    name: String(raw.name || raw.title || '未知歌曲'),
    artist: String(raw.artist || raw.artistName || ''),
    album: String(raw.album || raw.albumName || ''),
    cover: String(raw.cover || raw.pic || raw.image || ''),
    duration: Number(raw.duration || raw.durationMs || raw.dt || 0) || 0,
    source: raw.source || provider,
    songmid: raw.songmid || raw.mid || '',
    mediaMid: raw.mediaMid || '',
    albumMid: raw.albumMid || '',
    artistMid: raw.artistMid || '',
    updatedAt: now()
  };
}

class LibraryStore {
  constructor(filePath) {
    this.filePath = filePath;
    this.state = this.read();
  }

  read() {
    try {
      const raw = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
      if (raw && raw.schemaVersion === SCHEMA_VERSION && raw.profile && Array.isArray(raw.playlists)) return raw;
    } catch (_) {}
    const state = createInitialState();
    this.write(state);
    return state;
  }

  write(next) {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    if (fs.existsSync(this.filePath)) {
      try { fs.copyFileSync(this.filePath, `${this.filePath}.bak`); } catch (_) {}
    }
    const temp = `${this.filePath}.tmp`;
    fs.writeFileSync(temp, JSON.stringify(next, null, 2), 'utf8');
    fs.renameSync(temp, this.filePath);
  }

  save() { this.write(this.state); }
  summary() {
    return {
      profile: clone(this.state.profile),
      playlists: this.state.playlists.map(playlist => ({
        id: playlist.id, name: playlist.name, description: playlist.description || '', cover: playlist.cover || '',
        kind: playlist.kind || 'playlist', source: 'local', provider: 'local', trackCount: playlist.trackIds.length,
        creator: this.state.profile.name, importedFrom: playlist.importedFrom || null, updatedAt: playlist.updatedAt
      })),
      favoriteIds: Object.keys(this.state.favorites),
      historyCount: this.state.history.length
    };
  }

  getPlaylist(id) {
    const playlist = this.state.playlists.find(item => item.id === String(id));
    if (!playlist) return null;
    return {
      playlist: { ...clone(playlist), trackCount: playlist.trackIds.length, provider: 'local', source: 'local', creator: this.state.profile.name },
      tracks: playlist.trackIds.map(trackId => this.state.tracks[trackId]).filter(Boolean).map(clone)
    };
  }

  createPlaylist(name, description) {
    const cleanName = String(name || '').trim().slice(0, 60);
    if (!cleanName) throw new Error('Missing playlist name');
    const createdAt = now();
    const playlist = { id: uid('local-playlist'), name: cleanName, description: String(description || '').trim().slice(0, 200), cover: '', kind: 'playlist', source: 'local', createdAt, updatedAt: createdAt, trackIds: [] };
    this.state.playlists.push(playlist);
    this.save();
    return clone(playlist);
  }

  addTrack(playlistId, rawSong) {
    const playlist = this.state.playlists.find(item => item.id === String(playlistId));
    if (!playlist) throw new Error('Playlist not found');
    const song = normalizeSong(rawSong);
    this.state.tracks[song.libraryId] = { ...(this.state.tracks[song.libraryId] || {}), ...song };
    if (!playlist.trackIds.includes(song.libraryId)) playlist.trackIds.push(song.libraryId);
    playlist.updatedAt = now();
    this.save();
    return { playlist: clone(playlist), song: clone(this.state.tracks[song.libraryId]) };
  }

  toggleFavorite(rawSong, wanted) {
    const song = normalizeSong(rawSong);
    this.state.tracks[song.libraryId] = { ...(this.state.tracks[song.libraryId] || {}), ...song };
    const next = wanted == null ? !this.state.favorites[song.libraryId] : !!wanted;
    const liked = this.state.playlists.find(item => item.id === 'local-liked');
    if (next) {
      this.state.favorites[song.libraryId] = now();
      if (!liked.trackIds.includes(song.libraryId)) liked.trackIds.unshift(song.libraryId);
    } else {
      delete this.state.favorites[song.libraryId];
      liked.trackIds = liked.trackIds.filter(id => id !== song.libraryId);
    }
    liked.updatedAt = now();
    this.save();
    return { liked: next, trackId: song.libraryId };
  }

  isFavorite(rawSong) {
    try { return !!this.state.favorites[normalizeSong(rawSong).libraryId]; } catch (_) { return false; }
  }

  recordHistory(rawSong) {
    const song = normalizeSong(rawSong);
    this.state.tracks[song.libraryId] = { ...(this.state.tracks[song.libraryId] || {}), ...song };
    this.state.history = [song.libraryId].concat(this.state.history.filter(id => id !== song.libraryId)).slice(0, 200);
    this.save();
  }

  importPlaylist(remote, tracks, provider) {
    const key = `${provider}:${remote.id}`;
    let target = this.state.playlists.find(item => item.importKey === key);
    if (!target) {
      target = { id: uid('local-import'), name: remote.name || '导入歌单', description: '', cover: remote.cover || '', kind: 'imported', source: 'local', importedFrom: provider, importKey: key, createdAt: now(), updatedAt: now(), trackIds: [] };
      this.state.playlists.push(target);
    }
    target.name = remote.name || target.name;
    target.cover = remote.cover || target.cover;
    target.trackIds = [];
    (tracks || []).forEach(rawSong => {
      try {
        const song = normalizeSong({ ...rawSong, provider });
        this.state.tracks[song.libraryId] = { ...(this.state.tracks[song.libraryId] || {}), ...song };
        if (!target.trackIds.includes(song.libraryId)) target.trackIds.push(song.libraryId);
      } catch (_) {}
    });
    target.updatedAt = now();
    this.state.imports[key] = { provider, remoteId: String(remote.id), localPlaylistId: target.id, syncedAt: now() };
    this.save();
    return clone(target);
  }
}

module.exports = { LibraryStore };
