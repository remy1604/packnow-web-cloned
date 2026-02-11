'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  useGLTF,
  Environment,
  ContactShadows,
  PerspectiveCamera,
} from '@react-three/drei';

// 模型配置类型
interface ModelConfig {
  scale: { x: number; y: number; z: number };
  position: { x: number; y: number; z: number };
  rotation: { _x: number; _y: number; _z: number };
}

// 模型组件
function PouchModel({ url, config }: { url: string; config: ModelConfig }) {
  const { scene } = useGLTF(url);

  // 根据 JSON 中的 scale (0.05) 进行缩放
  const s = config.scale.x;

  return (
    <primitive
      object={scene}
      scale={[s, s, s]}
      position={[config.position.x, config.position.y, config.position.z]}
      rotation={[config.rotation._x, config.rotation._y, config.rotation._z]}
    />
  );
}

export default function PackagingScene() {
  // 从你提供的 JSON 中提取的关键参数
  const modelUrl =
    'https://cdn.pacdora.com/static/blender/dabb750d-84aa-43d9-82e1-79df79867cd2.glb';
  const hdrUrl = 'https://cdn.pacdora.com/hdr/b9f66e36-632a-4686-a4da-bfafe7604154.hdr';

  const groupConfig = {
    scale: { x: 0.05, y: 0.05, z: 0.05 },
    position: { x: -0.019, y: 0.016, z: -0.018 },
    rotation: { _x: 0, _y: 0, _z: 0 },
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#fafafa' }}>
      <Canvas shadows>
        {/* 1. 相机配置: FOV 30, 位置参考 JSON */}
        <PerspectiveCamera makeDefault fov={30} position={[0.67, -0.01, 23.3]} />

        <Suspense fallback={null}>
          {/* 2. 环境光照明: 使用 JSON 中的 HDR 地址 */}
          <Environment files={hdrUrl} />

          {/* 3. 主灯光 (SunLight) */}
          <directionalLight intensity={0.4} position={[-80, 391, 300]} castShadow />

          {/* 4. 模型加载 */}
          <PouchModel url={modelUrl} config={groupConfig} />

          {/* 5. 落地阴影 (对应 planeY: -10) */}
          <ContactShadows position={[0, -4.37, 0]} opacity={0.5} scale={10} blur={2} far={4.5} />
        </Suspense>

        <OrbitControls makeDefault minDistance={5} maxDistance={50} />
      </Canvas>
    </div>
  );
}
