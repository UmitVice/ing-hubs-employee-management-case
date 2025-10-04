import {LitElement, html, css} from 'lit';

export class AppRoot extends LitElement {
  static get styles() {
    return css`
      :host {
        display: grid;
        min-height: var(--min-height-screen);
        margin: var(--spacing-0);
        box-sizing: border-box;
        place-items: center;
        background-color: var(--color-background-light);
      }

      .title {
        font-family: var(--font-family-base);
        font-size: clamp(var(--font-size-large), 6vw, var(--font-size-xxl));
        font-weight: 600;
        letter-spacing: var(--letter-spacing-tight);
        text-align: center;
        color: var(--color-primary);
        padding: var(--spacing-l);
      }

    `;
  }

  render() {
    return html`<div class="title">ING Hub case study</div>`;
  }
}

customElements.define('app-root', AppRoot);


