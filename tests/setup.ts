import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup, configure } from '@testing-library/react';

configure({ asyncUtilTimeout: 4000 });

// JSDOM has no viewport or native dialog top layer; browser behavior is covered
// separately by the Playwright suite. These shims only support DOM flow tests.
HTMLElement.prototype.scrollTo = vi.fn();
HTMLElement.prototype.scrollIntoView = vi.fn();
HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute('open', '');
};
HTMLDialogElement.prototype.close = function () {
  this.removeAttribute('open');
};
beforeEach(() => {
  localStorage.clear();
  location.hash = '/home';
});
afterEach(() => cleanup());
