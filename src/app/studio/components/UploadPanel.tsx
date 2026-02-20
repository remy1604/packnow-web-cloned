'use client';

import { useCallback, useState } from 'react';
import { Upload, ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface UploadPanelProps {
  isOpen: boolean;
  files: File[];
  onFilesChange: (files: File[]) => void;
  onClose: () => void;
}

export function UploadPanel({ isOpen, files, onFilesChange, onClose }: UploadPanelProps) {
  void onClose; // reserved for close button / a11y
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files;
      if (selected) onFilesChange(Array.from(selected));
    },
    [onFilesChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files;
      if (dropped?.length) onFilesChange(Array.from(dropped));
    },
    [onFilesChange],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="flex min-w-[280px] w-full flex-col border-r bg-background">
      <div className="border-b p-3">
        <h3 className="text-sm font-medium">上传素材</h3>
        <p className="text-muted-foreground mt-0.5 text-xs">
          点击或拖拽上传后，在「图片」中添加到刀版图
        </p>
      </div>
      <div className="flex-1 overflow-auto p-3">
        <Card
          className={
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-primary/15 bg-gradient-to-br from-card via-primary/5 to-card'
          }
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-primary">
              <Upload className="size-4" />
              上传素材
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label
              className={`border-input hover:bg-accent flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-8 transition-colors ${isDragging ? 'border-primary bg-accent' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                type="file"
                accept="image/*,.pdf"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <ImageIcon className="text-muted-foreground size-10" />
              <span className="text-muted-foreground text-center text-sm">
                点击或拖拽上传 Logo、图案、设计稿（PDF/AI/图片）
              </span>
            </label>
            {files.length > 0 && (
              <>
                <Separator />
                <p className="text-muted-foreground text-xs">已选 {files.length} 个文件</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
