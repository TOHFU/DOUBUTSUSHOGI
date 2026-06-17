/**
 * Figma YOU WIN (54:69) / YOU LOSE (54:159) フレームの配置。
 * message (54:120 / 54:210): 327×290, 画面中央 y=277
 * RETRY (55:236): message 下端付近に重なる位置 top=203
 */
export const RESULT_OVERLAY_LAYOUT = {
  message: { width: 327, height: 290 },
  retry: {
    width: 158,
    height: 78,
    /** message 上端からの offset (px) */
    top: 153,
  },
} as const;
