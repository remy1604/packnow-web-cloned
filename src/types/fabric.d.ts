declare module 'fabric' {
  export const fabric: {
    Canvas: new (
      el: HTMLCanvasElement,
      options?: Record<string, unknown>,
    ) => {
      add: (o: unknown) => void;
      remove: (o: unknown) => void;
      getActiveObjects: () => unknown[];
      discardActiveObject: () => void;
      renderAll: () => void;
      centerObject: (o: unknown) => void;
      setActiveObject: (o: unknown) => void;
      dispose: () => void;
    };
    Image: {
      fromURL: (
        url: string,
        callback: (img: { get: (k: string) => number; scale: (n: number) => void }) => void,
        options?: { crossOrigin?: string },
      ) => void;
    };
  };
}
