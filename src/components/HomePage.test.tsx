import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HomePage } from './HomePage';

describe('HomePage', () => {
  it('タイトルと説明文を表示する', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('heading', { name: 'DOUBUTSUSHOGI' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('動物将棋のオンライン対戦プラットフォーム'),
    ).toBeInTheDocument();
  });
});
