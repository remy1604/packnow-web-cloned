'use client';

import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Center } from '@react-three/drei';
import {
  getPreset,
  getPresetForBagType,
  type PackScenePresetKey,
  type PackScenePreset,
  type ModelGroupConfig,
} from '@/lib/pack-scene-presets';

// 模型组件：按 mockup 的 scale/position/rotation 放置 GLB
function PouchModel({ url, config }: { url: string; config: ModelGroupConfig }) {
  const { scene } = useGLTF(url);
  const s = config.scale.x;

  return (
    <primitive
      object={scene}
      scale={[s, config.scale.y, config.scale.z]}
      position={[config.position.x, config.position.y, config.position.z]}
      rotation={[config.rotation._x, config.rotation._y, config.rotation._z]}
    />
  );
}

export interface PackSceneProps {
  /** 预设 key，与 docs 下 mockup 类型对应 */
  preset?: PackScenePresetKey;
  /** 或直接传袋型 id（stand-up / gusseted / flat-bottom 等），内部映射到预设 */
  bagType?: string;
  /** 或直接传完整配置，优先级高于 preset/bagType */
  config?: PackScenePreset;
  /** 可选：覆盖默认场景缩放倍数，仅当某页需要更大/更小 3D 时使用，不传则用默认值 */
  sceneScaleMultiplier?: number;
  /** 可选：相机距离，仅当某页需要更大/更小 3D 时使用，不传则用默认值 */
  cameraDistance?: number;
}

function useResolvedConfig(props: PackSceneProps): PackScenePreset {
  return useMemo(() => {
    if (props.config) return props.config;
    if (props.bagType) return getPresetForBagType(props.bagType);
    return getPreset(props.preset ?? 'stand-up-pouch');
  }, [props.config, props.bagType, props.preset]);
}

/** 场景整体缩放倍数（预设基础上再放大），默认值勿改，其他页已按此调好 */
const DEFAULT_SCENE_SCALE_MULTIPLIER = 8;
const DEFAULT_CAMERA_DISTANCE = 20;

export default function PackagingScene(props: PackSceneProps) {
  const { modelUrl, hdrUrl, groupConfig, sceneScale = 1.15 } = useResolvedConfig(props);
  const multiplier = props.sceneScaleMultiplier ?? DEFAULT_SCENE_SCALE_MULTIPLIER;
  const cameraZ = props.cameraDistance ?? DEFAULT_CAMERA_DISTANCE;
  const scale = sceneScale * multiplier;

  return (
    <div className="size-full min-h-[300px] bg-muted/30">
      <Canvas shadows className="!block size-full" camera={{ position: [0, 0, cameraZ], fov: 32 }}>
        <Suspense fallback={null}>
          <Environment files={hdrUrl} />
          <directionalLight intensity={0.4} position={[-80, 391, 300]} castShadow />

          <Center>
            <group scale={[scale, scale, scale]}>
              <PouchModel key={modelUrl} url={modelUrl} config={groupConfig} />
            </group>
          </Center>

          <ContactShadows position={[0, -4.37, 0]} opacity={0.5} scale={10} blur={2} far={4.5} />
        </Suspense>

        <OrbitControls makeDefault minDistance={6} maxDistance={45} target={[0, 0, 0]} />
      </Canvas>
    </div>
  );
}
