export {};

declare global {
  interface HTMLDialogElement extends HTMLElement {
    open: boolean;
    returnValue: string;
    show(): void;
    showModal(): void;
    close(returnValue?: string): void;
  }
}
