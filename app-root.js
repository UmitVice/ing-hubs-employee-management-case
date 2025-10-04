import {LitElement, html, css} from 'lit';

export class AppRoot extends LitElement {
  static get styles() {
    return css`
      :host {
        display: grid;
        min-height: 100vh;
        margin: 0;
        box-sizing: border-box;
        place-items: center;
      }

      .title {
        font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
        font-size: clamp(24px, 6vw, 48px);
        font-weight: 600;
        letter-spacing: 0.5px;
        text-align: center;
        color: #111;
      }

      @media (prefers-color-scheme: dark) {
        :host {
          background: #121212;
        }
        .title {
          color: #f5f5f5;
        }
      }
    `;
  }

  render() {
    return html`<div class="title">ING Hub case study</div>`;
  }
}

customElements.define('app-root', AppRoot);


