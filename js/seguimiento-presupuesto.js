export default class SeguimientoPresupuesto {
  constructor(querySelectorString) {
    this.root = document.querySelector(querySelectorString);
    this.root.innerHTML = SeguimientoPresupuesto.html();

    this.root.querySelector(".nueva-entrada").addEventListener("click", () => {
      this.btnNuevaEntrada();
    });

    // cargar los datos iniciales de Local Storage
    this.cargar();
  }

  static html() {
    return `
     <h1>Seguimiento De Presupuesto</h1>
    <table class="seguimiento-presupuesto">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Tipo</th>
            <th>Cantidad</th>
            <th></th>
          </tr>
        </thead>

        <tbody class="entradas"></tbody>

        <tbody>
          <tr>
            <td colspan="5" class="controles">
              <button type="button" class="nueva-entrada">Nueva Entrada</button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5" class="resumen">
              <strong>Total:</strong>
              <span class="total">₡0.0</span>
            </td>
          </tr>
        </tfoot>
      </table>`;
  }

  static entradaHtml() {
    return ` <tr>
            <td>
              <input type="date" class="input input-fecha" />
            </td>
            <td>
              <input
                type="text"
                class="input input-descripcion"
                placeholder="Agrega una descripción ( ej. salario. facturas. etc. )"
              />
            </td>
            <td>
              <select name="" id="" class="input input-tipo">
                <option value="ingreso">Ingreso</option>
                <option value="gasto">Gasto</option>
              </select>
            </td>
            <td>
              <input type="number" class="input input-cantidad" />
            </td>
            <td>
              <button type="button" class="eliminar-entrada">&#10005;</button>
            </td>
          </tr>`;
  }

  cargar() {
    const entradas = JSON.parse(
      localStorage.getItem("entradas-seguimiento-presupuesto") || "[]"
    );

    console.log(entradas);

    for (const entrada of entradas) {
      this.agregarEntrada(entrada);
    }

    this.actualizarResumen();
  }

  actualizarResumen() {
    const total = this.obtenerFilaEntrada().reduce((total, fila) => {
      const cantidad = fila.querySelector(".input-cantidad").value;
      const esGasto = fila.querySelector(".input-tipo").value === "gasto";
      const modificador = esGasto ? -1 : 1;

      return total + cantidad * modificador;
    }, 0);

    console.log(total);

    const formatearTotal = this.formatearEntrada(total);

    this.root.querySelector(".total").textContent = formatearTotal;
  }

  guardar() {
    console.log(this.obtenerFilaEntrada());
    const datos = this.obtenerFilaEntrada().map((fila) => {
      return {
        fecha: fila.querySelector(".input-fecha").value,
        descripcion: fila.querySelector(".input-descripcion").value,
        tipo: fila.querySelector(".input-tipo").value,
        cantidad: parseFloat(fila.querySelector(".input-cantidad").value),
      };
    });

    console.log(datos);

    localStorage.setItem(
      "entradas-seguimiento-presupuesto",
      JSON.stringify(datos)
    );
  }

  agregarEntrada(entrada = {}) {
    this.root
      .querySelector(".entradas")
      .insertAdjacentHTML("beforeend", SeguimientoPresupuesto.entradaHtml());

    const fila = this.root.querySelector(".entradas tr:last-of-type");

    fila.querySelector(".input-fecha").value =
      entrada.fecha || new Date().toISOString().replace(/T.*/, "");

    fila.querySelector(".input-descripcion").value = entrada.descripcion || "";

    fila.querySelector(".input-tipo").value = entrada.tipo || "ingreso";

    fila.querySelector(".input-cantidad").value = entrada.cantidad || 0;

    fila.querySelector(".eliminar-entrada").addEventListener("click", (e) => {
      this.btnEliminarEntrada(e);
    });

    fila.querySelectorAll(".input").forEach((input) => {
      input.addEventListener("input", () => {
        this.guardar();
        this.actualizarResumen();
      });
    });
  }

  obtenerFilaEntrada() {
    return Array.from(this.root.querySelectorAll(".entradas tr"));
  }

  btnNuevaEntrada() {
    this.agregarEntrada();
  }

  btnEliminarEntrada(e) {
    console.log("Entrada eliminada");
    e.target.closest("tr").remove();

    this.guardar();
    this.actualizarResumen();
  }

  formatearEntrada(total) {
    const formatear = new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
    }).format(total);

    return formatear;
  }
}
