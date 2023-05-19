const template = document.createElement("template");
template.innerHTML = `
<style>
    :host {
      display: block;
      width: 100%;
      background-color: #000;
      background-size: cover;
      padding: 56.25% 0 0 0;
      position: relative;
    }
    :host p {
      font-size: 24px;
      color: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    :host iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
</style>
`;

class VimeoEmbed extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    const clone = template.content.cloneNode(true);
    shadow.appendChild(clone);
  }

  static get observedAttributes() {
    return ["vimeoId"];
  }

  get vimeoId() {
    return this.getAttribute("vimeoId");
  }

  set vimeoId(val) {
    this.setAttribute("vimeoId", val);
  }

  async connectedCallback() {
    const loadingStatusDisp = document.createElement('p');
    this.shadowRoot.appendChild(loadingStatusDisp);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          try {
            loadingStatusDisp.textContent = "Loading...";
            const endpoint = `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${this.vimeoId}`;
            const response = await fetch(endpoint);
            if (!response.ok) {
              throw new Error('Error: ' + response.status);
            }
            const data = await response.json();
            this.shadowRoot.innerHTML = data.html;
          }
          catch(err) {
            loadingStatusDisp.textContent = `Video failed to load (${err.message})`;
            console.log(err.message);
          }
        }
      });
    });
    observer.observe(this);

  }
}
customElements.define("vimeo-embed", VimeoEmbed);

