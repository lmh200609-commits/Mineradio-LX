# LX custom source adapter plan

## Goal

Add an extensible source layer to Mineradio so a user can import and run an LX Music compatible custom source script locally, then use it as a first-class playback source for songs already discovered by Mineradio.

The implementation must not ship third-party source scripts, bypass paid access controls, redistribute music files, or weaken platform restrictions. Imported scripts are user-supplied local configuration.

## Current Mineradio shape

- Electron entry: `desktop/main.js`
- Renderer and UI logic: `public/index.html`
- Local HTTP API and music-provider code: `server.js`
- Existing providers are coupled into routes:
  - NetEase: `/api/search`, `/api/song/url`, `/api/lyric`, `/api/playlist/tracks`
  - QQ Music: `/api/qq/search`, `/api/qq/song/url`, `/api/qq/lyric`, `/api/qq/playlist/tracks`

This is workable but needs a provider registry before LX scripts can be added cleanly.

## LX script model

LX custom sources are JavaScript files executed by a host that exposes `globalThis.lx`.

The host provides:

- `EVENT_NAMES`
- `request(url, options, callback)`
- `on(eventName, handler)`
- `send(eventName, payload)`
- `utils.buffer`, `utils.crypto`, and `utils.zlib`

Scripts initialize by calling `send(EVENT_NAMES.inited, { sources })`.
The app requests work by invoking the registered `EVENT_NAMES.request` handler.
Common actions are:

- `musicUrl`
- `lyric`
- `pic`

This means Mineradio needs an LX host shim, not a direct `require()` of `latest.js`.

## Proposed architecture

### 1. Provider registry

Create a small provider abstraction in `server.js` first, then extract later if needed:

```js
const providers = {
  netease: {
    search,
    getSongUrl,
    getLyric,
    getPlaylistTracks,
  },
  qq: {
    search,
    getSongUrl,
    getLyric,
    getPlaylistTracks,
  },
  lx: {
    getSongUrl,
    getLyric,
    getPic,
  },
};
```

Expose generic routes:

- `GET /api/providers`
- `GET /api/provider/:provider/search`
- `GET /api/provider/:provider/song/url`
- `GET /api/provider/:provider/lyric`
- `GET /api/provider/:provider/pic`

Keep legacy routes while the UI is migrated.

### 2. LX host shim

Add a local runner with these responsibilities:

- Load one user-selected `.js` source file from the app user data directory.
- Parse header metadata such as `@name`, `@version`, `@author`.
- Execute in a `vm` context with a restricted global object.
- Provide `globalThis.lx.request` using Mineradio's existing HTTP request helper.
- Capture `EVENT_NAMES.inited` and the `EVENT_NAMES.request` handler.
- Invoke the script handler for `musicUrl`, `lyric`, and `pic`.
- Enforce timeout, response-size limit, and clear error reporting.

Suggested file once code is split:

- `providers/lx-source-runner.js`
- `providers/lx-provider.js`

For the first implementation, this can be embedded near the provider code in `server.js` to reduce moving parts.

### 3. User settings and import

Store imported script metadata and path in user data, not in the repository:

- Windows installed app: `%APPDATA%/Mineradio/lx-sources/`
- Dev fallback: project-local `.mineradio-dev/lx-sources/`

API:

- `POST /api/lx/source/import`
- `GET /api/lx/source/status`
- `POST /api/lx/source/disable`
- `POST /api/lx/source/reload`

UI:

- Add "LX source" as a first-class source tab next to NetEase and QQ in the account/source panel.
- Import local file or URL.
- Show script name, version, enabled state, and supported source keys.
- Provide "test with current song" action.

### 4. Playback integration

Initial behavior:

- Only use LX source when the user explicitly enables it.
- Default to LX-first playback once an imported source is enabled.
- Keep NetEase/QQ as search, playlist, and account providers.
- Use NetEase/QQ playback URLs only when the user switches back to platform-first mode or when LX cannot return a playable URL.
- Match the current song into LX request shape using existing `song` fields:
  - `name`
  - `artist`
  - `album`
  - `duration`
  - `id`
  - `mid` / `songmid`
  - provider-specific source key when available

Later behavior:

- Add cross-source search if the LX script supports or requires its own search backend.
- Rank fallback matches by name, artist, and duration.

## Risk controls

- Do not bundle `pdone/lx-music-source` scripts into Mineradio.
- Do not add code whose purpose is bypassing VIP, paid, DRM, or copyright restrictions.
- Treat imported source scripts as untrusted code.
- Run with no Node `require`, no filesystem access, and no process access.
- Apply HTTP allow/deny controls later if the first implementation proves useful.
- Warn users that third-party sources are their responsibility.

## Implementation phases

1. Add provider registry while keeping existing NetEase and QQ routes. Done in `server.js`.
2. Add LX runner and status/import APIs. Done in `server.js`.
3. Add UI import/status controls. Done in `public/index.html`.
4. Add playback fallback path for current song. Done in `public/index.html`.
5. Promote LX to a first-class source tab in the account/source UI. Done in `public/index.html`.
6. Add lyric/pic fallback.
7. Add optional cross-source search and result badges.
8. Package with the feature disabled by default.

## Verification

Minimum checks after each phase:

```powershell
node --check server.js
npm start
```

Before packaging:

```powershell
npm run build:win:dir
```

Manual checks:

- App launches without imported LX script.
- NetEase playback still works as before.
- QQ playback still works as before.
- Invalid LX script fails with a visible status, not a crash.
- Imported LX script can initialize and report supported source keys.
- LX playback is only used when an imported source is enabled.
