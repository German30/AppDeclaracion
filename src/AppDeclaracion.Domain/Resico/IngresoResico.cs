namespace AppDeclaracion.Domain.Resico;

public class IngresoResico
{
    private readonly List<IngresoMensualResico> _meses = [];

    private IngresoResico() { }

    public IngresoResico(Guid declaracionAnualId)
    {
        DeclaracionAnualId = declaracionAnualId;
    }

    public int Id { get; private set; }

    public Guid DeclaracionAnualId { get; private set; }

    public IReadOnlyCollection<IngresoMensualResico> Meses => _meses.AsReadOnly();

    public void EstablecerMes(int mes, decimal ingresoCobrado, decimal retencionIsr)
    {
        _meses.RemoveAll(m => m.Mes == mes);
        _meses.Add(new IngresoMensualResico(mes, ingresoCobrado, retencionIsr));
    }

    public decimal IngresoAnual => _meses.Sum(m => m.IngresoCobrado);

    public decimal RetencionAnual => _meses.Sum(m => m.RetencionIsr);
}
