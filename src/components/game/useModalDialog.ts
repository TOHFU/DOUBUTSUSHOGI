'use client';

import { useCallback, useLayoutEffect, useRef } from 'react';

function syncDialogOpenState(dialog: HTMLDialogElement, open: boolean, wasOpenRef: { current: boolean }) {
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
