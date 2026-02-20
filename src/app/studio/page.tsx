'use client';

import { Suspense, useState, useRef, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Group, Panel } from 'react-resizable-panels';
import { Button } from '@/components/ui/button';
import { EditorToolSidebar } from './components/EditorToolSidebar';
import { ImagePanel } from './components/ImagePanel';
import { UploadPanel } from './components/UploadPanel';
import type { StudioTool } from './types';
import type { DieLineCanvasRef } from './types';

const EDITOR_WIDTH_MIN = 30;
const EDITOR_WIDTH_MAX = 70;
const EDITOR_WIDTH_DEFAULT = 45;
const RESIZE_HANDLE_WIDTH = 10;

const PackScene = dynamic(() => import('@/components/PackScene'), {
  ssr: false,
  loading: () => (
    <div className="bg-muted flex h-full min-h-[400px] items-center justify-center rounded-lg">
      <span className="text-muted-foreground">加载 3D 预览…</span>
    </div>
  ),
});

const DieLineCanvas = dynamic(
  () => import('./components/DieLineCanvas').then((m) => ({ default: m.DieLineCanvas })),
  {
    ssr: false,
    loading: () => (
      <div className="bg-muted flex min-h-[400px] items-center justify-center rounded-lg">
        <span className="text-muted-foreground">加载画布…</span>
      </div>
    ),
  },
);

const FLOATING_PANEL_WIDTH = 320;

function StudioPageContent() {
  const searchParams = useSearchParams();
  const bagType = searchParams.get('bagType') ?? undefined;
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [activeTool, setActiveTool] = useState<StudioTool>('select');
  const [editorWidthPercent, setEditorWidthPercent] = useState(EDITOR_WIDTH_DEFAULT);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, percent: 0 });
  const canvasRef = useRef<DieLineCanvasRef>(null);

  const handleAddImage = useCallback((url: string) => {
    canvasRef.current?.addImage(url);
  }, []);

  const handleDelete = useCallback(() => {
    canvasRef.current?.deleteSelected();
  }, []);

  const handleToolChange = useCallback((tool: StudioTool) => {
    setActiveTool(tool);
  }, []);

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX, percent: editorWidthPercent };
    },
    [editorWidthPercent],
  );

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.width - RESIZE_HANDLE_WIDTH;
      const startPercent = dragStartRef.current.percent / 100;
      const startPx = total * startPercent;
      const delta = e.clientX - dragStartRef.current.x;
      const newPx = startPx + delta;
      const newPercent = (newPx / total) * 100;
      const clamped = Math.max(EDITOR_WIDTH_MIN, Math.min(EDITOR_WIDTH_MAX, newPercent));
      setEditorWidthPercent(clamped);
    };
    const onEnd = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="flex h-[calc(100vh-3.5rem)] w-full select-none"
      style={{ userSelect: isDragging ? 'none' : undefined }}
    >
      {/* 左侧：2D 编辑器（宽度可拖拽调节） */}
      <div
        className="bg-muted/10 flex shrink-0 flex-col overflow-hidden p-4"
        style={{ width: `calc(${editorWidthPercent}% - ${RESIZE_HANDLE_WIDTH / 2}px)` }}
      >
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm font-medium">刀版图编辑器</span>
            <span className="text-muted-foreground text-xs">
              上传 / 选择 / 图片 / 删除；拖拽右侧分隔条可调节与 3D 预览的宽度
            </span>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/checkout">结账</Link>
          </Button>
        </div>
        <div
          className="relative flex min-h-0 flex-1 overflow-hidden rounded-lg border bg-background"
          id="editor-inner"
        >
          <Group orientation="horizontal" className="flex h-full w-full">
            <Panel id="toolbar" minSize={72} maxSize={72} defaultSize={72}>
              <EditorToolSidebar
                activeTool={activeTool}
                onToolChange={handleToolChange}
                onDelete={handleDelete}
              />
            </Panel>
            <Panel id="canvas" minSize={240} defaultSize={100}>
              <main className="flex h-full min-w-0 items-center justify-center p-4">
                <DieLineCanvas ref={canvasRef} />
              </main>
            </Panel>
          </Group>
          {/* 浮在工具栏右侧的上传/图片面板 */}
          {(activeTool === 'upload' || activeTool === 'images') && (
            <div
              className="border-border bg-background shadow-lg absolute left-[72px] top-0 z-10 flex h-full flex-col overflow-hidden rounded-r-lg border-l"
              style={{ width: FLOATING_PANEL_WIDTH }}
            >
              <UploadPanel
                isOpen={activeTool === 'upload'}
                files={uploadedFiles}
                onFilesChange={setUploadedFiles}
                onClose={() => setActiveTool('select')}
              />
              <ImagePanel
                isOpen={activeTool === 'images'}
                files={uploadedFiles}
                onAddImage={handleAddImage}
                onClose={() => setActiveTool('select')}
              />
            </div>
          )}
        </div>
      </div>

      {/* 可拖拽分隔条：拖拽调节 2D 编辑区与 3D 预览区宽度 */}
      <div
        id="studio-main-sep"
        role="separator"
        aria-valuenow={editorWidthPercent}
        aria-valuemin={EDITOR_WIDTH_MIN}
        aria-valuemax={EDITOR_WIDTH_MAX}
        tabIndex={0}
        onMouseDown={handleResizeStart}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') {
            setEditorWidthPercent((p) => Math.max(EDITOR_WIDTH_MIN, p - 2));
          } else if (e.key === 'ArrowRight') {
            setEditorWidthPercent((p) => Math.min(EDITOR_WIDTH_MAX, p + 2));
          }
        }}
        className="bg-border flex shrink-0 cursor-col-resize items-center justify-center transition-colors hover:bg-muted-foreground/30"
        style={{
          width: RESIZE_HANDLE_WIDTH,
          background: isDragging ? 'hsl(var(--primary) / 0.4)' : undefined,
        }}
      >
        <span className="text-muted-foreground/60 pointer-events-none text-xs">⋮⋮</span>
      </div>

      {/* 右侧：3D 预览（宽度随分隔条变化） */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background p-4">
        <p className="text-muted-foreground mb-2 text-sm font-medium">3D 实时预览</p>
        <div className="relative flex min-h-[300px] flex-1 items-center justify-center overflow-hidden rounded-lg border">
          <div className="size-full min-h-[280px]">
            <PackScene bagType={bagType} />
          </div>
        </div>
        <p className="text-muted-foreground mt-2 text-xs">
          支持 360° 旋转；材质随哑光/亮光选项变化；拖拽左侧分隔条可调整与 2D 编辑区的宽度
        </p>
      </div>
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-3.5rem)] w-full items-center justify-center bg-muted/20">
          <span className="text-muted-foreground">加载 Studio…</span>
        </div>
      }
    >
      <StudioPageContent />
    </Suspense>
  );
}
