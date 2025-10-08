import { LitElement, html } from 'lit';
import { adoptStylesheets } from '@/utils/style-loader.js';
import { t as translate } from '@/i18n/i18n.js';

export class ConfirmDialog extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    variant: { type: String, reflect: true },
    title: { type: String },
    message: { type: String },
    confirmText: { type: String },
    cancelText: { type: String },
  };

  async firstUpdated() {
    await adoptStylesheets(this.shadowRoot, [new URL('./confirm-dialog.css', import.meta.url)]);
  }

  t(key, params = []) { return translate(key, params); }

  constructor() {
    super();
    this.open = false;
    this.variant = 'default';
    this.title = '';
    this.message = '';
    this.confirmText = '';
    this.cancelText = '';
    this._onKeydown = this._onKeydown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this._onKeydown);
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this._onKeydown);
    super.disconnectedCallback();
  }

  _onKeydown(e) {
    if (!this.open) return;
    if (e.key === 'Escape') {
      this._cancel();
    }
    if (e.key === 'Enter') {
      this._confirm();
    }
  }

  openWith({ title, message, confirmText, cancelText, variant }) {
    this.title = title || this.t('deleteConfirmation');
    this.message = message || '';
    this.confirmText = confirmText || this.t('proceed');
    this.cancelText = cancelText || this.t('cancel');
    this.variant = variant || 'default';
    this.open = true;
    this.updateComplete.then(() => {
      const btn = this.shadowRoot.querySelector('.confirm');
      btn?.focus();
    });
  }

  _confirm() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('confirm', { bubbles: true, composed: true }));
  }

  _cancel() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('cancel', { bubbles: true, composed: true }));
  }

  _closeIconClick() { this._cancel(); }

  render() {
    return html`
      <div class="backdrop" ?hidden=${!this.open} @click=${this._cancel}></div>
      <div class="dialog" role="dialog" aria-modal="true" ?hidden=${!this.open} @click=${e => e.stopPropagation()}>
        <button class="close" aria-label="close" @click=${this._closeIconClick}>×</button>
        <div class="title">${this.title || this.t('deleteConfirmation')}</div>
        ${this.message ? html`<div class="message">${this.message}</div>` : ''}
        <div class="actions">
          <button class="btn primary confirm" @click=${this._confirm}>${this.confirmText || this.t('proceed')}</button>
          <button class="btn outline" @click=${this._cancel}>${this.cancelText || this.t('cancel')}</button>
        </div>
      </div>
    `;
  }
}

customElements.define('confirm-dialog', ConfirmDialog);


