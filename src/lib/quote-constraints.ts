/**
 * 报价页互斥规则 - 对应 docs/prd.md 功能性强制互斥逻辑
 */

/** 吸嘴组（选后禁止拉链/气阀/扎口） */
export const SPOUT_PROCESS_IDS = ['spout-corner', 'spout-center'];
/** 气阀（选后禁止吸嘴） */
export const PROCESS_ID_VALVE = 'valve';
/** 拉链组（与扎口互斥） */
export const ZIPPER_PROCESS_IDS = ['zipper', 'zipper-pocket', 'zipper-child'];
/** 铁丝扎口（仅风琴袋/平底袋可选，与拉链互斥） */
export const PROCESS_ID_TIN_TIE = 'tin-tie';
/** 透明窗口（牛皮纸时不可选） */
export const PROCESS_ID_CLEAR_WINDOW = 'clear-window';

export function hasAnyZipper(processes: string[]): boolean {
  return processes.some((id) => ZIPPER_PROCESS_IDS.includes(id));
}
export function hasAnySpout(processes: string[]): boolean {
  return processes.some((id) => SPOUT_PROCESS_IDS.includes(id));
}

/** 牛皮纸材质 ID（吸嘴选中时禁止）*/
export const KRAFT_MATERIAL_IDS = ['kraft-pe', 'kraft-pla'];

/** 可选铁丝扎口的袋型：仅侧风琴袋、平底袋 */
export const BAG_TYPES_ALLOWING_TIN_TIE = ['gusseted', 'flat-bottom'];

/** 牛皮纸时不可选的表面处理（仅允许哑光/无） */
export const FINISH_IDS_DISABLED_FOR_KRAFT = [
  'gloss-lamination',
  'spot-uv',
  'soft-touch',
  'holographic',
];

/**
 * 根据当前工艺选择，返回可选材质列表（吸嘴选中时排除牛皮纸）
 */
export function filterMaterialsByProcesses<T extends { id: string }>(
  materials: T[],
  processes: string[],
): T[] {
  if (hasAnySpout(processes)) {
    return materials.filter((m) => !KRAFT_MATERIAL_IDS.includes(m.id));
  }
  return materials;
}

/**
 * 根据当前袋型，判断是否允许选铁丝扎口
 */
export function isTinTieAllowedForBagType(bagType: string): boolean {
  return BAG_TYPES_ALLOWING_TIN_TIE.includes(bagType);
}

/**
 * 根据当前材质，判断某工艺是否因牛皮纸限制而不可选（透明窗口、亮光/镭射表面处理）
 */
export function isProcessDisabledForKraft(processId: string, materialId: string): boolean {
  if (!KRAFT_MATERIAL_IDS.includes(materialId)) return false;
  return processId === PROCESS_ID_CLEAR_WINDOW || FINISH_IDS_DISABLED_FOR_KRAFT.includes(processId);
}

/**
 * 选中某工艺后需强制取消的其它工艺（互斥）
 * 返回 [要取消的 id, ...]
 */
export function getProcessIdsToClearOnSelect(selectedId: string): string[] {
  if (SPOUT_PROCESS_IDS.includes(selectedId)) {
    return [PROCESS_ID_VALVE, PROCESS_ID_TIN_TIE, ...ZIPPER_PROCESS_IDS];
  }
  if (selectedId === PROCESS_ID_VALVE) return [...SPOUT_PROCESS_IDS];
  if (selectedId === PROCESS_ID_TIN_TIE) return [...ZIPPER_PROCESS_IDS];
  if (ZIPPER_PROCESS_IDS.includes(selectedId)) return [PROCESS_ID_TIN_TIE];
  return [];
}

/**
 * 选中吸嘴时，若当前材质为牛皮纸，应切换到的默认材质 ID（第一个非牛皮纸）
 */
export function getDefaultMaterialWhenSpoutSelected<T extends { id: string }>(
  materials: T[],
  currentMaterialId: string,
): string {
  if (!KRAFT_MATERIAL_IDS.includes(currentMaterialId)) return currentMaterialId;
  const firstNonKraft = materials.find((m) => !KRAFT_MATERIAL_IDS.includes(m.id));
  return firstNonKraft?.id ?? currentMaterialId;
}

/**
 * 当前工艺是否应因互斥/袋型/材质而不可选（仅用于 UI 禁用或隐藏）
 */
export function isProcessOptionDisabled(
  processId: string,
  bagType: string,
  materialId: string,
  currentProcesses: string[],
): boolean {
  // Spout is mutually exclusive with zipper/tin-tie/valve.
  // Keep this guard in disabled logic (not only "clear on select"),
  // so user cannot re-enable conflicting options after selecting one side.
  if (ZIPPER_PROCESS_IDS.includes(processId) && hasAnySpout(currentProcesses)) return true;
  if (SPOUT_PROCESS_IDS.includes(processId) && hasAnyZipper(currentProcesses)) return true;
  if (processId === PROCESS_ID_TIN_TIE && hasAnySpout(currentProcesses)) return true;

  if (processId === PROCESS_ID_TIN_TIE && !isTinTieAllowedForBagType(bagType)) return true;
  if (processId === PROCESS_ID_TIN_TIE && hasAnyZipper(currentProcesses)) return true;
  if (ZIPPER_PROCESS_IDS.includes(processId) && currentProcesses.includes(PROCESS_ID_TIN_TIE))
    return true;
  if (processId === PROCESS_ID_VALVE && hasAnySpout(currentProcesses)) return true;
  if (SPOUT_PROCESS_IDS.includes(processId) && currentProcesses.includes(PROCESS_ID_VALVE))
    return true;
  if (isProcessDisabledForKraft(processId, materialId)) return true;
  return false;
}
