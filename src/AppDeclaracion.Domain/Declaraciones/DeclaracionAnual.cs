using AppDeclaracion.Domain.ActividadEmpresarial;
using AppDeclaracion.Domain.Arrendamiento;
using AppDeclaracion.Domain.Resico;
using AppDeclaracion.Domain.SueldosYSalarios;

namespace AppDeclaracion.Domain.Declaraciones;

public class DeclaracionAnual
{
    private readonly List<DeduccionPersonal> _deduccionesPersonales = [];

    private DeclaracionAnual() { }

    public DeclaracionAnual(Guid usuarioId, int ejercicio)
    {
        if (ejercicio < 2020 || ejercicio > DateTime.UtcNow.Year)
        {
            throw new ArgumentOutOfRangeException(nameof(ejercicio), "Ejercicio fiscal fuera de rango válido.");
        }

        Id = Guid.NewGuid();
        UsuarioId = usuarioId;
        Ejercicio = ejercicio;
        Estatus = EstatusDeclaracion.Borrador;
        FechaCreacion = DateTime.UtcNow;
    }

    public Guid Id { get; private set; }

    public Guid UsuarioId { get; private set; }

    public int Ejercicio { get; private set; }

    public EstatusDeclaracion Estatus { get; private set; }

    public DateTime FechaCreacion { get; private set; }

    public IngresoResico? IngresoResico { get; private set; }

    public IngresoSueldos? IngresoSueldos { get; private set; }

    public IngresoActividadEmpresarial? IngresoActividadEmpresarial { get; private set; }

    public IngresoArrendamiento? IngresoArrendamiento { get; private set; }

    public IReadOnlyCollection<DeduccionPersonal> DeduccionesPersonales => _deduccionesPersonales.AsReadOnly();

    public ResultadoCalculo? Resultado { get; private set; }

    public IngresoResico EstablecerIngresoResico()
    {
        IngresoResico = new IngresoResico(Id);
        Estatus = EstatusDeclaracion.Borrador;
        return IngresoResico;
    }

    public void EstablecerIngresoSueldos(decimal ingresoGravado, decimal isrRetenido)
    {
        IngresoSueldos = new IngresoSueldos(Id, ingresoGravado, isrRetenido);
        Estatus = EstatusDeclaracion.Borrador;
    }

    public IngresoActividadEmpresarial EstablecerIngresoActividadEmpresarial(
        decimal ingresosCobrados, decimal pagosProvisionalesRealizados)
    {
        IngresoActividadEmpresarial = new IngresoActividadEmpresarial(Id, ingresosCobrados, pagosProvisionalesRealizados);
        Estatus = EstatusDeclaracion.Borrador;
        return IngresoActividadEmpresarial;
    }

    public IngresoArrendamiento EstablecerIngresoArrendamiento(
        decimal ingresosCobrados, TipoDeduccionArrendamiento tipoDeduccion, decimal pagosProvisionalesRealizados)
    {
        IngresoArrendamiento = new IngresoArrendamiento(Id, ingresosCobrados, tipoDeduccion, pagosProvisionalesRealizados);
        Estatus = EstatusDeclaracion.Borrador;
        return IngresoArrendamiento;
    }

    public void EstablecerDeduccionesPersonales(IEnumerable<(TipoDeduccionPersonal Tipo, decimal Monto)> deducciones)
    {
        _deduccionesPersonales.Clear();
        _deduccionesPersonales.AddRange(deducciones.Select(d => new DeduccionPersonal(Id, d.Tipo, d.Monto)));
        Estatus = EstatusDeclaracion.Borrador;
    }

    public void AsignarResultado(ResultadoCalculo resultado)
    {
        Resultado = resultado;
        Estatus = EstatusDeclaracion.Calculada;
    }
}
