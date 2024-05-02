class FooterBar extends HTMLElement {
    _shadowRoot = null;
    _style = null;
  
    constructor() {
      super();
  
      this._shadowRoot = this.attachShadow({ mode: 'open' });
      this._style = document.createElement('style');
    }
  
    _updateStyle() {
      this._style.textContent = `
        :host {
          display: block;
        }
  
        div {
          padding: 24px 20px;
          background-color : #2b384b;
          text-align: center;
          margin-top : 100px;
          color : #a9abb2;
        }
      `;
    }
  
    _emptyContent() {
      this._shadowRoot.innerHTML = '';
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      this._emptyContent();
      this._updateStyle();
  
      this._shadowRoot.appendChild(this._style);
      this._shadowRoot.innerHTML += `      
        <div>
          Quick Notes &copy 2024 All Rights Reserved
        </div>
      `;
    }
  }
  
  customElements.define('footer-bar', FooterBar);
  