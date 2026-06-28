# Open-source release checklist for the LX-source fork

This fork is based on `XxHuberrr/Mineradio` and remains licensed under GPL-3.0.

Use this checklist before publishing the fork to a personal GitHub repository or creating a public release.

## Repository identity

- Keep the upstream attribution in `README.md`, `NOTICE.md`, and `LICENSE`.
- Make it clear that this is a modified fork, not an official NetEase Cloud Music, QQ Music, Tencent Music, LX Music, or upstream Mineradio client.
- If publishing GitHub Releases from your own repository, update these fields in `package.json`:
  - `build.publish[0].owner`
  - `build.publish[0].repo`
  - `mineradio.update.owner`
  - `mineradio.update.repo`
- Do not change those fields to placeholder values in committed source. Use your real GitHub owner and repository name once the target repository is decided.

## What must not be committed

- `node_modules/`
- `dist/`, `win-unpacked/`, installer files, `.blockmap`, `.asar`
- `.cookie`, `.qq-cookie`, `.env`, logs, caches
- `lx-sources/`
- Any user-imported LX-compatible source script
- Any music file, platform Cookie, token, QR-login state, or account data

The repository `.gitignore` already excludes these common local artifacts.

## LX-compatible custom source policy

- The app provides a local import/runtime adapter.
- The repository does not bundle third-party source scripts.
- The UI may prefill a public upstream source URL so users can review and import it themselves.
- Current prefilled URL: `https://raw.githubusercontent.com/pdone/lx-music-source/main/lx/latest.js`.
- Users are responsible for the legality, license, and platform-rule compliance of scripts they import.
- Documentation should describe the feature as "user-provided custom source support", not as paid-access bypassing.

## Required checks

Run these before pushing:

```powershell
node --check server.js
@'
const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]).filter(s => s.trim());
const vm = require('vm');
scripts.forEach((script, i) => new vm.Script(script, { filename: `inline-script-${i + 1}.js` }));
console.log(`checked ${scripts.length} inline scripts`);
'@ | node -
git diff --check
```

When dependencies are installed and Electron is available:

```powershell
npm start
npm run build:win:dir
```

## Suggested GitHub repository settings

- Visibility: public, only after the checklist above is clean.
- License: GPL-3.0, inherited from upstream.
- Topics: `electron`, `music-player`, `netease-cloud-music`, `qq-music`, `lx-source`, `windows`.
- Default branch protection: require at least one local build/test pass before releases.
- Releases: do not upload installers until you have checked the release owner/repo fields and verified the package in a clean install.
