import path from 'node:path';

import { playwright } from '@vitest/browser-playwright';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const GAME_FRAME_WIDTH = 390;
const GAME_FRAME_HEIGHT = 844;

export default defineConfig({
  plugins: [react()],
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        {
          browser: 'chromium',
          viewport: {
            width: GAME_FRAME_WIDTH,
            height: GAME_FRAME_HEIGHT,
          },
        },
      ],
      headless: true,
      expect: {
        toMatchScreenshot: {
          comparatorName: 'pixelmatch',
          comparatorOptions: {
            threshold: 0.2,
            allowedMismatchedPixelRatio: 0.02,
          },
        },
      },
    },
    include: ['src/**/*.visual.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'next/image': path.resolve(__dirname, './tests/mocks/next-image.tsx'),
    },
  },
});
