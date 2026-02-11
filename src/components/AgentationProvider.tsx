'use client';

import { Agentation } from 'agentation';

/**
 * Agentation.dev 开发辅助：仅在开发环境启用
 * - 点击页面元素可添加标注，生成带选择器与组件信息的 Markdown，便于粘贴给 AI
 * - 需与 MCP 同步时：先运行 pnpm agentation:mcp，并设置 NEXT_PUBLIC_AGENTATION_ENDPOINT=http://localhost:4747
 */
export function AgentationProvider() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const endpoint =
    typeof process.env.NEXT_PUBLIC_AGENTATION_ENDPOINT === 'string' &&
    process.env.NEXT_PUBLIC_AGENTATION_ENDPOINT.length > 0
      ? process.env.NEXT_PUBLIC_AGENTATION_ENDPOINT
      : undefined;

  return <Agentation endpoint={endpoint} />;
}
