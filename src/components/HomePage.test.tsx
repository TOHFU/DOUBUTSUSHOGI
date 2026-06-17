import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import { HomePage } from './HomePage';

afterEach(() => {
  cleanup();
});

describe('HomePage', () => {
  it('ゲーム開始オーバーレイを表示する', () => {
    render(<HomePage />);

    expect(screen.getByTestId('game-start-button')).toBeInTheDocument();
  });

  it('ゲーム開始後に将棋盤を表示する', async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    await user.click(screen.getByTestId('game-start-button'));

    expect(screen.getByRole('grid', { name: '将棋盤' })).toBeInTheDocument();
  });
});
