namespace AppDeclaracion.Domain.Common;

/// <summary>
/// Contribución de un régimen a la base acumulable de la declaración anual:
/// el ingreso que se suma a la base gravable y los pagos ya anticipados al SAT
/// (ISR retenido o pagos provisionales) que se acreditarán contra el ISR del ejercicio.
/// </summary>
public sealed record AportacionBaseAcumulable(decimal IngresoAcumulable, decimal PagosAnticipados);
