class NoteList extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
  }

  connectedCallback() {
    this.render();
  }

  updateStyle() {
    this._style.textContent = `
      :host {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
      }
    `;
  }

  render() {
    this.updateStyle();

    const slot = document.createElement("slot");
    this._shadowRoot.append(this._style, slot);
  }
}

customElements.define("note-list", NoteList);
