using AppDeclaracion.Application.Abstractions;
using AppDeclaracion.Domain.Declaraciones;
using AppDeclaracion.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AppDeclaracion.Infrastructure.Repositories;

public sealed class DeclaracionRepository(AppDbContext context) : IDeclaracionRepository
{
    public Task<DeclaracionAnual?> ObtenerPorIdAsync(Guid id, Guid usuarioId, CancellationToken ct) =>
        Consulta().FirstOrDefaultAsync(d => d.Id == id && d.UsuarioId == usuarioId, ct);

    public async Task<IReadOnlyList<DeclaracionAnual>> ListarPorUsuarioAsync(Guid usuarioId, CancellationToken ct) =>
        await Consulta().Where(d => d.UsuarioId == usuarioId).OrderByDescending(d => d.Ejercicio).ToListAsync(ct);

    public async Task AgregarAsync(DeclaracionAnual declaracion, CancellationToken ct) =>
        await context.Declaraciones.AddAsync(declaracion, ct);

    public Task GuardarCambiosAsync(CancellationToken ct) => context.SaveChangesAsync(ct);

    private IQueryable<DeclaracionAnual> Consulta() =>
        context.Declaraciones
            .Include(d => d.IngresoResico).ThenInclude(i => i!.Meses)
            .Include(d => d.IngresoSueldos)
            .Include(d => d.IngresoActividadEmpresarial).ThenInclude(i => i!.Deducciones)
            .Include(d => d.IngresoArrendamiento).ThenInclude(i => i!.Deducciones)
            .Include(d => d.DeduccionesPersonales)
            .Include(d => d.Resultado);
}
