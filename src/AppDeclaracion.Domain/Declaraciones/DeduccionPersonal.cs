namespace AppDeclaracion.Domain.Declaraciones;

public class DeduccionPersonal
{
    private DeduccionPersonal() { }

    public DeduccionPersonal(Guid declaracionAnualId, TipoDeduccionPersonal tipo, decimal monto)
    {
        if (monto < 0)
        {
            throw new ArgumentException("El monto no puede ser negativo.", nameof(monto));
        }

        DeclaracionAnualId = declaracionAnualId;
        Tipo = tipo;
        Monto = monto;
    }

    public int Id { get; private set; }

    public Guid DeclaracionAnualId { get; private set; }

    public TipoDeduccionPersonal Tipo { get; private set; }

    public decimal Monto { get; private set; }
}
