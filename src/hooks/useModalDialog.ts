'use client';

import { useCallback, useLayoutEffect, useRef } from 'react';

function syncDialogOpenState(
  dialog: HTMLDialogElement,
  open: boolean,
  wasOpenRef: { current: boolean },
) {
  if (open && !wasOpenRef.current) {
    dialog.showModal();
    wasOpenRef.current = true;
    return;
  }

  if (!open && wasOpenRef.current) {
    dialog.close();
    wasOpenRef.current = false;
  }
}

/**
 * ネイティブ dialog 要素の開閉を open prop と同期するフック。
 * @param open - dialog を開くかどうか
 * @returns dialog 要素に渡す ref コールバック
 */
export function useModalDialog(open: boolean) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const wasOpenRef = useRef(false);

  const setDialogRef = useCallback(
    (dialog: HTMLDialogElement | null) => {
      dialogRef.current = dialog;

      if (!dialog) {
        return;
      }

      syncDialogOpenState(dialog, open, wasOpenRef);
    },
    [open],
  );

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return undefined;
    }

    syncDialogOpenState(dialog, open, wasOpenRef);

    return undefined;
  }, [open]);

  return setDialogRef;
}
