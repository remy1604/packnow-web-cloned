'use client';

import { useCallback, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import type { DieLineCanvasRef } from '../types';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

type FabricCanvas = {
  add: (o: unknown) => void;
  remove: (o: unknown) => void;
  getActiveObjects: () => unknown[];
  discardActiveObject: () => void;
  renderAll: () => void;
  centerObject: (o: unknown) => void;
  setActiveObject: (o: unknown) => void;
  dispose: () => void;
};

export const DieLineCanvas = forwardRef<DieLineCanvasRef, object>(function DieLineCanvas(_, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);

  const addImage = useCallback((url: string) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    import('fabric').then(({ fabric }) => {
      fabric.Image.fromURL(
        url,
        (img: { get: (k: string) => number; scale: (n: number) => void }) => {
          const w = img.get('width') ?? 1;
          const h = img.get('height') ?? 1;
          const maxW = CANVAS_WIDTH * 0.5;
          const maxH = CANVAS_HEIGHT * 0.5;
          const scale = Math.min(maxW / w, maxH / h, 1);
          img.scale(scale);
          canvas.add(img);
          canvas.centerObject(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
        },
        { crossOrigin: 'anonymous' },
      );
    });
  }, []);

  const deleteSelected = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObjects();
    active.forEach((obj: unknown) => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.renderAll();
  }, []);

  const getCanvas = useCallback(() => fabricRef.current, []);

  useImperativeHandle(ref, () => ({ addImage, deleteSelected, getCanvas }), [
    addImage,
    deleteSelected,
    getCanvas,
  ]);

  useEffect(() => {
    if (!canvasRef.current) return;
    let disposed = false;
    import('fabric').then(({ fabric }) => {
      if (disposed || !canvasRef.current) return;
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        backgroundColor: '#fafafa',
        preserveObjectStacking: true,
      });
      fabricRef.current = canvas as unknown as FabricCanvas;
    });
    return () => {
      disposed = true;
      if (fabricRef.current) {
        fabricRef.current.dispose();
        fabricRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex items-center justify-center overflow-hidden rounded-lg border bg-muted/30">
      <canvas ref={canvasRef} />
    </div>
  );
});
