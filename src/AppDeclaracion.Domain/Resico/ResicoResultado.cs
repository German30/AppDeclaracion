namespace AppDeclaracion.Domain.Resico;

public sealed record ResicoResultado(
    decimal IngresoAnual,
    decimal IsrCausadoAnual,
    decimal IsrRetenidoAnual,
    bool ExcedeLimiteAnual)
{
    public decimal Saldo => IsrCausadoAnual - IsrRetenidoAnual;

    public bool EsSaldoAFavor => Saldo < 0;
}
