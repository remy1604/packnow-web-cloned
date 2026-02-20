export type StudioTool = 'select' | 'upload' | 'images' | 'delete';

export interface DieLineCanvasRef {
  addImage: (url: string) => void;
  deleteSelected: () => void;
  getCanvas: () => unknown;
}
