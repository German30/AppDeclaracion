namespace AppDeclaracion.Domain.Declaraciones;

public class ResultadoCalculo
{
    private ResultadoCalculo() { }

    public ResultadoCalculo(
        Guid declaracionAnualId,
        decimal isrResicoCausado,
        decimal isrResicoRetenido,
        decimal ingresoAcumulableTotal,
        decimal deduccionesPersonalesAplicadas,
        decimal baseGravableAcumulable,
        decimal isrCausadoAcumulable,
        decimal pagosAnticipadosAcumulable)
    {
        DeclaracionAnualId = declaracionAnualId;
        IsrResicoCausado = isrResicoCausado;
        IsrResicoRetenido = isrResicoRetenido;
        IngresoAcumulableTotal = ingresoAcumulableTotal;
        DeduccionesPersonalesAplicadas = deduccionesPersonalesAplicadas;
        BaseGravableAcumulable = baseGravableAcumulable;
        IsrCausadoAcumulable = isrCausadoAcumulable;
        PagosAnticipadosAcumulable = pagosAnticipadosAcumulable;
        FechaCalculo = DateTime.UtcNow;
    }

    public int Id { get; private set; }

    public Guid DeclaracionAnualId { get; private set; }

    public decimal IsrResicoCausado { get; private set; }

    public decimal IsrResicoRetenido { get; private set; }

    public decimal SaldoResico => IsrResicoCausado - IsrResicoRetenido;

    public decimal IngresoAcumulableTotal { get; private set; }

    public decimal DeduccionesPersonalesAplicadas { get; private set; }

    public decimal BaseGravableAcumulable { get; private set; }

    public decimal IsrCausadoAcumulable { get; private set; }

    public decimal PagosAnticipadosAcumulable { get; private set; }

    public decimal SaldoAcumulable => IsrCausadoAcumulable - PagosAnticipadosAcumulable;

    public decimal SaldoTotal => SaldoResico + SaldoAcumulable;

    public bool EsSaldoAFavor => SaldoTotal < 0;

    public DateTime FechaCalculo { get; private set; }
}
