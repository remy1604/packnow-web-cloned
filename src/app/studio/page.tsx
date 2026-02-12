'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Upload, ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const PackScene = dynamic(() => import('@/components/PackScene'), {
  ssr: false,
  loading: () => (
    <div className="bg-muted flex h-full min-h-[400px] items-center justify-center rounded-lg">
      <span className="text-muted-foreground">加载 3D 预览…</span>
    </div>
  ),
});

export default function StudioPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) setUploadedFiles(Array.from(files));
  };

  return (
    <div className="grid h-[calc(100vh-3.5rem)] grid-cols-1 lg:grid-cols-3">
      {/* 左侧：上传素材 */}
      <aside className="border-r bg-muted/20 flex flex-col overflow-auto p-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Upload className="size-4" />
              上传素材
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="border-input hover:bg-accent flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-8 transition-colors">
              <input
                type="file"
                accept="image/*,.pdf"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <ImageIcon className="text-muted-foreground size-10" />
              <span className="text-muted-foreground text-sm">
                点击或拖拽上传 Logo、图案、设计稿（PDF/AI/图片）
              </span>
            </label>
            {uploadedFiles.length > 0 && (
              <>
                <Separator />
                <p className="text-muted-foreground text-xs">已选 {uploadedFiles.length} 个文件</p>
              </>
            )}
          </CardContent>
        </Card>
      </aside>

      {/* 中间：2D 刀版图 */}
      <main className="bg-muted/10 flex flex-col p-4">
        <div className="bg-muted flex flex-1 items-center justify-center rounded-lg border-2 border-dashed">
          <div className="text-center">
            <p className="text-muted-foreground text-sm font-medium">刀版图编辑器</p>
            <p className="text-muted-foreground mt-1 text-xs">
              展示所选袋型的展开刀线轮廓，支持贴图缩放、旋转、拖拽（安全区内）
            </p>
          </div>
        </div>
      </main>

      {/* 右侧：3D 渲染 */}
      <aside className="flex flex-col border-l bg-background p-4">
        <p className="text-muted-foreground mb-2 text-sm font-medium">3D 实时预览</p>
        <div className="relative flex min-h-[300px] flex-1 items-center justify-center overflow-hidden rounded-lg border">
          <div className="size-full min-h-[280px]">
            <PackScene />
          </div>
        </div>
        <p className="text-muted-foreground mt-2 text-xs">
          支持 360° 旋转；材质随哑光/亮光选项变化
        </p>
      </aside>
    </div>
  );
}
