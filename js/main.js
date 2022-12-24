import SeguimientoPresupuesto from "./seguimiento-presupuesto.js";
import sinSoporte from "./sin-soporte.js";

if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  new sinSoporte("#app");
} else {
  new SeguimientoPresupuesto("#app");
}
