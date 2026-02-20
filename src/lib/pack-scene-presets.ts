/**
 * 3D 包装场景预设：使用本地 GLB 实时渲染
 * 模型文件放在 public/mockups（与 src/assets/mockups 同步），避免构建时需 .glb loader
 */

export interface ModelGroupConfig {
  scale: { x: number; y: number; z: number };
  position: { x: number; y: number; z: number };
  rotation: { _x: number; _y: number; _z: number };
}

export interface PackScenePreset {
  modelUrl: string;
  hdrUrl: string;
  groupConfig: ModelGroupConfig;
  /** 可选：场景整体缩放，用于不同模型尺寸统一视觉 */
  sceneScale?: number;
}

/** mockup 中 scale 有两种约定：0.05 与 50，统一为 0.05 量级便于 Three 展示 */
function normalizeScale(s: { x: number; y: number; z: number }): {
  x: number;
  y: number;
  z: number;
} {
  const x = s.x > 1 ? s.x / 1000 : s.x;
  const y = s.y > 1 ? s.y / 1000 : s.y;
  const z = s.z > 1 ? s.z / 1000 : s.z;
  return { x, y, z };
}

/** flat-pouch / gusset-bag 的 GLB 单位或包围盒较小，需放大以与 stand-up 视觉一致并居中 */
const FLAT_POUCH_GUSSET_SCALE = 4;

/** 预设 key：与 docs/袋型对应 */
export type PackScenePresetKey =
  | 'stand-up-pouch'
  | 'flat-pouch'
  | 'flat-bottom-bag'
  | 'strange-pouch'
  | 'gusset-bag';

const DEFAULT_HDR = 'https://cdn.pacdora.com/hdr/b9f66e36-632a-4686-a4da-bfafe7604154.hdr';

/** 本地 GLB：public/mockups 下的文件（源文件在 src/assets/mockups，构建前需同步到 public） */
const GLB = {
  standUp: '/mockups/stand-up-pouch.glb',
  gusset: '/mockups/gusset-bag.glb',
  flatPouch: '/mockups/flat-pouch.glb',
  flatBottom: '/mockups/flat-bottm-bag.glb',
};

/**
 * 预设配置：模型来自 src/assets/mockups/*.glb
 */
export const PACK_SCENE_PRESETS: Record<PackScenePresetKey, PackScenePreset> = {
  'stand-up-pouch': {
    modelUrl: GLB.standUp,
    hdrUrl: DEFAULT_HDR,
    groupConfig: {
      scale: { x: 0.05, y: 0.05, z: 0.05 },
      position: { x: -0.0191554597832011, y: 0.01632061284102493, z: -0.01879023661535939 },
      rotation: { _x: 0, _y: 0, _z: 0 },
    },
    sceneScale: 1.15,
  },
  'flat-pouch': {
    modelUrl: GLB.flatPouch,
    hdrUrl: DEFAULT_HDR,
    groupConfig: {
      scale: {
        x: FLAT_POUCH_GUSSET_SCALE,
        y: FLAT_POUCH_GUSSET_SCALE,
        z: FLAT_POUCH_GUSSET_SCALE,
      },
      position: { x: 0, y: 0, z: 0 },
      rotation: { _x: 0, _y: 0, _z: 0 },
    },
    sceneScale: 1.15,
  },
  'flat-bottom-bag': {
    modelUrl: GLB.flatBottom,
    hdrUrl: 'https://cdn.pacdora.com/web-assets/7c4487d5-9e85-4b55-901c-d1a7a97a7e08.hdr',
    groupConfig: {
      scale: normalizeScale({ x: 50, y: 50, z: 50 }),
      position: { x: 0, y: 0, z: 0 },
      rotation: { _x: 0, _y: 0, _z: 0 },
    },
    sceneScale: 1.15,
  },
  'strange-pouch': {
    modelUrl: GLB.gusset,
    hdrUrl: DEFAULT_HDR,
    groupConfig: {
      scale: {
        x: FLAT_POUCH_GUSSET_SCALE,
        y: FLAT_POUCH_GUSSET_SCALE,
        z: FLAT_POUCH_GUSSET_SCALE,
      },
      position: { x: 0, y: 0, z: 0 },
      rotation: { _x: 0, _y: 0, _z: 0 },
    },
    sceneScale: 1.15,
  },
  'gusset-bag': {
    modelUrl: GLB.gusset,
    hdrUrl: 'https://cdn.pacdora.com/web-assets/7c4487d5-9e85-4b55-901c-d1a7a97a7e08.hdr',
    groupConfig: {
      scale: {
        x: FLAT_POUCH_GUSSET_SCALE,
        y: FLAT_POUCH_GUSSET_SCALE,
        z: FLAT_POUCH_GUSSET_SCALE,
      },
      position: { x: 0, y: 0, z: 0 },
      rotation: { _x: 0, _y: 0, _z: 0 },
    },
    sceneScale: 1.15,
  },
};

/** 仅 4 种袋型 id 与 3D 预设的映射 */
export const BAG_TYPE_TO_PRESET: Record<string, PackScenePresetKey> = {
  'stand-up': 'stand-up-pouch',
  gusseted: 'gusset-bag',
  'flat-pouch': 'flat-pouch',
  'flat-bottom': 'flat-bottom-bag',
};

export function getPresetForBagType(bagTypeId: string): PackScenePreset {
  const key = BAG_TYPE_TO_PRESET[bagTypeId] ?? 'stand-up-pouch';
  return PACK_SCENE_PRESETS[key];
}

export function getPreset(key: PackScenePresetKey): PackScenePreset {
  return PACK_SCENE_PRESETS[key];
}
