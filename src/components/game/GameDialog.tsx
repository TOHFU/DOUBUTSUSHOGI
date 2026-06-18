'use client';

import type { ReactNode } from 'react';

import { useModalDialog } from '@/components/game/useModalDialog';

type GameDialogVariant = 'menu' | 'gameStart' | 'result';

interface GameDialogProps {
  open: boolean;
  'aria-label': string;
  variant: GameDialogVariant;
  children: ReactNode;
}

export function GameDialog({
  open,
  'aria-label': ariaLabel,
  variant,
  children,
}: GameDialogProps) {
  const ref = useModalDialog(open);

  return (
    <dialog
      ref={ref}
      aria-label={ariaLabel}
      data-variant={variant}
      className="game-dialog"
    >
      {children}
    </dialog>
  );
}
