# PACKNOW-WEB

基于 Next.js 16 的项目，技术栈含 shadcn、Tailwind 4、Radix UI、Three.js 与 Agentation。

## 技术栈

### 核心

- **Next.js 16**（Turbopack）
- **React 19**
- **TypeScript 5**

### 样式与 UI

- **shadcn** + **Tailwind CSS 4** + **Radix UI**
- **Framer Motion**
- **next-themes**（暗色模式）
- **lucide-react** 图标

### 状态与数据

- **Zustand**
- **React Hook Form** + **Zod** + **@hookform/resolvers**
- **Supabase**（Auth、Storage、类型生成 `pnpm supabase:type`）
- **next-intl**（国际化）

### 3D

- **three.js** + **@react-three/fiber** + **@react-three/drei**（3D 场景）

###

- **Agentation.dev**（面向 AI 的结构化反馈标注）

### 工程化

- **ESLint** + **Prettier** + **Husky** + **lint-staged**
- **Commitlint** + **Commitizen**（cz-git）
- **pnpm**（Node ≥18）

## 开发

```bash
pnpm install
pnpm dev                 # 开发（Turbopack）
pnpm build               # 构建
pnpm start               # 生产
pnpm lint                # ESLint 并自动修复
pnpm format              # Prettier 格式化
pnpm type-check          # TypeScript 检查
pnpm commit              # 约定式提交（cz-git）
```

## 路由示例

- `/` - 首页
- `/three` - Three.js + R3F + Drei 示例页

## Supabase

1. 复制 `.env.example` 为 `.env.local`，填写 `NEXT_PUBLIC_SUPABASE_URL` 与 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。
2. 生成数据库类型：将 `package.json` 中 `supabase:type` 的 `YOUR_PROJECT_ID` 改为你的 Supabase 项目 ID，执行 `pnpm supabase:type`。
3. 代码入口：
   - 客户端：`@/services/supabase/supabase`（`supabase`、`refreshSession`、`isSupabaseConfigured`）
   - 认证：`@/hooks/useAuthStore`（`init`、`signIn`、`signUp`、`signInWithGoogle`、`signInWithOpt`、`signOut` 等）
   - 存储：`@/services/supabase/storage`（`StorageService.upload` / `getPublicUrl` / `remove`）

## Agentation

开发时在页面中点击元素可添加标注，生成带选择器与组件信息的 Markdown，便于粘贴给 AI 使用。仅在 `pnpm dev` 下启用，生产构建不会包含。详见 [agentation.dev](https://agentation.dev)。

**与 AI 助手（MCP）同步：**

1. 终端运行：`pnpm agentation:mcp`（通过 npx 启动 HTTP 4747 + stdio MCP；首次会拉取 `agentation-mcp`）。
2. **Cursor**：本项目已包含 `.cursor/mcp.json`，用 **「打开文件夹」打开 PACKNOW-WEB 目录** 时，Cursor 会使用 `npx agentation-mcp server` 启动 MCP。
   - 若使用全局 MCP 配置（如 `~/.cursor/mcp.json`），可配置为：
   ```json
   "mcpServers": {
     "agentation": {
       "command": "npx",
       "args": ["agentation-mcp", "server"]
     }
   }
   ```
3. 可选：在 `.env.local` 中设置 `NEXT_PUBLIC_AGENTATION_ENDPOINT=http://localhost:4747`，标注会实时同步到 MCP，供 AI 读取与处理。

**若 Cursor 报错「Connection closed」或「No server info found」：**

- 先用 Cursor **打开 PACKNOW-WEB 文件夹**（而非上层 PackNow），以便使用 `.cursor/mcp.json`。
- 在终端运行 `pnpm agentation:mcp`，确认能正常启动（默认 4747）、无端口占用；再在 Cursor 中刷新 MCP 或重启 Cursor。
- 若 npx 拉包失败，检查网络或代理后重试。
