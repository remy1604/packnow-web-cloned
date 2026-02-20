'use client';

import type { LucideIcon } from 'lucide-react';
import { MousePointer2, Upload, ImageIcon, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { StudioTool } from '../types';

interface ToolItemProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function ToolItem({ icon: Icon, label, isActive, onClick }: ToolItemProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        'flex flex-col gap-1.5 rounded-md px-3 py-4 h-auto',
        isActive && 'bg-muted text-foreground',
      )}
    >
      <Icon className="size-5 shrink-0" />
      <span className="text-xs">{label}</span>
    </Button>
  );
}

interface EditorToolSidebarProps {
  activeTool: StudioTool;
  onToolChange: (tool: StudioTool) => void;
  onDelete: () => void;
}

export function EditorToolSidebar({ activeTool, onToolChange, onDelete }: EditorToolSidebarProps) {
  return (
    <aside className="flex w-[72px] shrink-0 flex-col gap-1 border-r bg-muted/20 p-2">
      <ToolItem
        icon={MousePointer2}
        label="选择"
        isActive={activeTool === 'select'}
        onClick={() => onToolChange('select')}
      />
      <ToolItem
        icon={Upload}
        label="上传"
        isActive={activeTool === 'upload'}
        onClick={() => onToolChange('upload')}
      />
      <ToolItem
        icon={ImageIcon}
        label="图片"
        isActive={activeTool === 'images'}
        onClick={() => onToolChange('images')}
      />
      <ToolItem
        icon={Trash2}
        label="删除"
        isActive={activeTool === 'delete'}
        onClick={() => {
          onToolChange('delete');
          onDelete();
        }}
      />
    </aside>
  );
}
