import './confirm-dialog.js';
import {fixture, assert, oneEvent} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('confirm-dialog', () => {
  test('opens with API and emits confirm', async () => {
    const el = await fixture(html`<confirm-dialog></confirm-dialog>`);
    el.openWith({ title: 'Title', message: 'Msg' });
    await el.updateComplete;
    const confirmButton = el.shadowRoot.querySelector('.confirm');
    setTimeout(() => confirmButton.click());
    const evt = await oneEvent(el, 'confirm');
    assert.exists(evt);
  });

  test('cancel closes and emits cancel', async () => {
    const el = await fixture(html`<confirm-dialog></confirm-dialog>`);
    el.openWith({ title: 'Title', message: 'Msg' });
    await el.updateComplete;
    const cancelButton = el.shadowRoot.querySelector('.btn.outline');
    setTimeout(() => cancelButton.click());
    const evt = await oneEvent(el, 'cancel');
    assert.exists(evt);
    assert.isFalse(el.open);
  });
});


