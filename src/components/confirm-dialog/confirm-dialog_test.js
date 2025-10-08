import './confirm-dialog.js';
import {fixture, assert, oneEvent} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('confirm-dialog', () => {
  test('renders with default state', async () => {
    const el = await fixture(html`<confirm-dialog></confirm-dialog>`);
    await el.updateComplete;
    
    assert.isFalse(el.open);
    assert.isUndefined(el.title);
    assert.isUndefined(el.message);
  });

  test('opens with API and emits confirm', async () => {
    const el = await fixture(html`<confirm-dialog></confirm-dialog>`);
    el.openWith({ title: 'Title', message: 'Msg' });
    await el.updateComplete;
    
    assert.isTrue(el.open);
    assert.equal(el.title, 'Title');
    assert.equal(el.message, 'Msg');
    
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

  test('displays title and message correctly', async () => {
    const el = await fixture(html`<confirm-dialog></confirm-dialog>`);
    el.openWith({ title: 'Delete Item', message: 'Are you sure you want to delete this item?' });
    await el.updateComplete;
    
    const titleElement = el.shadowRoot.querySelector('.dialog-title');
    const messageElement = el.shadowRoot.querySelector('.dialog-message');
    
    assert.equal(titleElement.textContent.trim(), 'Delete Item');
    assert.equal(messageElement.textContent.trim(), 'Are you sure you want to delete this item?');
  });

  test('handles custom button text', async () => {
    const el = await fixture(html`<confirm-dialog></confirm-dialog>`);
    el.openWith({ 
      title: 'Title', 
      message: 'Msg',
      confirmText: 'Yes, Delete',
      cancelText: 'No, Keep'
    });
    await el.updateComplete;
    
    const confirmButton = el.shadowRoot.querySelector('.confirm');
    const cancelButton = el.shadowRoot.querySelector('.btn.outline');
    
    assert.equal(confirmButton.textContent.trim(), 'Yes, Delete');
    assert.equal(cancelButton.textContent.trim(), 'No, Keep');
  });

  test('handles default button text', async () => {
    const el = await fixture(html`<confirm-dialog></confirm-dialog>`);
    el.openWith({ title: 'Title', message: 'Msg' });
    await el.updateComplete;
    
    const confirmButton = el.shadowRoot.querySelector('.confirm');
    const cancelButton = el.shadowRoot.querySelector('.btn.outline');
    
    assert.include(confirmButton.textContent, 'Confirm');
    assert.include(cancelButton.textContent, 'Cancel');
  });

  test('closes dialog when confirm is clicked', async () => {
    const el = await fixture(html`<confirm-dialog></confirm-dialog>`);
    el.openWith({ title: 'Title', message: 'Msg' });
    await el.updateComplete;
    
    assert.isTrue(el.open);
    
    const confirmButton = el.shadowRoot.querySelector('.confirm');
    confirmButton.click();
    await el.updateComplete;
    
    assert.isFalse(el.open);
  });

  test('closes dialog when cancel is clicked', async () => {
    const el = await fixture(html`<confirm-dialog></confirm-dialog>`);
    el.openWith({ title: 'Title', message: 'Msg' });
    await el.updateComplete;
    
    assert.isTrue(el.open);
    
    const cancelButton = el.shadowRoot.querySelector('.btn.outline');
    cancelButton.click();
    await el.updateComplete;
    
    assert.isFalse(el.open);
  });

  test('handles keyboard navigation', async () => {
    const el = await fixture(html`<confirm-dialog></confirm-dialog>`);
    el.openWith({ title: 'Title', message: 'Msg' });
    await el.updateComplete;
    
    const confirmButton = el.shadowRoot.querySelector('.confirm');
    const cancelButton = el.shadowRoot.querySelector('.btn.outline');
    
    // Tab should move between buttons
    confirmButton.focus();
    assert.equal(document.activeElement, confirmButton);
    
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
    confirmButton.dispatchEvent(tabEvent);
    
    assert.equal(document.activeElement, cancelButton);
  });

  test('handles Escape key to close', async () => {
    const el = await fixture(html`<confirm-dialog></confirm-dialog>`);
    el.openWith({ title: 'Title', message: 'Msg' });
    await el.updateComplete;
    
    assert.isTrue(el.open);
    
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(escapeEvent);
    await el.updateComplete;
    
    assert.isFalse(el.open);
  });

  test('handles Enter key on confirm button', async () => {
    const el = await fixture(html`<confirm-dialog></confirm-dialog>`);
    el.openWith({ title: 'Title', message: 'Msg' });
    await el.updateComplete;
    
    const confirmButton = el.shadowRoot.querySelector('.confirm');
    confirmButton.focus();
    
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    confirmButton.dispatchEvent(enterEvent);
    await el.updateComplete;
    
    assert.isFalse(el.open);
  });

  test('handles Space key on confirm button', async () => {
    const el = await fixture(html`<confirm-dialog></confirm-dialog>`);
    el.openWith({ title: 'Title', message: 'Msg' });
    await el.updateComplete;
    
    const confirmButton = el.shadowRoot.querySelector('.confirm');
    confirmButton.focus();
    
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
    confirmButton.dispatchEvent(spaceEvent);
    await el.updateComplete;
    
    assert.isFalse(el.open);
  });

  test('handles backdrop click to close', async () => {
    const el = await fixture(html`<confirm-dialog></confirm-dialog>`);
    el.openWith({ title: 'Title', message: 'Msg' });
    await el.updateComplete;
    
    const backdrop = el.shadowRoot.querySelector('.backdrop');
    backdrop.click();
    await el.updateComplete;
    
    assert.isFalse(el.open);
  });

  test('does not close when clicking dialog content', async () => {
    const el = await fixture(html`<confirm-dialog></confirm-dialog>`);
    el.openWith({ title: 'Title', message: 'Msg' });
    await el.updateComplete;
    
    const dialogContent = el.shadowRoot.querySelector('.dialog-content');
    dialogContent.click();
    await el.updateComplete;
    
    assert.isTrue(el.open);
  });

  test('has proper accessibility attributes', async () => {
    const el = await fixture(html`<confirm-dialog></confirm-dialog>`);
    el.openWith({ title: 'Title', message: 'Msg' });
    await el.updateComplete;
    
    const dialog = el.shadowRoot.querySelector('.dialog');
    assert.equal(dialog.getAttribute('role'), 'dialog');
    assert.equal(dialog.getAttribute('aria-modal'), 'true');
    assert.equal(dialog.getAttribute('aria-labelledby'), 'dialog-title');
    
    const titleElement = el.shadowRoot.querySelector('.dialog-title');
    assert.equal(titleElement.id, 'dialog-title');
  });

  test('traps focus within dialog', async () => {
    const el = await fixture(html`<confirm-dialog></confirm-dialog>`);
    el.openWith({ title: 'Title', message: 'Msg' });
    await el.updateComplete;
    
    const confirmButton = el.shadowRoot.querySelector('.confirm');
    const cancelButton = el.shadowRoot.querySelector('.btn.outline');
    
    // Focus should start on confirm button
    assert.equal(document.activeElement, confirmButton);
    
    // Tab should cycle between buttons
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
    confirmButton.dispatchEvent(tabEvent);
    assert.equal(document.activeElement, cancelButton);
    
    cancelButton.dispatchEvent(tabEvent);
    assert.equal(document.activeElement, confirmButton);
  });

  test('handles multiple open/close cycles', async () => {
    const el = await fixture(html`<confirm-dialog></confirm-dialog>`);
    
    // Open first time
    el.openWith({ title: 'First', message: 'First message' });
    await el.updateComplete;
    assert.isTrue(el.open);
    
    // Close
    el.close();
    await el.updateComplete;
    assert.isFalse(el.open);
    
    // Open second time
    el.openWith({ title: 'Second', message: 'Second message' });
    await el.updateComplete;
    assert.isTrue(el.open);
    assert.equal(el.title, 'Second');
    assert.equal(el.message, 'Second message');
  });

  test('handles rapid button clicks', async () => {
    const el = await fixture(html`<confirm-dialog></confirm-dialog>`);
    el.openWith({ title: 'Title', message: 'Msg' });
    await el.updateComplete;
    
    const confirmButton = el.shadowRoot.querySelector('.confirm');
    
    // Click multiple times rapidly
    confirmButton.click();
    confirmButton.click();
    confirmButton.click();
    await el.updateComplete;
    
    // Should only close once
    assert.isFalse(el.open);
  });

  test('handles empty title and message', async () => {
    const el = await fixture(html`<confirm-dialog></confirm-dialog>`);
    el.openWith({ title: '', message: '' });
    await el.updateComplete;
    
    assert.isTrue(el.open);
    assert.equal(el.title, '');
    assert.equal(el.message, '');
  });

  test('handles undefined title and message', async () => {
    const el = await fixture(html`<confirm-dialog></confirm-dialog>`);
    el.openWith({});
    await el.updateComplete;
    
    assert.isTrue(el.open);
    assert.isUndefined(el.title);
    assert.isUndefined(el.message);
  });

  test('handles long text content', async () => {
    const longTitle = 'This is a very long title that should be handled properly by the dialog component';
    const longMessage = 'This is a very long message that should be handled properly by the dialog component and should wrap correctly within the dialog boundaries';
    
    const el = await fixture(html`<confirm-dialog></confirm-dialog>`);
    el.openWith({ title: longTitle, message: longMessage });
    await el.updateComplete;
    
    const titleElement = el.shadowRoot.querySelector('.dialog-title');
    const messageElement = el.shadowRoot.querySelector('.dialog-message');
    
    assert.equal(titleElement.textContent.trim(), longTitle);
    assert.equal(messageElement.textContent.trim(), longMessage);
  });

  test('handles special characters in text', async () => {
    const specialTitle = 'Title with <script>alert("xss")</script> & "quotes"';
    const specialMessage = 'Message with <b>HTML</b> & "quotes"';
    
    const el = await fixture(html`<confirm-dialog></confirm-dialog>`);
    el.openWith({ title: specialTitle, message: specialMessage });
    await el.updateComplete;
    
    const titleElement = el.shadowRoot.querySelector('.dialog-title');
    const messageElement = el.shadowRoot.querySelector('.dialog-message');
    
    // Should escape HTML
    assert.notInclude(titleElement.innerHTML, '<script>');
    assert.notInclude(messageElement.innerHTML, '<b>');
  });

  test('handles component lifecycle', async () => {
    const el = await fixture(html`<confirm-dialog></confirm-dialog>`);
    await el.updateComplete;
    
    // Test connectedCallback
    assert.exists(el.shadowRoot);
    
    // Test disconnectedCallback
    el.remove();
    // Should not throw error
    assert.isTrue(true);
  });
});


