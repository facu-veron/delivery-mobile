const UMBRAL = 40_000;
const PORCENTAJE = 0.1;
const MONTO_FIJO = 6_000;

export function calcularCostoEnvio(montoProductos: number): number {
  if (montoProductos < UMBRAL) {
    return Math.round(montoProductos * PORCENTAJE);
  }
  return MONTO_FIJO;
}
