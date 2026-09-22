using AppDeclaracion.Domain.Common;

namespace AppDeclaracion.Domain.ActividadEmpresarial;

public static class ActividadEmpresarialCalculator
{
    public static AportacionBaseAcumulable Calcular(IngresoActividadEmpresarial ingreso)
    {
        var utilidadFiscal = Math.Max(0m, ingreso.IngresosCobrados - ingreso.TotalDeducciones);

        return new AportacionBaseAcumulable(
            IngresoAcumulable: utilidadFiscal,
            PagosAnticipados: ingreso.PagosProvisionalesRealizados);
    }
}
