export default class sinSoporte {
  constructor(querySelectorString) {
    this.root = document.querySelector(querySelectorString);
    this.root.innerHTML = sinSoporte.html();
  }

  static html() {
    return `
    <p class="sin-soporte">Versión para dispositivos móviles aún no disponible. Por favor ingresa desde una laptop o PC.</p>
`;
  }
}
