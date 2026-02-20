'use client';

import { useCallback, useEffect, useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImagePanelProps {
  isOpen: boolean;
  files: File[];
  onAddImage: (url: string) => void;
  onClose: () => void;
}

export function ImagePanel({ isOpen, files, onAddImage, onClose }: ImagePanelProps) {
  const [thumbUrls, setThumbUrls] = useState<string[]>([]);

  useEffect(() => {
    if (files.length === 0) {
      queueMicrotask(() => setThumbUrls([]));
      return;
    }
    const urls = files.map((f) => URL.createObjectURL(f));
    queueMicrotask(() => setThumbUrls(urls));
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  const handleFileClick = useCallback(
    (file: File) => {
      const url = URL.createObjectURL(file);
      onAddImage(url);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      onClose();
    },
    [onAddImage, onClose],
  );

  if (!isOpen) return null;

  return (
    <div className="flex min-w-[280px] w-full flex-col border-r bg-background">
      <div className="border-b p-3">
        <h3 className="text-sm font-medium">已选素材</h3>
        <p className="text-muted-foreground mt-0.5 text-xs">点击图片添加到刀版图</p>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-2 gap-2 p-3">
          {files.length === 0 ? (
            <div className="text-muted-foreground col-span-2 flex flex-col items-center justify-center gap-2 py-8 text-center text-xs">
              <ImageIcon className="size-8" />
              <span>请先点击工具栏「上传」添加图片</span>
            </div>
          ) : (
            files.map((file, i) => {
              const url = file.type.startsWith('image/') ? thumbUrls[i] : null;
              return (
                <button
                  key={`${file.name}-${i}`}
                  type="button"
                  onClick={() => handleFileClick(file)}
                  className={cn(
                    'flex aspect-square w-full items-center justify-center overflow-hidden rounded-md border bg-muted/50 transition hover:border-primary hover:bg-muted',
                  )}
                >
                  {url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- blob URL from createObjectURL
                    <img src={url} alt={file.name} className="size-full object-contain" />
                  ) : (
                    <span className="text-muted-foreground text-xs">{file.name}</span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
