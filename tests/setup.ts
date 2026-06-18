import 'fake-indexeddb/auto';

import '@testing-library/jest-dom/vitest';

import { afterAll, afterEach, beforeAll } from 'vitest';

import { server } from './mocks/server';

const DialogConstructor = (
  globalThis as typeof globalThis & {
    HTMLDialogElement?: { prototype: HTMLDialogElement };
  }
).HTMLDialogElement;

if (DialogConstructor && !DialogConstructor.prototype.showModal) {
  DialogConstructor.prototype.showModal = function showModal(
    this: HTMLDialogElement,
  ) {
    this.setAttribute('open', '');
  };
}

if (DialogConstructor && !DialogConstructor.prototype.close) {
  DialogConstructor.prototype.close = function close(this: HTMLDialogElement) {
    this.removeAttribute('open');
  };
}

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
