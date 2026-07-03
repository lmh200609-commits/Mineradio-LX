# Mineradio-LX 让音乐完全免费！

Mineradio-LX 是基于 [XxHuberrr/Mineradio](https://github.com/XxHuberrr/Mineradio) 二次开发的 Windows 桌面音乐播放器。这个版本的重点是为 Mineradio 增加落雪兼容自定义音源能力，让播放地址可以优先从用户配置的 LX 音源获取。用户依然可以登入网易云和qq音乐用来获取自己的歌单，只不过该版将免费开源的洛雪音源进行了接入，实现了音源免费播放。

最新更新点：1.修复来原本歌词无法显示和获取的问题

本项目仓库：

```text
https://github.com/lmh200609-commits/Mineradio-LX
```

> 重要：请从本仓库下载 Mineradio-LX。不要从原版 Mineradio 仓库下载，否则安装到的是原作者发布版，不包含本项目的落雪音源适配。

## 下载二开版

Windows 用户请进入本仓库 Releases 页面下载：

[https://github.com/lmh200609-commits/Mineradio-LX/releases](https://github.com/lmh200609-commits/Mineradio-LX/releases)

当前推荐安装包：

```text
Mineradio-LX-1.1.1-Setup.exe
```

也可以直接打开当前发布版下载页：

[下载 Mineradio-LX-1.1.1-Setup.exe](https://github.com/lmh200609-commits/Mineradio-LX/releases/download/v1.1.1-lx.1/Mineradio-LX-1.1.1-Setup.exe)

请确认文件名包含 `Mineradio-LX`。如果下载到的是 `Mineradio-1.1.1-Setup.exe`，那通常是原版安装包，不是本二开版本。

## 这个版本改了什么

- 新增“落雪”音源页，与“网易云 / QQ 音乐”同级展示。
- 支持导入落雪兼容 `.js` 音源文件。
- 支持直接粘贴 JS 链接导入音源。
- 支持查看、刷新、停用 LX 音源状态。
- 支持“优先使用 LX 音源播放”和“仅使用 LX 音源播放”的播放策略。
- 保留网易云、QQ 音乐作为搜索、歌单、账号和歌曲信息来源。
- 安装包名称、应用名称、更新仓库都改为 Mineradio-LX，避免和原版混淆。

## 落雪音源怎么使用

项目没有把第三方音源脚本直接提交进仓库，也不重新分发音乐内容。软件内提供导入入口，并默认预填公开说明中的 LX 音源链接，用户只需要在软件里确认导入。

操作步骤：

1. 安装并打开 `Mineradio-LX`。
2. 点击右上角“账号与音源”。
3. 切换到“落雪”页。
4. 使用默认预填链接，或替换为你自己的落雪兼容音源 JS 链接。
5. 点击“导入链接”。
6. 状态显示“已接入”后，播放时即可优先尝试 LX 音源。

默认预填链接：

```text
https://raw.githubusercontent.com/pdone/lx-music-source/main/lx/latest.js
```

如果 GitHub raw 访问不稳定，可以到 [pdone/lx-music-source](https://github.com/pdone/lx-music-source) 查看其他可用链接，再粘贴到 Mineradio-LX 的“导入链接”中。

## 从源码运行

```bash
git clone https://github.com/lmh200609-commits/Mineradio-LX.git
cd Mineradio-LX
npm install
npm start
```

构建 Windows 安装包：

```bash
npm run build:win
```

构建产物位于 `dist/`，安装包命名规则为：

```text
Mineradio-LX-${version}-Setup.exe
```

## 和原版的关系

Mineradio-LX 是 GPL-3.0 下的二次开发版本。原版 Mineradio 的设计、界面视觉、MR Logo 和基础播放器能力来自上游项目 [XxHuberrr/Mineradio](https://github.com/XxHuberrr/Mineradio)。

本仓库的主要差异集中在：

- LX 音源导入与运行；
- LX 播放 URL 获取；
- LX 播放策略设置；
- Mineradio-LX 独立打包、更新和发布配置。

## 合规说明

Mineradio-LX 不是网易云音乐、QQ 音乐、腾讯音乐娱乐集团、LX Music 或任何第三方音乐平台的官方客户端。

项目中的第三方平台接入与落雪兼容自定义音源能力仅用于个人学习、本地客户端体验和用户自有配置的播放辅助。请遵守对应平台的用户协议、版权规则、会员权益规则和第三方脚本许可。

本项目不会内置第三方音源脚本，不提供音乐内容下载，不重新分发音乐内容，也不以绕过付费、绕过会员或破解音质限制为目的。

## 用户数据

登录 Cookie、搜索历史、自定义封面、自定义歌词、节奏分析缓存、用户导入的 LX 音源脚本等数据只应保存在本机用户数据目录或浏览器本地存储中，不应提交到仓库。

更多说明见 [PRIVACY.md](./PRIVACY.md)。

## 授权

本项目继承 GPL-3.0 授权。详见 [LICENSE](./LICENSE)。

Copyright (C) 2026 XxHuberrr and contributors.
