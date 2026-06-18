'use client';

import { useEffect, useRef } from 'react';

export function useModalDialog(open: boolean) {
  const ref = useRef<HTMLDialogElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) {
      return undefined;
    }

    if (open && !wasOpenRef.current) {
      dialog.showModal();
      wasOpenRef.current = true;
    } else if (!open && wasOpenRef.current) {
      dialog.close();
      wasOpenRef.current = false;
    }

    return undefined;
  }, [open]);

  return ref;
}
