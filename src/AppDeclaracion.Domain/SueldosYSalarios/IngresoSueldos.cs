namespace AppDeclaracion.Domain.SueldosYSalarios;

/// <summary>
/// Totales anuales tomados de la(s) Constancia(s) de Percepciones y Retenciones
/// emitidas por el/los patrón(es).
/// </summary>
public class IngresoSueldos
{
    private IngresoSueldos() { }

    public IngresoSueldos(Guid declaracionAnualId, decimal ingresoGravado, decimal isrRetenido)
    {
        if (ingresoGravado < 0 || isrRetenido < 0)
        {
            throw new ArgumentException("Los importes no pueden ser negativos.");
        }

        DeclaracionAnualId = declaracionAnualId;
        IngresoGravado = ingresoGravado;
        IsrRetenido = isrRetenido;
    }

    public int Id { get; private set; }

    public Guid DeclaracionAnualId { get; private set; }

    public decimal IngresoGravado { get; private set; }

    public decimal IsrRetenido { get; private set; }
}
