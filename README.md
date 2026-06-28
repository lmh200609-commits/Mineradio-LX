# Mineradio-LX

Mineradio-LX 是基于 [XxHuberrr/Mineradio](https://github.com/XxHuberrr/Mineradio) 的 GPL-3.0 二次开发版本。它保留 Mineradio 的沉浸式播放器、歌词舞台、粒子视觉和 3D 歌单架，并新增落雪兼容自定义音源能力。

本仓库地址：

```text
https://github.com/lmh200609-commits/Mineradio-LX
```

请从本仓库获取二开版本，不要从原版 Mineradio 仓库下载，否则安装到的是原作者发布版，不包含 Mineradio-LX 的落雪音源适配。

## 下载 Mineradio-LX

安装包发布后，请只从本仓库 Releases 下载：

[Mineradio-LX Releases](https://github.com/lmh200609-commits/Mineradio-LX/releases)

当前二开安装包文件名：

```text
Mineradio-LX-1.1.1-Setup.exe
```

SHA256：

```text
8B4087BAF5516BAFCCF1101AE1101A936D670200BC1FC1BC1755DFCBD7958B7D
```

如果 Releases 页面暂时没有安装包，说明二开版还没有正式打包发布。此时请使用源码运行方式体验，不要下载上游原版安装包。

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

构建产物会输出到 `dist/`。本仓库已将安装包命名规则改为 `Mineradio-LX-${version}-Setup.exe`，用于和原版 Mineradio 区分。

## 二开重点

- 新增落雪兼容自定义音源导入能力。
- “账号与音源”面板中新增“落雪”独立选项，与“网易云 / QQ 音乐”同级展示。
- 网易云、QQ 音乐继续作为搜索、歌单和账号来源。
- 落雪音源启用后，播放地址可优先通过用户导入的落雪兼容音源获取。
- 支持导入本地 `.js` 音源文件，也支持直接粘贴 JS 链接导入。
- 仓库不内置、不托管、不重新分发第三方音源脚本、音乐文件、Cookie、Token 或用户私有数据。

## 导入落雪兼容音源

1. 打开 Mineradio-LX 右上角“账号与音源”。
2. 切换到“落雪”。
3. 在“导入链接”输入框中确认或替换音源 JS 链接。
4. 点击“导入链接”。
5. 状态显示“已接入”后即可使用落雪优先播放。

软件内默认预填链接来自 [pdone/lx-music-source](https://github.com/pdone/lx-music-source) 的公开说明：

```text
https://raw.githubusercontent.com/pdone/lx-music-source/main/lx/latest.js
```

如果 GitHub raw 访问不稳定，可以在上游仓库 README 中选择其他原始链接或加速链接后粘贴导入。用户实际导入后的脚本保存在本机用户数据目录，不应提交到 GitHub。

## 核心特性

- Open-Meteo 天气电台，根据当前位置、城市和天气 mood 生成播放队列
- 首页包含天气电台、每日推荐、私人电台、继续听、听歌画像和我的歌单入口
- 播放后切换到视觉舞台，歌词舞台与粒子舞台同步工作
- 基于节奏的电影镜头视觉系统
- 面向长播客和 DJ 曲目的专属视觉模式
- 歌词舞台、自定义歌词、歌词位置与视觉控制
- 自定义专辑封面上传与裁剪
- 右键唤起 3D 歌单架，支持歌单队列浏览
- 网易云音乐账号、搜索、歌单、播客等体验接入
- QQ 音乐搜索、登录态与音源补充接入
- 落雪兼容自定义音源导入、状态查看、刷新、停用和播放优先级切换
- GitHub Releases 更新检测与下载入口，目标仓库为 `lmh200609-commits/Mineradio-LX`

## 第三方音乐平台说明

Mineradio-LX 不是网易云音乐、QQ 音乐、腾讯音乐娱乐集团、LX Music 或任何第三方音乐平台的官方客户端。

项目中的第三方平台接入与落雪兼容自定义音源能力仅用于个人学习、本地客户端体验和用户自有配置的播放辅助。请遵守对应平台的用户协议、版权规则、会员权益规则和第三方脚本许可。项目不会内置第三方音源脚本，不提供音乐内容下载，不重新分发音乐内容，也不以绕过付费、绕过会员或破解音质限制为目的。

## 用户数据与隐私

登录 Cookie、搜索历史、自定义封面、自定义歌词、节奏分析缓存、用户导入的落雪兼容音源脚本等数据只应保存在本机用户数据目录或浏览器本地存储中，不应提交到仓库。

更多说明见 [PRIVACY.md](./PRIVACY.md)。

## 上游与授权

本项目基于 [XxHuberrr/Mineradio](https://github.com/XxHuberrr/Mineradio) 二次开发。Mineradio 原始设计、MR Logo、界面视觉设计与原创视觉表达归原作者所有；第三方依赖和第三方服务分别遵循其各自授权与服务条款。

本项目继承 GPL-3.0 授权。详见 [LICENSE](./LICENSE)。

Copyright (C) 2026 XxHuberrr and contributors.
