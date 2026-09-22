using AppDeclaracion.Application.Abstractions;
using AppDeclaracion.Domain.Declaraciones;

namespace AppDeclaracion.Application.Tests.Declaraciones;

/// <summary>
/// Repositorio en memoria para probar DeclaracionAnualService sin depender de EF Core.
/// </summary>
public sealed class FakeDeclaracionRepository : IDeclaracionRepository
{
    private readonly Dictionary<Guid, DeclaracionAnual> _declaraciones = [];

    public Task<DeclaracionAnual?> ObtenerPorIdAsync(Guid id, Guid usuarioId, CancellationToken ct)
    {
        _declaraciones.TryGetValue(id, out var declaracion);
        var pertenece = declaracion is not null && declaracion.UsuarioId == usuarioId;
        return Task.FromResult(pertenece ? declaracion : null);
    }

    public Task<IReadOnlyList<DeclaracionAnual>> ListarPorUsuarioAsync(Guid usuarioId, CancellationToken ct) =>
        Task.FromResult<IReadOnlyList<DeclaracionAnual>>(
            _declaraciones.Values.Where(d => d.UsuarioId == usuarioId).ToList());

    public Task AgregarAsync(DeclaracionAnual declaracion, CancellationToken ct)
    {
        _declaraciones[declaracion.Id] = declaracion;
        return Task.CompletedTask;
    }

    public Task GuardarCambiosAsync(CancellationToken ct) => Task.CompletedTask;
}
