namespace AppDeclaracion.Domain.Common;

// Verificar anualmente contra la publicación oficial del INEGI/DOF de la UMA vigente
// para el ejercicio fiscal que se está declarando.
public static class ParametrosFiscales
{
    public const decimal UmaDiaria = 108.57m;

    public const int DiasUmaAnual = 365;

    public static decimal UmaAnual => UmaDiaria * DiasUmaAnual;
}
