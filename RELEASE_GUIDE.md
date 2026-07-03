# Mineradio-LX 发版与更新指南

这份文档只用于维护者发版。用户端能否收到更新，主要取决于版本号、GitHub Release 和上传文件是否完整。

## 用户端更新机制

Mineradio-LX 会检查本仓库的 GitHub Releases：

```text
https://github.com/lmh200609-commits/Mineradio-LX/releases
```

当 Release 里的最新版本号高于用户本地版本时，软件内会提示更新。用户点击更新后，客户端下载新安装包，并由用户确认运行安装程序。

## 每次发版前必须做的事

1. 确认代码已经提交。
2. 修改 `package.json` 里的版本号。
3. 构建 Windows 安装包。
4. 在 GitHub 创建新的 Release。
5. 上传安装包、blockmap 和 `latest.yml`。
6. 用旧版本客户端验证能检测到新版本。

## 版本号规则

每次想让用户收到更新，都必须提升 `package.json` 中的版本号。

示例：

```json
{
  "version": "1.1.2"
}
```

如果代码变了，但版本号仍然是 `1.1.1`，用户端通常不会认为有新版本。

建议规则：

```text
修复小问题：1.1.1 -> 1.1.2
新增功能：1.1.1 -> 1.2.0
重大不兼容变更：1.1.1 -> 2.0.0
```

## 构建安装包

在仓库根目录执行：

```bash
npm install
npm run build:win
```

构建成功后，产物位于 `dist/`。

以 `1.1.2` 为例，需要关注这些文件：

```text
dist/Mineradio-LX-1.1.2-Setup.exe
dist/Mineradio-LX-1.1.2-Setup.exe.blockmap
dist/latest.yml
```

## 创建 GitHub Release

Release tag 建议和版本号保持一致：

```text
v1.1.2
```

Release 标题建议：

```text
Mineradio-LX v1.1.2
```

Release 内容建议至少包含：

```markdown
## 更新内容

- 修复或新增的功能 1
- 修复或新增的功能 2

## 安装说明

下载 `Mineradio-LX-1.1.2-Setup.exe` 后运行安装即可。
```

## 必须上传的文件

每次 Release 至少上传：

```text
Mineradio-LX-版本号-Setup.exe
Mineradio-LX-版本号-Setup.exe.blockmap
latest.yml
```

其中 `latest.yml` 很重要。客户端会通过它或 GitHub Release 信息判断最新安装包。如果漏传，用户可能无法正常收到更新。

## 发布后验证

推荐使用旧版本客户端验证。

检查点：

1. 启动旧版本 Mineradio-LX。
2. 等待右上角更新入口完成检测。
3. 确认提示的新版本号正确。
4. 点击更新，确认能开始下载。
5. 下载完成后，确认能打开安装包。

也可以直接访问本地接口检查：

```text
http://127.0.0.1:3000/api/update/latest
```

如果返回的 `updateAvailable` 为 `true`，说明客户端认为有新版本。

## 常见问题

### 用户收不到更新

优先检查：

- `package.json` 版本号是否已经提升。
- GitHub Release tag 是否是新版本。
- Release 是否已经发布，不是 Draft。
- 是否上传了 `latest.yml`。
- 安装包文件名是否包含 `Mineradio-LX` 和正确版本号。
- 用户网络是否能访问 GitHub 或配置的加速线路。

### 下载到了原版 Mineradio

检查 Release 资产文件名。二开版安装包应类似：

```text
Mineradio-LX-1.1.2-Setup.exe
```

如果文件名是：

```text
Mineradio-1.1.2-Setup.exe
```

通常说明打包配置或上传文件不正确。

### 上传了新安装包但客户端仍提示旧版本

通常是 `latest.yml` 没有同步上传，或者 `latest.yml` 里面仍然指向旧安装包。重新执行构建，并把新的 `latest.yml` 上传到同一个 Release。

## 推荐发版命令清单

```bash
npm install
npm run build:win
```

然后在 GitHub Release 上传：

```text
dist/Mineradio-LX-版本号-Setup.exe
dist/Mineradio-LX-版本号-Setup.exe.blockmap
dist/latest.yml
```

发布完成后，用旧版本客户端验证更新提示和下载流程。
