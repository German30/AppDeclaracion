using AppDeclaracion.Domain.Declaraciones;

namespace AppDeclaracion.Application.Abstractions;

public interface IDeclaracionRepository
{
    Task<DeclaracionAnual?> ObtenerPorIdAsync(Guid id, Guid usuarioId, CancellationToken ct);

    Task<IReadOnlyList<DeclaracionAnual>> ListarPorUsuarioAsync(Guid usuarioId, CancellationToken ct);

    Task AgregarAsync(DeclaracionAnual declaracion, CancellationToken ct);

    Task GuardarCambiosAsync(CancellationToken ct);
}
